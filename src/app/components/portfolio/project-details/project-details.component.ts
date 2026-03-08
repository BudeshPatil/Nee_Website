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

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  projectData: any;
  recentProjects: any[] = [];
  imagePath = environment.baseUrl + '/public/';
  googleMapsApiKey = 'AIzaSyC8DsL4Thth1K1cdKX_x_f3zsWaLuFzwoY'; // Replace with your actual API key
  private swiper: Swiper | null = null;
  private designImagesSwiper: Swiper | null = null;
  isBrowser = false;
  getmapUrl = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private seo: SeoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
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
      
      // Initialize design images swiper
      this.designImagesSwiper = new Swiper('.designImagesSwiper', {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 4000 },
        pagination: { el: '.design-swiper-pagination', clickable: true },
        navigation: {
          nextEl: '.design-swiper-button-next',
          prevEl: '.design-swiper-button-prev',
        }
      });
    }, 500);
  }

  loadProject(): void {
    const urlKey = this.route.snapshot.paramMap.get('url_key')!;
    this.projectService.getProjectsByURL({ url_key: urlKey }).subscribe(res => {
      if (res?.code === 200) {
        this.projectData = res.result;
        this.getGoogleMapsEmbedUrl(this.projectData.location);
        this.recentProjects = res.result.related_prjects || [];
        this.seo.updateProjectMeta(urlKey, `/project/${urlKey}`);
        this.cdr.detectChanges();
      }
    });
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
        !location.toLowerCase().includes('dubai')) {
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
}
