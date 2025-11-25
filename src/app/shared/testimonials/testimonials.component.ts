import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { Swiper } from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent implements AfterViewInit {
  @ViewChild('swiper') swiperRef!: ElementRef;
  @ViewChild('swiperButtonPrev') swiperButtonPrev!: ElementRef;
  @ViewChild('swiperButtonNext') swiperButtonNext!: ElementRef;
  private swiper: Swiper | null = null;
  imageURL: string = `${environment.url}/assets`;
  backendURL: string = `${environment.baseUrl}/public`;
  testimonialsData: any = [];
  expandedIndex: number = -1;
  // Testimonials data
  testimonials = [
    {
      image: 'testimonials/image1.jpg',
      rating: 5,
      h3: '"Exceptional Service From Start To Finish!"',
      content: 'Rented A Rolls-Royce For My Wedding, And Everything Was Flawless. The Car Was Immaculate, The Chauffeur Was Professional, And The Whole Process Was Seamless.',
      name: 'M24 (Dorai Harrison)'
    },
    {
      image: 'testimonials/image2.jpg',
      rating: 4,
      h3: '"Perfect Wedding Day!"',
      content: 'The limousine service was outstanding. The chauffeur was very professional and the car was in perfect condition. Highly recommend!',
      name: 'John Smith'
    },
    {
      image: 'testimonials/image3.jpg',
      rating: 5,
      h3: '"Best Corporate Event Experience"',
      content: 'We rented multiple Luxury cars for our corporate event. The service was exceptional and our guests were very impressed.',
      name: 'Sarah Johnson'
    },
    {
      image: 'testimonials/image4.jpg',
      rating: 4,
      h3: '"Perfect for Family Vacation"',
      content: 'The car was comfortable and the service was excellent. The team was very helpful throughout our vacation.',
      name: 'Lisa Chen'
    },
    {
      image: 'testimonials/image5.jpg',
      rating: 5,
      h3: '"Great Business Trip Experience"',
      content: 'Perfect service for our business trip. The cars were always on time and in excellent condition. Very professional team.',
      name: 'Robert Smith'
    }
  ];

  // FAQ data
  faqs = [
    {
      id: 'faq1',
      question: 'How can I pay at Ghost Rentals?',
      answer: 'We accept Visa, MasterCard, AmEx, Cash, online banking & Bitcoin - choose what works best for you at Ghost Rentals!'
    },
    {
      id: 'faq2',
      question: 'Which luxury supercars can I rent from Ghost Rentals?',
      answer: 'At Ghost Rentals, we offer an extensive fleet of premium & economy vehicles - all fully insured, impeccably maintained & inspected. Our 24/7 support team is always ready to help. Browse our complete catalog of luxury cars & yachts with no deposit required at the lowest market prices!'
    },
    {
      id: 'faq3',
      question: 'How can I modify or cancel my Ghost Rentals reservation?',
      answer: 'Yes, you can modify or cancel your reservation by contacting our customer service team. All changes must be made at least 48 hours in advance. Modifications or cancellations requested with less than 48 hours notice may incur additional fees.'
    },
    {
      id: 'faq4',
      question: 'What are Ghost Rentals late return fees and policies?',
      answer: 'We rent vehicles on a 24-hour basis with a 1-hour grace period for returns. After that, hourly charges apply. Beyond 3 hours late, full-day charges apply. No grace period for surcharges, fees, protections, or optional equipment - full-day late charges apply immediately for these items.'
    },
    {
      id: 'faq5',
      question: 'Does Ghost Rentals provide roadside assistance if I encounter issues with my rental car?',
      answer: 'If you encounter issues with your Ghost Rentals vehicle, call us immediately. For minor problems, our operations team will assist on-site. For major malfunctions, we\'ll provide replacement or roadside assistance. Never abandon your vehicle - stay with the car and wait for our service team or authorities. Our 24/7 support ensures you\'re never stranded during your rental.'
    },
    {
      id: 'faq6',
      question: 'How do I book a car and yacht rental with Ghost Rentals?',
      answer: 'Booking with Ghost Rentals is simple: visit ghostrentals.com, select your car, call us or email info@ghostrentals.com. No deposit required* with lowest prices!'
    },
    {
      id: 'faq7',
      question: 'Can I book multiple vehicles at once from Ghost Rentals?',
      answer: 'Yes, you can book multiple vehicles at once with Ghost Rentals. Simply select your desired cars and complete the booking. Our team is ready to assist with any questions.'
    }
  ];


  constructor(private ngZone: NgZone, public dataservice: DataService, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit() {
    this.getTestimonials();
  }


  getTestimonials() {
    let obj = {};
    this.dataservice.getTestimonials(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.testimonialsData = response.result;
        }
      }
    });
  }

  getStars(rating: number): number[] {
    return Array(rating).fill(0);
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      // Use setTimeout to ensure the view is fully rendered
      setTimeout(() => {
        this.initSwiper();
      });
    });
  }

  public initSwiper(): void {
    if (this.swiperRef?.nativeElement && !this.swiper) {
      try {
        if (isPlatformBrowser(this.platformId)) {
          this.swiper = new Swiper(this.swiperRef.nativeElement, {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            modules: [Navigation, Pagination, Autoplay],
            navigation: {
              nextEl: this.swiperButtonNext?.nativeElement,
              prevEl: this.swiperButtonPrev?.nativeElement,
            },
            pagination: {
              el: '.swiper-pagination',
              clickable: true,
              dynamicBullets: true,
            },
            // autoplay: {
            //   delay: 2000,
            //   disableOnInteraction: false,
            //   pauseOnMouseEnter: true,
            // },
            breakpoints: {
              768: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              992: {
                slidesPerView: 1,
                spaceBetween: 30,
              },
            },
            on: {
              init: () => {
              },
              slideChange: () => {
              },
            },
          });

          // if (this.nextButton?.nativeElement && this.prevButton?.nativeElement) {
          //   this.nextButton.nativeElement.addEventListener('click', () => {
          //     this.swiper?.slideNext();
          //   });

          //   this.prevButton.nativeElement.addEventListener('click', () => {
          //     this.swiper?.slidePrev();
          //   });
          // }
        }
      } catch (error) {
        console.error('Error initializing Swiper:', error);
      }
    }
  }

  // ngOnDestroy(): void {
  //   if (this.nextButton?.nativeElement) {
  //     this.nextButton.nativeElement.removeEventListener('click', () => { });
  //   }
  //   if (this.prevButton?.nativeElement) {
  //     this.prevButton.nativeElement.removeEventListener('click', () => { });
  //   }

  //   if (this.swiper) {
  //     try {
  //       this.swiper.destroy(true, true);
  //     } catch (error) {
  //       console.error('Error destroying Swiper:', error);
  //     } finally {
  //       this.swiper = null;
  //     }
  //   }
  // }

  toggleAccordion(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? -1 : index;
  }
}
