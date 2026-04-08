import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DataService } from '../../providers/data/data.service';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../providers/category/category.service';
import { Swiper } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ActivatedRoute, Router } from '@angular/router';
// gsap.registerPlugin(ScrollTrigger);
@Component({
	selector: 'app-services',
	templateUrl: './services.component.html',
	styleUrl: './services.component.scss'
})
export class ServicesComponent {
	baseUrl: any;
	imagePath: any;
	isBrowser: boolean;
	servicesData: any = [];
	servicesBannerData: any = [];
	bannerData: any = [];
	projects: any = [];
	private mySwiper: Swiper | null = null;

	// Static services data
	services = [
		{
			name: 'Land and Plots',
			url_key: 'land-and-plots',
			short_description: 'Expert services for land acquisition, plot development, and real estate planning.',
			full_description: 'Our land and plots services encompass comprehensive solutions for identifying, acquiring, and developing prime land parcels. We handle everything from site surveys and feasibility studies to legal documentation and zoning compliance, ensuring your construction projects start on solid ground. With years of experience in the real estate market, we provide strategic advice to maximize the value and potential of your land investments.',
			image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
			link: 'land-and-plots'
		},
		{
			name: 'Constructions',
			url_key: 'constructions',
			short_description: 'Full-scale construction services from planning to completion with quality assurance.',
			full_description: 'From residential complexes to commercial buildings, our construction services deliver end-to-end project management. We specialize in modern construction techniques, sustainable building practices, and timely delivery. Our team of certified engineers, architects, and skilled laborers work together to transform your vision into reality, maintaining the highest standards of safety, quality, and efficiency throughout the entire construction process.',
			image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
			link: 'constructions'
		}
	];
	constructor(
		@Inject(PLATFORM_ID) private _platformId: Object,private router: Router,
		public dataService: DataService, public categoryService: CategoryService, private route: ActivatedRoute,
	) {
		this.getBannerdata();
		this.getAllServicesData();
		this.getAllservices();
		this.getAllprojects();
		// this.initScrollTrigger();
		this.isBrowser = isPlatformBrowser(this._platformId);
		this.imagePath = environment.baseUrl + '/public/';
		this.baseUrl = environment.url;
		this.isBrowser = isPlatformBrowser(this._platformId);
	}
	ngOnInit(): void {
		//Called after the constructor, initializing input properties, and the first call to ngOnChanges.
		//Add 'implements OnInit' to the class.
		if (isPlatformBrowser(this._platformId)) {
			this.initmySwiper();
			// window.scrollTo(0, 0);
		}
	}
	getAllServicesData() {
		this.dataService.getAllService({}).subscribe((response: any) => {
			if (response.code == 200) {
				if (response.result != null && response.result.length > 0) {
					this.servicesBannerData = response.result;
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
	getAllprojects() {
		let obj = {};
		this.dataService.getAllServiceProjects(obj).subscribe((response: any) => {
			if (response.code == 200) {
				if (response.result != null && response.result != '') {
					this.projects = response.result;
					setTimeout(() => {
						this.scrollToFragment();
					}, 300);
				} else {
				}
			}
		});
	}

	getBannerdata() {
    let obj = {};
    this.dataService.getAllBanner(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          let tempcat = response.result.filter((cat: any) => cat.name == 'service');
          if (tempcat && tempcat.length > 0) {
            this.bannerData = tempcat;
          }
        } else {
        }
      }
    });
  }
	private scrollToFragment(): void {
		if (!this.isBrowser) return;

		const fragment = this.route.snapshot.fragment;
		if (!fragment) return;

		const element = document.getElementById(fragment);
		if (!element) return;

		const headerOffset = 60; // adjust for sticky header
		const elementPosition = element.getBoundingClientRect().top + window.scrollY;
		const offsetPosition = elementPosition - headerOffset;

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth'
		});
	}

	public initmySwiper() {
		if (this.isBrowser) {
			Swiper.use([Autoplay, Pagination, Navigation]);

			document.querySelectorAll('.mySwiper').forEach((el) => {
				new Swiper(el as HTMLElement, {
					slidesPerView: 1,
					loop: true,
					spaceBetween: 30,
					centeredSlides: true,
					grabCursor: true,
					autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
					pagination: {
						el: '.swiper-pagination',
						clickable: true,
					},
					navigation: {
						nextEl: ".mySwiper-next",
						prevEl: ".mySwiper-prev"
					}
				});
			});
		}
	}

	ngAfterViewInit(): void {
		if (!isPlatformBrowser(this._platformId)) return;
		setTimeout(() => {
			this.initmySwiper();
			// this.initScrollTrigger();
		}, 500);
	}
	ngOnDestroy() {
		if (this.mySwiper) {
			this.mySwiper?.destroy(true, true);
			this.mySwiper = null;
		}
	}

	goToService(url_key: string): void {
		this.router.navigate(['/', url_key]);
	}
}
