import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ProjectService } from '../../../providers/project/project.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { SeoService } from '../../../providers/seo/seo.service';
import * as AOS from 'aos';
@Component({
	selector: 'app-project-details',
	templateUrl: './project-details.component.html',
	styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent implements OnInit {
	baseUrl: any;
	url_key: any;
	projectData: any;
	imagePath: any;
	recentProjects: any[] = [];
	isBrowser: boolean;
	private mySwiper: Swiper | null = null;


	constructor(public projectService: ProjectService,
		@Inject(PLATFORM_ID) private _platformId: Object,
		private http: HttpClient,
		private router: Router,
		private route: ActivatedRoute,
		private seo: SeoService,
		private cdr: ChangeDetectorRef
	) {
		this.isBrowser = isPlatformBrowser(this._platformId);
		if (this.isBrowser) {
			gsap.registerPlugin(ScrollTrigger);
		}
		this.baseUrl = environment.url;
		this.url_key = this.route.snapshot.params['url_key'];
		this.imagePath = environment.baseUrl + '/public/';
		// this.url_key = this.route.snapshot.params['url_key'];
		// this.backendURL = environment.baseUrl +'/public/';
	}
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
onImageLoad() {
  AOS.refresh();
}

	ngOnInit(): void {
		if (this.isBrowser) {
			const urlKey = this.route.snapshot.paramMap.get('url_key')!;
			const path = `/project/${urlKey}`;
			this.seo.updateProjectMeta(urlKey, path);

			this.route.params.subscribe(() => {
				this.loadData();
				window.scrollTo(0, 0);
			});
		}
	}
	ngAfterViewInit(): void {
		if (!this.isBrowser) return;
		if (!isPlatformBrowser(this._platformId)) return;
		setTimeout(() => {
			this.initmySwiper();
			// this.initScrollTrigger();
		}, 500);
	}

	public initmySwiper() {
		if (this.isBrowser) {
			Swiper.use([Autoplay, Pagination, Navigation]);

			document.querySelectorAll('.mySwiper').forEach((el) => {
				new Swiper(el as HTMLElement, {
					slidesPerView: 1,
					loop: true,
					spaceBetween: 30,
					// centeredSlides: true,
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
	ngOnDestroy() {
		if (this.mySwiper) {
			this.mySwiper?.destroy(true, true);
			this.mySwiper = null;
		}
	}
	initAnimations(): void {
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
	loadData(): void {
		this.projectService.getProjectsByURL({ url_key: this.route.snapshot.params['url_key'] })
			.subscribe((response) => {
				if (response.code === 200 && response.result) {
					this.projectData = response.result;
					this.recentProjects = this.projectData.related_prjects;
					this.imagePath = this.imagePath;

					// Force Angular to render DOM first
					this.cdr.detectChanges();

					// Now safe to run animations
					// setTimeout(() => this.initAnimations(), 100);
				}
			});
	}
	get_projectData() {
		let obj = {
			url_key: this.url_key
		}
		this.projectService.getProjectsByURL(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					if (response.result != null && response.result != '') {
						this.projectData = response.result;
						this.recentProjects = this.projectData.related_prjects;

						// this.loadProject();
					}
					else {
					}
				}
			},
		);
	}
}
