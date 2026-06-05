import {
  AfterViewInit,
  Component,
  OnDestroy,
  Renderer2,
  Inject,
  PLATFORM_ID,
  ViewChild,
  ElementRef,
  signal,
  effect,
  computed
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { environment } from '../../../environments/environment';
import { Mousewheel, EffectCreative } from 'swiper/modules';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../providers/data/data.service';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../providers/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../providers/contact/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
register();

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements AfterViewInit, OnDestroy {
  baseUrl: string = environment.url;
  private observer: IntersectionObserver | null = null;
  private visibleSlides = new Set<number>();
  private destroy$ = new Subject<void>();
  imagePath: string = environment.baseUrl + '/public/';

  servicesData: any = [];
  selectedCategory: string = 'all';

  allProjects: any = [];
  projects: any[] = [];

  activecategory: string = '';
  bannerData: any = [];
  totalPages: any;
  pages: any;
  displayedList: any = [];
  sortOption: any ='latest';
  selectedCategoryId: any;
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
  @ViewChild('closeModal') closeModal!: ElementRef;
  isBrowser: boolean;
  totalRecord: number = 0;
  currentLimit = signal(10);
  currentPage = 1;
  noofelemtPage = computed(() => `${this.currentLimit()} Products`);
  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dataService: DataService,
    public categoryService: CategoryService,
    private router: Router,
    private contactservice: ContactService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
  ) {
    this.getAllprojects();
    this.getAllServices();
    this.getBannerdata();
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.route.params.subscribe(params => { 
      this.activecategory = params['category'] || '';
    });
    this.addcontactForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', Validators.required],
      subject: ['price_on_request', Validators.required],
      message: [''],
    });
    effect(() => {
      this.getAllprojects();
    })
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const swiperEl = document.querySelector('swiper-container');
      if (swiperEl) {
        Object.assign(swiperEl, this.swiperConfig);
        // @ts-ignore
        swiperEl.initialize();
        // this.setupImageLoading();
      }
      window.scrollTo(0, 0);
    }
    
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
     if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      this.route.paramMap.subscribe(params => {
        const serviceName = params.get('url_key');
        if (serviceName) {
          this.selectedService = serviceName;
          this.addcontactForm.get('service')?.setValue(serviceName);
        }
      });
    }
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
            this.closeModal.nativeElement.click();
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

  setSort(s) {
    this.sortOption = s;
    this.currentPage = 1;
    this.getAllprojects();
  }

  setNoPage(limit){
    this.currentLimit.set(limit);
  }

  getBannerdata() {
    let obj = {};
    this.dataService.getAllBanner(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          let tempcat = response.result.filter((cat: any) => cat.name == 'about');
          if (tempcat && tempcat.length > 0) {
            this.bannerData = tempcat;
          }
        } else {
        }
      }
    });
  }

  swiperConfig: SwiperOptions = {
    direction: 'vertical',
    modules: [Mousewheel, EffectCreative],
    slidesPerView: 1,
    grabCursor: true,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
    loop: false,
    rewind: false,
    mousewheel: {
      // releaseOnEdges: true,
      releaseOnEdges: false,
      sensitivity: 1,
      forceToAxis: true
    },
    speed: 900,
    resistance: true,
    resistanceRatio: 1,
    pagination: false,
    effect: 'creative',
    creativeEffect: {
      prev: {
        translate: ["0%", 0, -1],
      },
      next: {
        translate: [0, "100%", 0],
      },
    }
  };

  isActive(categoryId: string): boolean {
    return this.selectedCategory === categoryId;
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.selectedCategory = categoryId;
    this.currentPage = 1;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      const swiperEl = document.querySelector('swiper-container');
      if (swiperEl?.swiper) {
        swiperEl.swiper.slideTo(0, 0);
        swiperEl.swiper.update();
      }
    }, 150);
    this.getAllprojects();
  }

  private updateDisplayedItems(): void {
    if (this.selectedCategory === 'all') {
      this.projects = Object.values(this.allProjects)
        .flat()
        .sort((a: any, b: any) => (a.sequence_number || 0) - (b.sequence_number || 0));
    } else {
      this.projects = (this.allProjects[this.selectedCategory] || [])
        .slice() // prevent mutation
        .sort((a: any, b: any) => (a.sequence_number || 0) - (b.sequence_number || 0));
    }
  }


  getAllprojects(): void {
    const obj = {
      limit: this.currentLimit(),
      page: this.currentPage,
      sort: this.sortOption,
      selected_status: this.selectedCategoryId,
    };
    this.dataService
      .getAllProjects(obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.code === 200 && response.result) {
          this.allProjects = response.result;
          this.totalRecord = response?.count ?? (response.result?.length || 0);
          this.totalPages = Math.max(Math.ceil(this.totalRecord / this.currentLimit()), 1);
          this.pages = Array.from({ length: this.totalPages }, (_, idx) => idx + 1);
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages;
          }
        }
      });
  }

  onListChangePage(event: any) {
    this.currentPage = Number(event) || 1;
    this.getAllprojects();
  }

  changePage(delta: number) {
    const nextPage = this.currentPage + delta;
    if (nextPage < 1 || nextPage > this.totalPages) {
      return;
    }
    this.currentPage = nextPage;
    this.getAllprojects();
  }

  goToPage(page: number) {
    const nextPage = Number(page) || 1;
    if (nextPage === this.currentPage || nextPage < 1 || nextPage > this.totalPages) {
      return;
    }
    this.currentPage = nextPage;
    this.getAllprojects();
  }

  getAllServices(): void {
    const obj = {};
    this.categoryService
      .getAllCategory(obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.code === 200 && response.result?.length > 0) {
          this.servicesData = [
            { _id: 'all', name: 'All' },
            ...response.result,
          ];
          if (this.activecategory) {
            response.result.forEach((cat: any) => {
              if (cat.url_key.toLowerCase() === this.activecategory.toLowerCase()) {
                this.selectedCategory = cat._id;
              }
            });
          } else {
            this.selectedCategory = 'all';
          }
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OnGoing Project':
        return 'status-ongoing';
      case 'Completed Projects':
        return 'status-completed';
      case 'Featured Project':
        return 'status-featured';
      default:
        return '';
    }
  }
}