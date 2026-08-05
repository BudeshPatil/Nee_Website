import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ProjectService } from '../../../providers/project/project.service';
import { SeoService } from '../../../providers/seo/seo.service';
import Swiper from 'swiper';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import * as AOS from 'aos';
import { ContactService } from '../../../providers/contact/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  projectData: any;
  normalizedPhases: any[] = [];
  selectedPhaseIndex = 0;
  selectedPhase: any = null;
  recentProjects: any[] = [];
  imagePath = environment.baseUrl + '/public/';
  googleMapsApiKey = 'AIzaSyC8DsL4Thth1K1cdKX_x_f3zsWaLuFzwoY'; // Replace with your actual API key
  private swiper: Swiper | null = null;
  private designImagesSwiper: Swiper | null = null;
  isBrowser = false;
  getmapUrl = '';
  addcontactForm: FormGroup;
  submitted: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  throw_msg: any;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  service: any;
  isvalidSubmit: boolean = true;
  private isInitialized = false;
  dropdownOpen = false;
  selectedService:any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private seo: SeoService,
    private cdr: ChangeDetectorRef,
    private contactservice: ContactService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.addcontactForm = this.formBuilder.group({
          firstname: ['', Validators.required],
          email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
          phone: ['', Validators.required],
          subject: ['price_on_request', Validators.required],
          message: [''],
        });
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.route.params.subscribe(() => {
      this.loadProject();
      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      Swiper.use([Autoplay, Pagination, Navigation]);
      
      // Initialize main gallery swiper
      this.swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 5000 },
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }
      });
      
    }, 500);
  }

  private initDesignImagesSwiper(): void {
    if (!this.isBrowser) return;

    const images = this.projectData?.project_design_images || [];
    const loopMode = images.length > 2;

    this.designImagesSwiper?.destroy(true, true);

    this.designImagesSwiper = new Swiper('.designImagesSwiper', {
      slidesPerView: 1,
      loop: loopMode,
      autoplay: { delay: 4000 },
      spaceBetween: 12,
      watchOverflow: true,
      pagination: { el: '.design-swiper-pagination', clickable: true },
      navigation: {
        nextEl: '.design-swiper-button-next',
        prevEl: '.design-swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 12,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 16,
        },
        1200: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
      },
    });
  }

  loadProject(): void {
    const urlKey = this.route.snapshot.paramMap.get('url_key');
    if (!urlKey) {
      console.error('Missing url_key for project details route');
      return;
    }

    this.projectService.getProjectsByURL({ url_key: urlKey }).subscribe(
      res => {
        if (res?.code === 200 && res.result) {
          this.projectData = res.result;
          this.normalizedPhases = this.normalizePhases(this.projectData?.phases);
          // select the first phase with animation for a polished initial render
          if (this.normalizedPhases.length) {
            this.selectPhaseWithAnimation(0);
          }
          this.service = this.projectData?.name || null;
          this.getGoogleMapsEmbedUrl(this.projectData?.location || '');
          this.recentProjects = res.result.related_prjects || [];
          this.seo.updateProjectMeta(urlKey, `/project/${urlKey}`);
          setTimeout(() => this.initDesignImagesSwiper(), 100);
        } else {
          console.error('Project details response invalid', res);
        }
      },
      err => {
        console.error('Project details fetch failed', err);
      }
    );
  }

  onImageLoad(): void {
    if (this.isBrowser) AOS.refresh();
  }

  // Get the total number of images for navigation display
  getImageCount(): number {
    if (!this.projectData) return 0;

    if (this.projectData.images && Array.isArray(this.projectData.images)) {
      return this.projectData.images.length;
    }

    if (this.projectData.image) {
      return 1;
    }

    return 0;
  }

  normalizePhases(phases: any): any[] {
    if (!phases) {
      return [];
    }
    if (Array.isArray(phases)) {
      return phases.filter(phase => phase && typeof phase === 'object');
    }
    if (typeof phases === 'string') {
      try {
        const parsed = JSON.parse(phases);
        if (Array.isArray(parsed)) {
          return parsed.filter(phase => phase && typeof phase === 'object');
        }
      } catch {
        return [];
      }
    }
    if (typeof phases === 'object') {
      return [phases];
    }
    return [];
  }

  selectedPhaseImage: string | null = null;
  selectedPhaseDetails: { label: string; value: string; icon: string }[] = [];
  selectedPhaseAdditionalFields: { label: string; value: string }[] = [];
  phaseAnimating: boolean = true;

  selectPhase(index: number): void {
    this.selectedPhaseIndex = index;
    this.selectedPhase = this.normalizedPhases[index] || null;

    if (!this.selectedPhase) {
      this.selectedPhaseImage = null;
      this.selectedPhaseDetails = [];
      this.selectedPhaseAdditionalFields = [];
      return;
    }

    this.selectedPhaseImage = this.selectedPhase.image || this.selectedPhase.project_images?.[0] || null;

    const details: { label: string; value: string; icon: string }[] = [];
    if (this.selectedPhase.area) {
      details.push({ label: 'Area', value: this.selectedPhase.area, icon: 'fas fa-chart-area text-primary me-2' });
    }
    if (this.selectedPhase.noofplots || this.selectedPhase.plots) {
      details.push({ label: 'Plots', value: this.selectedPhase.noofplots || this.selectedPhase.plots, icon: 'fas fa-th text-primary me-2' });
    }
    if (this.selectedPhase.dimentions) {
      details.push({ label: 'Dimensions', value: this.selectedPhase.dimentions, icon: 'fas fa-ruler-combined text-primary me-2' });
    }
    if (this.selectedPhase.price) {
      details.push({ label: 'Price', value: this.selectedPhase.price, icon: 'fas fa-tags text-primary me-2' });
    }
    if (this.selectedPhase.location) {
      details.push({ label: 'Location', value: this.selectedPhase.location, icon: 'fas fa-map-marker-alt text-primary me-2' });
    }
    this.selectedPhaseDetails = details;
  }

  // Wrap selectPhase to animate content when switching
  selectPhaseWithAnimation(index: number): void {
    this.phaseAnimating = false;
    this.selectPhase(index);
    // small delay to allow CSS transition
    setTimeout(() => {
      this.phaseAnimating = true;
    }, 20);
  }

  trackPhaseBy(index: number, phase: any): any {
    return phase?.id || phase?.name || index;
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  prettyKey(key: string): string {
    return key ? key.replace(/_/g, ' ') : key;
  }

  // Generate Google Maps embed URL for unmapped locations or coordinates
  getGoogleMapsEmbedUrl(location: string): void {
    if (!location) {
      this.getmapUrl = '';
      return;
    }

    // Check if location is already an embedded URL from admin panel
    if (this.isEmbeddedUrl(location)) {
      this.getmapUrl = location;
      return;
    }

    // Check if location is a Google Maps short URL and try to convert it
    if (this.isShortUrl(location)) {
      // For short URLs, we'll use a search embed with the short URL as query
      // This might not work perfectly but gives a fallback
      this.getmapUrl = `https://www.google.com/maps/embed/v1/search?key=${this.googleMapsApiKey}&q=${encodeURIComponent(location)}`;
      return;
    }

    // Check if location is coordinates (lat,lng format)
    if (this.isCoordinates(location)) {
      const [lat, lng] = location.split(',').map(coord => coord.trim());
      this.getmapUrl = `https://www.google.com/maps/embed/v1/view?key=${this.googleMapsApiKey}&center=${lat},${lng}&zoom=15`;
      return;
    }

    // Clean and format the location for better search results
    const formattedLocation = this.formatLocationForMaps(location);

    // Use search embed for unmapped locations - more flexible
    this.getmapUrl = `https://www.google.com/maps/embed/v1/search?key=${this.googleMapsApiKey}&q=${encodeURIComponent(formattedLocation)}&zoom=15`;
  }

  // Generate Google Maps embed URL
  // getGoogleMapsEmbedUrl(location: string): string {
  //   if (!location) return '';
  //   return `https://www.google.com/maps/embed/v1/place?key=${this.googleMapsApiKey}&q=${encodeURIComponent(location)}`;
  // }

  // Alternative: Use place embed with fallback to search
  getGoogleMapsEmbedUrlAlternative(location: string): string {
    if (!location) return '';

    const formattedLocation = this.formatLocationForMaps(location);

    // Try place first, but for unmapped locations, search works better
    return `https://www.google.com/maps/embed/v1/search?key=${this.googleMapsApiKey}&q=${encodeURIComponent(formattedLocation)}`;
  }

  // Check if the location string contains coordinates
  isCoordinates(location: string): boolean {
    // Match pattern like "15.360177292097179, 75.1325792245012" or "15.360177292097179,75.1325792245012"
    const coordinateRegex = /^-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?$/;
    return coordinateRegex.test(location.trim());
  }

  // Check if the location string is already an embedded URL
  isEmbeddedUrl(location: string): boolean {
    return location.includes('google.com/maps/embed') ||
           location.includes('maps/embed') ||
           location.startsWith('https://www.google.com/maps/embed');
  }

  // Check if the location string is a Google Maps short URL
  isShortUrl(location: string): boolean {
    return location.includes('maps.app.goo.gl') ||
           location.includes('goo.gl/maps') ||
           location.startsWith('https://maps.app.goo.gl');
  }

  // Format location string for better Google Maps results (only for address strings)
  private formatLocationForMaps(location: string): string {
    if (!location) return '';

    // Add country if not present (helps with unmapped locations)
    if (!location.toLowerCase().includes('india') &&
        !location.toLowerCase().includes('uae') &&
        !location.toLowerCase().includes('India')) {
      location += ', India'; // Adjust based on your target country
    }

    // Clean up common formatting issues
    return location
      .replace(/\s+/g, ' ') // Multiple spaces to single
      .trim();
  }

  // Generate Google Maps directions URL for unmapped locations or coordinates
  getGoogleMapsDirectionsUrl(location: string): string {
    if (!location) return '';

    // If it's an embedded URL, we can't generate directions from it
    if (this.isEmbeddedUrl(location)) {
      return '#'; // Return a placeholder or handle differently
    }

    // For short URLs, use them directly as they redirect to Google Maps
    if (this.isShortUrl(location)) {
      return location;
    }

    if (this.isCoordinates(location)) {
      const [lat, lng] = location.split(',').map(coord => coord.trim());
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }

    const formattedLocation = this.formatLocationForMaps(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formattedLocation)}`;
  }

  // Get directions from current location to project (coordinates or address)
  getDirectionsToProject(location: string): string {
    if (!location) return '';

    // If it's an embedded URL, we can't generate directions from it
    if (this.isEmbeddedUrl(location)) {
      return '#'; // Return a placeholder or handle differently
    }

    // For short URLs, we can try to use them in directions
    if (this.isShortUrl(location)) {
      return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location)}`;
    }

    if (this.isCoordinates(location)) {
      const [lat, lng] = location.split(',').map(coord => coord.trim());
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    }

    const formattedLocation = this.formatLocationForMaps(location);
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formattedLocation)}`;
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);
    this.swiper = null;
    this.designImagesSwiper?.destroy(true, true);
    this.designImagesSwiper = null;
  }

  public hasError = (controlName: string, errorName: string) => {
    // return this.addcontactForm.controls[controlName].hasError(errorName);
    const control = this.addcontactForm.get(controlName);
    return control?.hasError(errorName) && (control.dirty || control.touched || this.submitted);
  };
  public hasEmailError = (controlName: string, errorName: string) => {
		if (this.addcontactForm.controls['email'].value == "") {
			return "Email is required";
		} else if (this.addcontactForm.controls['email'].status == "INVALID") {
			return "Invalid Email";
		} else {
			return this.addcontactForm.controls['email'].hasError(errorName);
		}
	};

  onSubmit() {
    this.submitted = true;
    let obj = this.addcontactForm.value;
    if (this.service) {
      obj['product'] = this.service;
    }
    if (this.addcontactForm.invalid) {
      return;
    }
    if (this.isvalidSubmit == false) {
      return
    }
    let internationalNumber = this.addcontactForm.get('phone')?.value;
    obj['phone'] = internationalNumber.internationalNumber;
    this.contactservice.addContact(obj).subscribe(
      (response) => {
        if (response.code == 200) {
          this.throw_msg = response.message;
          this.msg_success = true;
          // Hide msg_success after 5 seconds
          setTimeout(() => {
            this.msg_success = false;
          }, 5000);
          this.submitted = true;
          setTimeout(() => {
            this.submitted = false;
            this.addcontactForm.reset();
            this.isvalidSubmit = true;
            // Reset the dropdown display value
            this.selectedService = '';
            // Also close the dropdown
            this.dropdownOpen = false;
          }, 3000);
        }
        else if (response.code == 400) {
          this.throw_msg = response.message;
          this.addcontactForm.reset();
          this.msg_danger = true;
        }
      },
    );
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectProject(url_key: string): void {
    this.router.navigate(['/portfolio', url_key]);
  }

   onSelectProject(data){
    this.service = data;
  }
}
