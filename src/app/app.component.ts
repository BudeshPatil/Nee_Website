import { Component, Inject, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { SmoothScrollService } from './services/smooth-scroll.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import * as AOS from 'aos';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SeoService } from './providers/seo/seo.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { environment } from '../environments/environment';

gsap.registerPlugin(ScrollTrigger);
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	title = 'ph-design-me';
	showFooter = true;
	@ViewChild('footer') footer!: ElementRef;
	constructor(
		@Inject(DOCUMENT) private dom: Document,
		@Inject(PLATFORM_ID) private platformId: Object,
		private smoothScroll: SmoothScrollService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private seo: SeoService
	) {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((event: any) => {
				// Hide footer only on portfolio route
				this.showFooter = event.urlAfterRedirects !== '/portfolios';
			});

	}

	ngOnInit(): void {
		this.router.events.pipe(
			filter(event => event instanceof NavigationEnd),
			map(() => this.activatedRoute),
			map(route => {
				while (route.firstChild) route = route.firstChild;
				return route;
			}),
			mergeMap(route => route.data)
		).subscribe(data => {

			const path = this.dom.location?.pathname || '/';
			const isProject = data['isProject'];
			const pageName = data['pageName'];

			if (pageName) {
				this.seo.updatePageMeta(pageName, path);
			}

			if (isProject) {
				const urlKey = path.split('/').pop()!;
				this.seo.updateProjectMeta(urlKey, path);
			}

		});
		if (isPlatformBrowser(this.platformId)) {
			AOS.init({
				once: true,         // Whether animation should happen only once
				mirror: true,        // Whether elements should animate out while scrolling past
			});
			window.scrollTo(0, 0);
			this.router.events.subscribe((event) => {
				if (event instanceof NavigationEnd) {
					const fragment = this.router.parseUrl(this.router.url).fragment;
					if (fragment) {
						const el = document.getElementById(fragment);
						if (el) {
							gsap.to(window, {
								scrollTo: { y: el, offsetY: 80 }, // offset for fixed header
								duration: 1,
								ease: "power2.out"
							});
						}
					}
				}
			});
		}
	}
	ngAfterViewInit() {
		if (!isPlatformBrowser(this.platformId)) return;

		// // init once
		// setTimeout(() => {
		//   this.smoothScroll.init();
		// }, 50);

		// // optional: reinit on navigation end so new routed content height is measured
		// this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
		//   setTimeout(() => {
		//     this.smoothScroll.destroy();
		//     this.smoothScroll.init();
		//   }, 60);
		// });
	}

	ngOnDestroy() {
		if (isPlatformBrowser(this.platformId)) {
			this.smoothScroll.destroy();
		}
	}

	// @HostListener('window:scroll', [])
	// onWindowScroll() {
	//   if (!this.footer) return;
	//   const scrollY = window.scrollY;

	//   if (scrollY > 300) {
	//     console.log('fixed');
	//   } else {
	//     console.log('relative');
	//   }
	// }
	isFixed = false; // track if footer should be fixed

	@HostListener('window:scroll', [])
	onWindowScroll() {
		this.isFixed = window.scrollY > 500;
	}
}
