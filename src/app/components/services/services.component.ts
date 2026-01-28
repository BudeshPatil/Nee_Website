import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DataService } from '../../providers/data/data.service';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../providers/category/category.service';
import { Swiper } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ActivatedRoute } from '@angular/router';

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
	projects: any = [];
	private mySwiper: Swiper | null = null;
	design = [
		{
			'id': '01',
			'imgUrl': '',
			'title': 'RESIDENTIAL DESIGN PROJECTS',
			'projects': [
				{
					'id': '01',
					'imgUrl': '',
					'title': 'Project Name',
				},
				{
					'id': '02',
					'imgUrl': '',
					'title': 'Project Name',
				},
				{
					'id': '03',
					'imgUrl': '',
					'title': 'Project Name',
				}
			]
		},
	];
	togethers = [
		{
			'id': '01',
			'name': 'Project Name',
			'description': 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nunc Mattis Ligula Pellentesque Nisi Tristique Porta.',
			'img_url': 'assets/images/home/journal1.png',
			'url_key': 'services'
		},
		{
			'id': '02',
			'name': 'Project Name',
			'description': 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nunc Mattis Ligula Pellentesque Nisi Tristique Porta.',
			'img_url': 'assets/images/home/journal2.png',
			'url_key': 'services'
		},
		{
			'id': '03',
			'name': 'Project Name',
			'description': 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Nunc Mattis Ligula Pellentesque Nisi Tristique Porta.',
			'img_url': 'assets/images/home/journal3.png',
			'url_key': 'services'
		}
	];
	constructor(
		@Inject(PLATFORM_ID) private _platformId: Object,
		public dataService: DataService, public categoryService: CategoryService, private route: ActivatedRoute,
	) {
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
					this.servicesBannerData = response.result[0];
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
	// initScrollTrigger(): void {
	// 	const scrollElems = gsap.utils.toArray('.scroll-animate') as HTMLElement[];
	// 	scrollElems.forEach((el) => {
	// 		gsap.from(el, {
	// 			clipPath: 'inset(0 0 100% 0)',
	// 			ease: 'power3.inOut',
	// 			duration: 1.5,
	// 			scrollTrigger: {
	// 				trigger: el,
	// 				start: 'top 80%',
	// 				end: 'top 20%',
	// 			}
	// 		});
	// 	});

	// }
}
