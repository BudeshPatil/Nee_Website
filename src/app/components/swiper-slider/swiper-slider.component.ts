import { Component, Inject, PLATFORM_ID, Input } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
// declare var Swiper: any;
// import Swiper from 'swiper';
// import { Navigation } from 'swiper/modules';
// Swiper.use([Navigation]);
import { Swiper } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
Swiper.use([Navigation,Autoplay,Pagination]);

@Component({
  selector: 'app-swiper-slider',
  templateUrl: './swiper-slider.component.html',
  styleUrl: './swiper-slider.component.scss'
})
export class SwiperSliderComponent {
  // items:any[] = new Array(2);
  private mySwiper: Swiper | null = null;
  baseUrl: any;
  mediaUrl: any;
  @Input() product: any; // Accepts product data from parent
  // @Input() sliderslide: any[] = [];  // Accepts slides from parent
  slides = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5', 'Slide 6', 'Slide 7', 'Slide 8', 'Slide 9', 'Slide 10'];
  slides1 = {
    name: 'Slide 1',
    description: 'This is slide 1',
    price: 100,
    image: 'https://www.miniaar.com:5011/public/banner/banner-20250326100548-banner-luxury-pret.webp',
  }

  slide2 = [
    {
      name: 'Slide 1',
      description: 'This is slide 1',
      price: 100,
      image: 'https://www.miniaar.com:5011/public/banner/banner-20250326100548-banner-luxury-pret.webp',
    },
    {
      name: 'Slide 2',
      description: 'This is slide 2',
      price: 200,
      image: 'https://www.miniaar.com:5011/public/banner/banner-20250326100441-banner-bridal.webp',
    },
    {
      name: 'Slide 3',
      description: 'This is slide 3',
      price: 300,
      image: 'https://www.miniaar.com:5011/public/banner/banner-20250326100329-banner-couture.webp',
    },
    {
      name: 'Slide 4',
      description: 'This is slide 1',
      price: 100,
      image: 'https://www.miniaar.com:5011/public/banner/banner-20250326100548-banner-luxury-pret.webp',
    },
    {
      name: 'Slide 5',
      description: 'This is slide 2',
      price: 200,
      image: 'https://www.miniaar.com:5011/public/banner/banner-20250326100441-banner-bridal.webp',
    },
    {
      name: 'Slide 6',
      description: 'This is slide 3',
      price: 300,
      image: 'https://www.miniaar.com:5011/public/banner/banner-20250326100329-banner-couture.webp',
    }
    ,
    {
      name: 'Slide 7',
      description: 'This is slide 3',
      price: 300,
      image: 'https://www.miniaar.com:5011/public/banner/banner-20250326100329-banner-couture.webp',
    }
  ];

  portfolio =[
  {
    'id':'01',
    'img_url': 'assets/images/home/our-portfolio.png',
    'name': 'PENTHOUSE, Dubai',
    'type':'residential',
    'description': 'This is penthouse',
    'year': 2014
  },
  {
    'id':'02',
    'img_url': 'assets/images/home/our-portfolio.png',
    'name': 'PENTHOUSE, Dubai',
    'type':'residential',
    'description': 'This is penthouse',
    'year': 2014
  },
  {
    'id':'03',
    'img_url': 'assets/images/home/our-portfolio.png',
    'name': 'PENTHOUSE, Dubai',
    'type':'residential',
    'description': 'This is penthouse',
    'year': 2014
  }
  ];

  ngOnInit() {
    // Optional fallback if input is empty
    // if (!this.sliderslide || this.sliderslide.length === 0) {
    //   this.sliderslide = this.slide2; // use default
    // }
    this.initmySwiper();
  }


  isBrowser: boolean;
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
  ) {
    this.isBrowser = isPlatformBrowser(this._platformId);
    this.baseUrl = environment.url;
    this.mediaUrl = environment.baseUrl + '/public/';
  }
  ngAfterViewInit(): void {

  }
  public initmySwiper() {
    if (this.isBrowser) {
      new Swiper('.mySwiper', {
        // slidesPerView: 3,
        pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
        centeredSlides: true,
        spaceBetween: 30,
        loop: true,
        // autoplay: {
        //   delay: 2500,
        //   disableOnInteraction: false,
        // },
        breakpoints: {
          // When window width is >= 640px
          640: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // When window width is >= 768px
          768: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          // When window width is >= 1024px
          1024: {
            slidesPerView: 1,
            spaceBetween: 10,
          }
        },

        navigation: {
          nextEl: ".mySwiper-next",
          prevEl: ".mySwiper-prev"
        }

      });
    }
  }
  ngOnDestroy() {
    if (this.mySwiper) {
      this.mySwiper?.destroy(true, true);
      this.mySwiper = null;
    }
  }
}
