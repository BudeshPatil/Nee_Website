import { Component, Inject, PLATFORM_ID, ElementRef, Renderer2 } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
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
gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private shopcategorySwiper: Swiper | null = null;
  private trendSwiperSwiper: Swiper | null = null;
  private exploreswiperSwiper: Swiper | null = null;
  private bannerSwiper: Swiper | null = null;
  services = [
    {
      'id': '01',
      'name': 'RESIDENTIAL DESIGN',
      'description': 'This is service 1',
      'img_url': 'assets/images/home/ph-our-service1.png',
      'url_key': 'services'
    },
    {
      'id': '02',
      'name': 'COMMERCIAL DESIGN',
      'description': 'This is service 1',
      'img_url': 'assets/images/home/ph-our-service2.png',
      'url_key': 'services'
    },
    {
      'id': '03',
      'name': 'EDUCATIONAL DESIGN',
      'description': 'This is service 1',
      'img_url': 'assets/images/home/ph-our-service3.png',
      'url_key': 'services'
    },
    {
      'id': '04',
      'name': 'HOSPITALITY DESIGN',
      'description': 'This is service 1',
      'img_url': 'assets/images/home/ph-our-service4.png',
      'url_key': 'services'
    },
  ];
  togethers = [
    {
      'id': '01',
      'name': 'The 5 Secrets To Pulling Off Simple, Minimal Design',
      'description': 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nunc Mattis Ligula Pellentesque Nisi Tristique Porta.',
      'img_url': 'assets/images/home/journal1.png',
      'url_key': 'services'
    },
    {
      'id': '02',
      'name': '9 Unique And Unusual Ways To Display Your TV',
      'description': 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nunc Mattis Ligula Pellentesque Nisi Tristique Porta.',
      'img_url': 'assets/images/home/journal2.png',
      'url_key': 'services'
    },
    {
      'id': '03',
      'name': 'Our Favorite Home Decor Trends Of The Year',
      'description': 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nunc Mattis Ligula Pellentesque Nisi Tristique Porta.',
      'img_url': 'assets/images/home/journal3.png',
      'url_key': 'services'
    }
  ];
  slides1 = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5', 'Slide 6', 'Slide 7', 'Slide 8', 'Slide 9', 'Slide 10'];

  customSlides = [
    {
      name: 'Explore',
      image: 'assets/images/home/explore/explore-product-slide1.png',
      title: 'Custom Slide 1',
      description: 'This is custom description 1',
      price: 8299,
    },
    {
      name: 'Explore',
      image: 'assets/images/home/explore/explore-product-slide2.png',
      title: 'Custom Slide 2',
      description: 'This is custom description 2',
      price: 9299,
    },
    {
      name: 'Explore',
      image: 'assets/images/home/explore/explore-product-slide3.png',
      title: 'Custom Slide ',
      description: 'This is custom description 2',
      price: 7299,
    },
    {
      name: 'Explore 4',
      image: 'assets/images/home/explore/explore-product-slide3.png',
      title: 'Custom Slide ',
      description: 'This is custom description 2',
      price: 7299,
    },
  ];
  projectHighlights = [
    {
      name: 'Neelgund Green Valley',
      location: 'Hubli – Dharwad',
      area: '25 Acres',
      plots: 320,
      year: 2022,
      dimensions: '30x40, 40x60',
      amenities: [
        'Black Top Roads',
        'Underground Drainage',
        'Parks & Open Spaces',
        'Street Lighting',
        '24/7 Security'
      ],
      image: 'assets/images/home/explore/explore-product-slide1.png'
    },
    {
      name: 'Neelgund Prime Enclave',
      location: 'Vidyanagar, Hubli',
      area: '18 Acres',
      plots: 210,
      year: 2020,
      dimensions: '30x50',
      amenities: [
        'Gated Community',
        'Water Supply',
        'Children Play Area'
      ],
      image: 'assets/images/home/explore/explore-product-slide2.png'
    }
  ];

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
  currentLimit = 50;
  currentPage = 1;
  totalRecord = 0;
  nodata_msg = false;
  expandedIndex: number = 0;
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

  currentImage = this.images[0];

  showImage(index: number) {
    this.currentImage = this.images[index];
  }

  testimonials = [{
    img: '/assets/images/home/test1.png',
    name: 'john doe',
    quote: 'Lorem Ipsum Dolor Sit Amdoet, Cosem Ctetur Adipiscing Elit De Usti Mod Temp Or Incit Gravida Nibh Veles Velit Auctor Aliq Uet. Aenean Sollicitudin, Lorem Auci Elit Conses Quat Ipsutist Em Niuis Sed Odio Sit Amet Nibh Vulputate Cursu S A Sitmet.',
    rating: 4,
  },
  {
    img: '/assets/images/home/test1.png',
    name: 'perry doe',
    quote: 'Lorem Ipsum Dolor Sit Amdoet, Cosem Ctetur Adipiscing Elit De Usti Mod Temp Or Incit Gravida Nibh Veles Velit Auctor Aliq Uet. Aenean Sollicitudin, Lorem Auci Elit Conses Quat Ipsutist Em Niuis Sed Odio Sit Amet Nibh Vulputate Cursu S A Sitmet.',
    rating: 2,
  },
  {
    img: '/assets/images/home/test1.png',
    name: 'terry doe',
    quote: 'Lorem Ipsum Dolor Sit Amdoet, Cosem Ctetur Adipiscing Elit De Usti Mod Temp Or Incit Gravida Nibh Veles Velit Auctor Aliq Uet. Aenean Sollicitudin, Lorem Auci Elit Conses Quat Ipsutist Em Niuis Sed Odio Sit Amet Nibh Vulputate Cursu S A Sitmet.',
    rating: 3,
  },
  {
    img: '/assets/images/home/test1.png',
    name: 'terry doe',
    quote: 'Lorem Ipsum Dolor Sit Amdoet, Cosem Ctetur Adipiscing Elit De Usti Mod Temp Or Incit Gravida Nibh Veles Velit Auctor Aliq Uet. Aenean Sollicitudin, Lorem Auci Elit Conses Quat Ipsutist Em Niuis Sed Odio Sit Amet Nibh Vulputate Cursu S A Sitmet.',
    rating: 1,
  },
  {
    img: '/assets/images/home/test1.png',
    name: 'terry doe',
    quote: 'Lorem Ipsum Dolor Sit Amdoet, Cosem Ctetur Adipiscing Elit De Usti Mod Temp Or Incit Gravida Nibh Veles Velit Auctor Aliq Uet. Aenean Sollicitudin, Lorem Auci Elit Conses Quat Ipsutist Em Niuis Sed Odio Sit Amet Nibh Vulputate Cursu S A Sitmet.',
    rating: 5,
  },
  {
    img: '/assets/images/home/test1.png',
    name: 'terry doe',
    quote: 'Lorem Ipsum Dolor Sit Amdoet, Cosem Ctetur Adipiscing Elit De Usti Mod Temp Or Incit Gravida Nibh Veles Velit Auctor Aliq Uet. Aenean Sollicitudin, Lorem Auci Elit Conses Quat Ipsutist Em Niuis Sed Odio Sit Amet Nibh Vulputate Cursu S A Sitmet.',
    rating: 0,
  },
  ];


  portfolio = [
    {
      'id': '01',
      'img_url': 'assets/images/home/our-portfolio.png',
      'name': 'PENTHOUSE, Dubai',
      'type': 'residential',
      'description': 'This is penthouse',
      'year': 2014
    },
    {
      'id': '02',
      'img_url': 'assets/images/home/our-portfolio.png',
      'name': 'PENTHOUSE, Dubai',
      'type': 'residential',
      'description': 'This is penthouse',
      'year': 2014
    },
    {
      'id': '03',
      'img_url': 'assets/images/home/our-portfolio.png',
      'name': 'PENTHOUSE, Dubai',
      'type': 'residential',
      'description': 'This is penthouse',
      'year': 2014
    }
  ];
  whyChooseUs = {
    title: 'Why Choose Us',
    subtitle: 'Building trust through quality, transparency, and commitment',
    points: [
      {
        title: 'On-Time Delivery',
        desc: 'Every project is planned and executed with strict adherence to timelines.'
      },
      {
        title: 'RERA Approved Projects',
        desc: 'All developments comply with legal and regulatory standards.'
      },
      {
        title: 'Premium Construction Quality',
        desc: 'We use superior materials and modern construction practices.'
      },
      {
        title: 'Transparent & Ethical Process',
        desc: 'Clear pricing, honest communication, and complete documentation.'
      }
    ]
  };

  currentValues: number[] = [];
  categories = [];

  isHovered = false;
  onMouseEnter(i: any) {
    this.isHovered = true;
  }
  onMouseLeave(i: any) {
    this.isHovered = false;
  }
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    public dataService: DataService,
    public categoryService: CategoryService, private el: ElementRef, private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.getBannerdata();
    this.getAboutdata();
    this.getAllservices();
    this.getAllcounterData();
    this.getAllprojects();
    this.gettestimonials();
    this.isBrowser = isPlatformBrowser(this._platformId);
    this.imagePath = environment.baseUrl + '/public/';
    this.baseUrl = environment.url;
  }
  ngOnInit(): void {
    this.currentValues = new Array(this.stats.length).fill(0);
    this.startCounting(); // Or call only when element is in view using IntersectionObserver
    if (isPlatformBrowser(this._platformId)) {
      window.scrollTo(0, 0);
    }
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
      this.initTestimonialsSwiper();
      this.getAllClients();
      this.initPortfolioSwiper();
      this.initRecentProjectsSwiper();
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



  // if want whole stars
  // getArray(count: number): number[] {
  //   return Array(Math.floor(count)).fill(0);
  // }
  counter(i: number) {
    return new Array(i);
  }

  initBannerSwiper() {
    setTimeout(() => {
      const swiperElement = document.querySelector('.banner-swiper');
      const slides = document.querySelectorAll('.banner-swiper .swiper-slide');

      if (swiperElement && slides.length > 1) {
        this.bannerSwiper = new Swiper(".banner-swiper", {
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
    }, 500);
  }

  initProjectHighlightsSwiper() {
    if (this.isBrowser) {
      new Swiper('.project-highlights-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.project-pagination',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 1,
          },
          992: {
            slidesPerView: 1,
          }
        }
      });
    }
  }

  initTestimonialsSwiper() {
    new Swiper('.review-swiper', {
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



  public initPortfolioSwiper() {
    if (this.isBrowser) {
      new Swiper('.portfolio-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        // effect: "creative",
        grabCursor: true,
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
        creativeEffect: {
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
          },
          next: {
            translate: ["100%", 0, 0],
          },
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

  public initRecentProjectsSwiper() {
    if (this.isBrowser) {
      new Swiper('.recent-projects-swiper', {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 30,
        grabCursor: true,
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
        pagination: {
          el: ".recent-projects-pagination",
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
        } else {
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
    this.categoryService.getAllCategory(obj).subscribe((response: any) => {
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
        } else {
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
}
