import { Component, Inject, PLATFORM_ID, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { DataService } from '../providers/data/data.service';
import { environment } from '../../environments/environment';
import { CategoryService } from '../providers/category/category.service';
// import { SwiperSliderComponent } from '../components/swiper-slider/swiper-slider.component';
import { response } from 'express';
// declare var Swiper: any;
import { Swiper } from 'swiper';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
Swiper.use([Navigation, Pagination, Autoplay, EffectFade]);
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Subject, takeUntil } from 'rxjs';
import { ContactService } from '../providers/contact/contact.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private shopcategorySwiper: Swiper | null = null;
  private trendSwiperSwiper: Swiper | null = null;
  private exploreswiperSwiper: Swiper | null = null;
  private bannerSwiper: Swiper | null = null;
  private testimonialSwiper: Swiper | null = null; // track instance
  services = [];
  bannerData: any = [];
  aboutData: any = [];
  servicesData: any = [];
  clientsData: any = [];
  counterData: any;
  projects: any = [];
  testimonialData: any = [];
  bannerRecord: any;
  shopbyData: any;
  categorycollection: any;
  imagePath: any;
  isBrowser: boolean;
  baseUrl: any;
  showPopup: boolean = false;
  collectionTypes: any = [];
  bestSellingData: any = [];
  recentProjects: any = [];
  recentProjectActive: any;
  productData: any = [];
  blogsData: any = [];
  currentLimit = 50;
  currentPage = 1;
  totalRecord = 0;
  nodata_msg = false;
  expandedIndex: number = 0;
  expandedFaqIndex: number | null = 0;
  stats = [
    { label: 'HOMES TRANSFORMED', value: 120, suffix: '+' },
    { label: 'COMMERCIAL SPACES DESIGNED', value: 50, suffix: '+' },
    { label: 'CLIENT SATISFACTION RATE', value: 98, suffix: '%' },
    { label: 'YEARS OF DESIGN EXPERIENCE', value: 14, suffix: '' }
  ];
  faqData = [
    {
      id: 'faq1',
      question: 'Listen and Collaborate',
      // answer: 'Neelgund\'s successful projects are rooted in strong relationships and detailed collaboration. Through our process, we learn how our clients imagine and translate those insights into a tailored vision — interior design that makes a difference.'
      answer: 'Neelgund\'s successful projects are rooted in strong relationships and detailed collaboration. We translate client insights into tailored Interior Designs that make a difference.'
    },
    {
      id: 'faq2',
      question: 'Envision and Design',
      answer: "Neelgund offers a forward-thinking design process, where we provide design solutions based on our clients' needs and utilise our extensive experience in our specialised fields of interior design."
    },
    {
      id: 'faq3',
      question: 'Partner and Build Relationships',
      answer: 'PHD believes in enduring partnerships and strong relationships in its design processes. Allowing close communication and coordination of designs ensures a superior product.'
    }
  ];
  images: string[] = [
    'assets/images/home/our-process.png',
    'assets/images/home/our-process1.png',
    'assets/images/home/our-process2.png'
  ];
  faqItems = [
    {
      question: 'Are your projects NA and KJP approved?',
      answer:
        'Yes, many of our projects are developed in compliance with applicable regulations, and NA and KJP-approved projects will have their registration details clearly mentioned. Please contact us for project-specific information.',
    },
    {
      question: 'What types of properties do you offer?',
      answer:
        'We primarily offer residential plots, gated community developments, and selected commercial plot opportunities in prime locations.',
    },
    {
      question: 'Where are your projects located?',
      answer:
        'Our projects are strategically located in and around Hubli-Dharwad, including Gadag Road, Kusugal Road, and other rapidly developing areas.',
    },
    {
      question: 'Do you provide bank loan assistance?',
      answer:
        'Yes. We can guide customers through the loan process and connect them with leading banks and financial institutions, subject to eligibility.',
    },
    {
      question: 'What documents will I receive after purchasing a plot?',
      answer:
        'You will receive all legally required documents, including sale deed documentation, approvals, and other relevant records associated with the project.',
    },
    {
      question: 'Can I visit the site before booking?',
      answer:
        'Absolutely. We encourage customers to schedule a site visit to inspect the location, amenities, and surrounding infrastructure before making a decision.',
    },
    {
      question:"What amenities are available in your layouts?",
      answer: "Amenities vary by project and may include wide roads, drainage systems, street lighting, parks, children's play areas, water supply, and gated security."
    },
    {
      question:"Are the plots suitable for immediate construction?",
      answer: "Many of our projects are developed with necessary infrastructure to support residential construction. Availability may vary by project"
    },
    {
      question:"Why choose Neelgund Developers?",
      answer:"With over 40 years of experience, 60+ projects, and thousands of satisfied customers, we focus on transparency, legal clarity, quality development, and customer satisfaction."
    }
  ];
  currentImage = this.images[0];

  showImage(index: number) {
    this.currentImage = this.images[index];
  }
  currentValues: number[] = [];
  categories = [];

  isHovered = false;
  onMouseEnter(i: any) {
    this.isHovered = true;
  }
  onMouseLeave(i: any) {
    this.isHovered = false;
  }
  selectedCategory: string = 'all';
  allProjects: any = [];
  completedProjects: any = [];
  private destroy$ = new Subject<void>();
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
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    public dataService: DataService,
    public categoryService: CategoryService,
    private contactservice: ContactService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router, // injected for navigation events
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.getBannerdata();
    this.getAboutdata();
    this.getAllservices();
    this.getAllcounterData();
    this.getAllprojects();
    this.getAllprojects2();
    this.getAllblogs();
    // initiallblogs();
    // initial testimonial load moved to ngOnInit/router event
    this.isBrowser = isPlatformBrowser(this._platformId);
    this.imagePath = environment.baseUrl + '/public/';
    this.baseUrl = environment.url;
    this.addcontactForm = this.formBuilder.group({
          firstname: ['', Validators.required],
          email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
          phone: ['', Validators.required],
          subject: ['price_on_request', Validators.required],
          message: [''],
        });
  }

  ngOnInit(): void {
    this.currentValues = new Array(this.stats.length).fill(0);
    this.startCounting(); // Or call only when element is in view using IntersectionObserver
    if (isPlatformBrowser(this._platformId)) {
      window.scrollTo(0, 0);
    }

    // refresh testimonials whenever we navigate to home
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && (event.url === '/' || event.urlAfterRedirects === '/')) {
        this.gettestimonials();
      }
    });

    // initial load
    this.gettestimonials();
    if (isPlatformBrowser(this._platformId)) {
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

  trackByFn(data:any){
    return data.id;
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  startCounting() {
    this.stats.forEach((stat, index) => {
      const duration = 1500; // 1.5 seconds
      const stepTime = Math.max(Math.floor(duration / stat.value), 20);

      const interval = setInterval(() => {
        if (this.currentValues[index] < stat.value) {
          this.currentValues[index]++;
        } else {
          clearInterval(interval);
        }
      }, stepTime);
    });
  }

  activeIndex: number = 0;
  setDefaultCenterActive() {
    this.activeIndex = Math.floor(this.categories.length / 2); // center index
  }

  setActive(index: number) {
    this.activeIndex = index;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        const PureCounter = require('@srexi/purecounterjs'); // ✅ require only in browser
        new PureCounter(); // Initialize the counter
      }, 0);
      this.initBannerSwiper();
      this.initProjectHighlightsSwiper();
      // other swipers are initialized when data arrives
      this.getAllClients();
      this.initPortfolioSwiper();
      // this.initScrollTrigger();
    }
  }

  toggleAccordion(index: number): void {
    this.showImage(index);
    this.expandedIndex = this.expandedIndex === index ? -1 : index;


    if (this.isBrowser) {
      gsap.from('.process-animate', {
        clipPath: 'inset(0 0 100% 0)',
        ease: 'power3.out',
        duration: 1,
      })
    }
  }

  counter(i: number) {
    return new Array(i);
  }

  initBannerSwiper() {
    if (this.bannerSwiper) {
      this.bannerSwiper.destroy(true, true);
      this.bannerSwiper = null;
    }

    setTimeout(() => {
      if(this.isBrowser){
        const swiperElement = document.querySelector('.banner-swiper');
        const slides = document.querySelectorAll('.banner-swiper .swiper-slide');

        if (swiperElement && slides.length > 1) {
          this.bannerSwiper = new Swiper('.banner-swiper', {
            loop: true,
            slidesPerView: 1,
            speed: 1000,
            effect: 'fade',
            fadeEffect: {
              crossFade: true,
            },
            autoplay: {
              delay: 2000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
            navigation: {
              nextEl: '.banner-button-next',
              prevEl: '.banner-button-prev',
            },
            on: {
              slideChangeTransitionStart: function () {
                // Animation on slide change
              },
            },
          });
        }
      }
    }, 500);
  }

  initProjectHighlightsSwiper() {
    if (this.isBrowser) {
      new Swiper('.project-highlights-swiper', {
        loop: true,
        slidesPerView: 3,
        spaceBetween: 15,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.project-pagination',
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });
    }
  }

  initTestimonialsSwiper() {
    // destroy existing instance before creating again
    if (this.testimonialSwiper) {
      this.testimonialSwiper.destroy(true, true);
      this.testimonialSwiper = null;
    }

    if (this.isBrowser) {
      this.testimonialSwiper = new Swiper('.review-swiper', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 3,
        spaceBetween: 30,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.review-pagination',
          clickable: true,
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1200: {
            slidesPerView: 3,
          },
        },
      });
  }
  }

  public initPortfolioSwiper() {
    if (this.isBrowser) {
      new Swiper('.portfolio-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 15,
        grabCursor: true,
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 2,
            spaceBetween: 30,
          }
        },
        pagination: {
          el: ".portfolio-pagination",
          clickable: true,
          renderBullet: function (index, className) {
            return `<span class="${className}"></span>`;
          },
        },
        on: {
          init: function () {
            // Optional: Add any initialization code here
          },
          slideChange: function () {
            // Optional: Handle slide change
          },
        },
      });
    }
  }

  ngOnDestroy() {
    if (this.bannerSwiper) {
      this.bannerSwiper?.destroy(true, true);
      this.bannerSwiper = null;
    }
  }
  // Your data methods remain unchanged...
  getBannerdata() {
    let obj = {};
    this.dataService.getAllBanner(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          this.bannerData = response.result;
          setTimeout(() => {
            this.initBannerSwiper();
          }, 0);
        } else {
          this.bannerData = [];
        }
      }
    });
  }

  getAboutdata() {
    let obj = {};
    this.dataService.getAllAbout(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          let temppage = response.result.filter((pagesection) => pagesection.page_section == 'home');
          if (temppage && temppage.length > 0) {
            this.aboutData = temppage;
          }

        }
      }
    });
  }


  getAllservices() {
    let obj = {};
    this.dataService.getAllService(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          this.servicesData = response.result;
        }
      }
    });
  }

  getAllClients() {
    let obj = {};
    this.dataService.getAllClients(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result != '') {
          this.clientsData = response.result;
        } else {
        }
      }
    })
  }

  getAllcounterData() {
    let obj = {};
    this.dataService.getcounterData(obj).subscribe((response: any) => {
      if (response.code == 200) {
        this.counterData = response.result;
      }
    });
  }

  getAllprojects() {
    let obj = {};
    this.dataService.getAllProjects(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result != '') {
          this.projects = response.result;
          this.completedProjects = this.projects.filter((project: any) => project.category_data[0] === 'Completed Projects');
          setTimeout(() => this.initProjectHighlightsSwiper(), 0);
          setTimeout(() => this.initPortfolioSwiper(), 0);
        } else {
        }
      }
    });
  }

  gettestimonials() {
    let obj = {};
    this.dataService.getAlltestimonial(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result != '') {
          this.testimonialData = response.result;
          // make sure swiper is initialized once data is rendered
          setTimeout(() => this.initTestimonialsSwiper(), 0);
        }
      }
    });
  }

  getAllblogs(){
    let obj = {};
    this.dataService.getallBlogs(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result != '') {
          this.blogsData = response.result;
        }
      }
    });
  }

  initScrollTrigger(): void {
    const tl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      }
    });
    tl.from('.sub-heading', {
      yPercent: -500,
    }, .5)

      .from('.heading', {
        yPercent: -200,
        duration: 2,
      }, .5)
      .from('.description', {
        yPercent: -200,
        duration: 2,
      }, .8)
      .from('.button', {
        opacity: 1,
        duration: 2,
      }, 1)
      .from('.content-animate', {
        clipPath: 'inset(0 0 100% 0)',
        duration: 2,
      }, 1);

    const scrollElems = gsap.utils.toArray('.scroll-animate') as HTMLElement[];

    scrollElems.forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(0 0 100% 0)',
        ease: 'power3.out',
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
        }
      });
    });

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

  getAllprojects2(): void {
    const obj = {
      limit: 1000,
    };
    this.dataService
      .getAllProjects(obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.code === 200 && response.result) {
          this.allProjects = response.result;

          this.updateDisplayedItems();
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

  selectProject(url_key: string): void {
    this.router.navigate(['/portfolio', url_key]);
  }

  onSelectProject(data){
    this.service = data;
  }

  toggleFaq(index: number): void {
    this.expandedFaqIndex = this.expandedFaqIndex === index ? null : index;
  }
}
