import { Component, Inject, OnInit, HostListener, ViewChild, ElementRef, Renderer2 } from '@angular/core';
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
import { MetaTagService } from './providers/meta-tag/meta-tag.service';
import { SchemaService } from './providers/schema/schema.service';
import { DataService } from './providers/data/data.service';

gsap.registerPlugin(ScrollTrigger);
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	title = 'neelgund';
	showFooter = true;
	@ViewChild('footer') footer!: ElementRef;
	private isBrowser: boolean;
	imageURL: string = `${environment.url}/assets`;
	baseURL: string = `${environment.baseUrl}`;
	promopopupData: any;
	loaderVisible: boolean = true;
	showIntro: boolean = false;
	introVisible: boolean = true;
	videoStarted: boolean = false;
	thumbnailVisible: boolean = true;
	websiteVisible: boolean = false;
	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(DOCUMENT) private document: Document,
		private smoothScroll: SmoothScrollService,
		private router: Router,
		private renderer: Renderer2,
		private metaTagService: MetaTagService,
		private schemaService: SchemaService,
		private dataservice: DataService
	) {
		this.router.events
			.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((event: any) => {
				// Hide footer only on portfolio route
				this.showFooter = event.urlAfterRedirects !== '/portfolios';
			});
			this.isBrowser = isPlatformBrowser(this.platformId);

	}

	ngOnInit(): void {
		// Scroll to top on navigation
		if (this.isBrowser) {
			console.log('Handling Google redirect in AppComponent');
		}
		// Handle navigation and meta tags for all routes
		this.router.events
			.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
			.subscribe(async (event) => {
				// Get the base URL and current route
				const baseUrl = environment.url.replace(/\/$/, '');
				const currentUrl = event.urlAfterRedirects;
				const canonicalUrl = `${baseUrl}${currentUrl}`;

				// Clear previous schemas
				this.schemaService.removeAllSchemas();

				// Check if this is a dynamic product page
				if (this.isProductDetailPage(currentUrl)) {
					const productSlug = this.extractProductSlug(currentUrl);
					if (!environment.production) {
						console.log('🛍️ Product page detected, slug:', productSlug);
					}
					this.metaTagService.setProductMetaTags(productSlug, canonicalUrl);

					// Set Product Schema (fetches from API) - WAIT FOR COMPLETION
					await this.schemaService.setProductSchemaFromApi(productSlug, canonicalUrl);

					// Set Breadcrumb Schema for product page
					this.schemaService.setBreadcrumbSchema([
						{ name: 'Home', url: baseUrl },
						{ name: 'Products', url: `${baseUrl}/product/search` },
						{ name: productSlug.replace(/-/g, ' '), url: canonicalUrl }
					]);
				} else {
					// Get the page name from the route
					const pageName = this.getPageNameFromRoute(currentUrl);

					// Set meta tags from API
					if (pageName) {
						if (!environment.production) {
							console.log('📄 Regular page detected, pageName:', pageName);
						}
						this.metaTagService.setMetaTagsFromApi(pageName, canonicalUrl);

						// Set appropriate schemas based on page type
						this.setSchemaForPage(pageName, canonicalUrl);
					}
				}

				// Always set Organization Schema (global)
				// this.schemaService.setOrganizationSchema();
				// Scroll to top on navigation
				if (this.isBrowser) {
					window.scrollTo(0, 0);
				}
				// IMPORTANT: Inject all collected schemas into the document head
				this.injectSchemasIntoHead();


			});

		// AOS and intro animation only in browser
		if (this.isBrowser) {
			AOS.init({ once: true, duration: 1000, easing: 'ease-in-out' });

			const hasPlayed = sessionStorage.getItem('introPlayed');

			Promise.race([
				this.waitForMedia(),
				new Promise<void>(res => setTimeout(res, 1500))
			]).then(() => {
				setTimeout(() => {
					this.loaderVisible = false;
					if (!hasPlayed && this.router.url === '/') {
						this.showIntro = true;
					} else {
						this.websiteVisible = true;
					}
				}, 500);
			});
		}
	}

	async ngAfterViewInit() {
		if (!this.isBrowser) return;

		// 🔥 Wait for Angular + DOM + IndexedDB
		setTimeout(() => {
			// this.loginService.initApple();
		}, 0);
	}
	/**
	 * Inject collected schemas into the document head
	 * This ensures schemas appear in page source for SSR and client-side rendering
	 */
	private injectSchemasIntoHead(): void {
		const schemas = this.schemaService.getCollectedSchemas();

		if (!schemas || schemas.length === 0) {
			return;
		}

		schemas.forEach(schema => {
			// Remove existing schema of same type to avoid duplicates
			const existing = this.document.querySelectorAll(
				`script[data-schema-type="${schema['@type']}"]:not([data-injected="true"])`
			);
			existing.forEach(el => el.remove());

			// Create new schema script tag
			const scriptTag = this.renderer.createElement('script');
			scriptTag.type = 'application/ld+json';
			scriptTag.setAttribute('data-schema-type', schema['@type']);
			scriptTag.setAttribute('data-injected', 'true');
			this.renderer.setProperty(scriptTag, 'textContent', JSON.stringify(schema));
			this.renderer.appendChild(this.document.head, scriptTag);

			if (!environment.production) {
				console.log(`✅ ${schema['@type']} schema injected into head`);
			}
		});

		// Clear collected schemas after injection to prevent duplication on next navigation
		this.schemaService.clearCollectedSchemas();
	}

	/**
	 * Set schema based on page type
	 */
	private setSchemaForPage(pageName: string, canonicalUrl: string): void {
		const baseUrl = environment.url.replace(/\/$/, '');

		// Home page
		if (pageName === 'home') {
			// FAQ Schema for home page
			// this.schemaService.setFaqSchema([
			// 	{
			// 		question: 'How do I book a car at Neelgund?',
			// 		answer: 'Visit our website, select your desired vehicle, choose dates, and complete the booking process with your details.'
			// 	},
			// 	{
			// 		question: 'What documents do I need for car rental?',
			// 		answer: 'You will need a valid driving license, passport/ID, and a credit card for the security deposit.'
			// 	},
			// 	{
			// 		question: 'Do you offer insurance?',
			// 		answer: 'Yes, comprehensive insurance is available for all our rental vehicles at competitive rates.'
			// 	},
			// 	{
			// 		question: 'Can I rent a yacht?',
			// 		answer: 'Yes, Neelgund offers luxury yacht rental services in India. Please contact us for details.'
			// 	}
			// ]);

			// Breadcrumb for home
			this.schemaService.setBreadcrumbSchema([
				{ name: 'Home', url: baseUrl }
			]);
		}

		// Services page
		if (pageName === 'services') {
			this.schemaService.setLocalBusinessSchema({
				name: 'Neelgund',
				description: 'Premium luxury car rental, chauffeur services, and yacht rentals in India',
				phone: '+97180044678',
				email: 'info@neelgund.com',
				city: 'India',
				region: 'India',
				country: 'AE'
			});

			this.schemaService.setBreadcrumbSchema([
				{ name: 'Home', url: baseUrl },
				{ name: 'Services', url: canonicalUrl }
			]);
		}

		// Contact page
		if (pageName === 'contact') {
			this.schemaService.setContactPageSchema({
				phone: '+97180044678',
				email: 'info@neelgund.com',
				streetAddress: 'MK Ghanim, Warehouse - No. 40 - 3rd, Al Quoz Industrial Area 3'
			});

			this.schemaService.setBreadcrumbSchema([
				{ name: 'Home', url: baseUrl },
				{ name: 'Contact', url: canonicalUrl }
			]);
		}

		// About page
		if (pageName === 'about') {
			this.schemaService.setLocalBusinessSchema({
				name: 'Neelgund',
				description: 'Leading luxury car and yacht rental provider in India since 2015',
				phone: '+97180044678',
				email: 'info@neelgund.com',
				city: 'India',
				region: 'India',
				country: 'AE'
			});

			this.schemaService.setBreadcrumbSchema([
				{ name: 'Home', url: baseUrl },
				{ name: 'About', url: canonicalUrl }
			]);
		}

		// Product listing/category page
		if (pageName.startsWith('product/list/')) {
			const categoryName = pageName.replace('product/list/', '').replace(/-/g, ' ');
			this.schemaService.setCategorySchema(
				{
					name: categoryName,
					description: `Browse our collection of ${categoryName} available for rent in India`
				},
				canonicalUrl
			);

			this.schemaService.setBreadcrumbSchema([
				{ name: 'Home', url: baseUrl },
				{ name: 'Products', url: `${baseUrl}/product/search` },
				{ name: categoryName, url: canonicalUrl }
			]);
		}

		// Product search page
		if (pageName === 'product/search') {
			this.schemaService.setBreadcrumbSchema([
				{ name: 'Home', url: baseUrl },
				{ name: 'Search', url: canonicalUrl }
			]);
		}

		// Privacy Policy page
		if (pageName === 'privacy-policy') {
			this.schemaService.setBreadcrumbSchema([
				{ name: 'Home', url: baseUrl },
				{ name: 'Privacy Policy', url: canonicalUrl }
			]);
		}

		// Terms and Conditions page
		if (pageName === 'terms-and-conditions') {
			this.schemaService.setBreadcrumbSchema([
				{ name: 'Home', url: baseUrl },
				{ name: 'Terms & Conditions', url: canonicalUrl }
			]);
		}
	}

	/**
	 * Check if current route is a product detail page
	 * Product detail routes are like: /product/rent-ferrari-296-gtb-India
	 */
	private isProductDetailPage(url: string): boolean {
		const baseRoute = url.split('?')[0].split('#')[0];
		const routeSegments = baseRoute.split('/').filter(segment => segment.length > 0);
		// Product detail routes are like: /product/rent-ferrari-296-gtb-India
		const isProduct = routeSegments.length >= 2 && routeSegments[0] === 'product';
		if (!environment.production) {
			console.log('🔍 Route Check - URL:', url);
			console.log('🔍 Route Segments:', routeSegments);
			console.log('🔍 Is Product Detail:', isProduct);
		}
		const isSearch = routeSegments[1] === 'search';
		const isList = routeSegments[1] === 'list';
		return isProduct && !isSearch && !isList;

	}

	/**
	 * Extract product slug from URL
	 * From /product/rent-ferrari-296-gtb-India, extracts: rent-ferrari-296-gtb-India
	 */
	private extractProductSlug(url: string): string {
		const baseRoute = url.split('?')[0].split('#')[0];
		const routeSegments = baseRoute.split('/').filter(segment => segment.length > 0);

		// Return the second segment (product slug)
		return routeSegments[1] || '';
	}

	/**
	 * Convert route to API page name dynamically
	 * Removes leading slash and converts camelCase/PascalCase to kebab-case
	 * Falls back to special mappings if needed
	 */
	private getPageNameFromRoute(url: string): string | null {
		// Check for special mappings first
		if (this.routeToPageNameMap[url]) {
			return this.routeToPageNameMap[url];
		}

		// Extract base route (remove query params and fragments)
		const baseRoute = url.split('?')[0].split('#')[0];

		// Get the first segment of the route (e.g., "/about" -> "about", "/product/123" -> "product")
		const routeSegments = baseRoute.split('/').filter(segment => segment.length > 0);
		if (routeSegments.length === 0) {
			return null;
		}

		const firstSegment = routeSegments[0];

		// Convert PascalCase to kebab-case (e.g., "ViewYachts" -> "view-yachts")
		const pageName = firstSegment
			.replace(/([a-z])([A-Z])/g, '$1-$2') // Insert hyphen between lowercase and uppercase
			.toLowerCase();

		return pageName;
	}

	// playVideo() {
	// 	const isDesktop = window.innerWidth >= 768;
	// 	const videoToPlay = isDesktop ? this.introDesktopVideo?.nativeElement : this.introMobileVideo?.nativeElement;
	// 	if (!videoToPlay) return;

	// 	videoToPlay.currentTime = 0;
	// 	videoToPlay.play()
	// 		.then(() => {
	// 			this.thumbnailVisible = false;
	// 			if (!sessionStorage.getItem('introPlayed')) {
	// 				sessionStorage.setItem('introPlayed', 'true');
	// 			}
	// 		})
	// 		.catch(error => console.error('Error playing video:', error));

	// 	setTimeout(() => {
	// 		this.websiteVisible = true;
	// 	}, 1000);
	// }

	// onVideoEnd() {
	// 	this.introVisible = false;
	// 	setTimeout(() => {
	// 		this.showIntro = false;
	// 	}, 1000);
	// }

	private waitForMedia(): Promise<void> {
		return new Promise(resolve => {
			const elements: (HTMLImageElement | HTMLVideoElement)[] = [];
			const mobileThumb = new Image();
			mobileThumb.src = `${this.imageURL}/loader-video/rent-car-yacht-services-in-India.webp`;
			elements.push(mobileThumb);

			const desktopThumb = new Image();
			desktopThumb.src = `${this.imageURL}/loader-video/luxury-car-and-yacht-services.webp`;
			elements.push(desktopThumb);

			let loadedCount = 0;
			const checkDone = () => {
				loadedCount++;
				if (loadedCount === elements.length) resolve();
			};

			elements.forEach(el => {
				if (el instanceof HTMLImageElement) {
					el.complete ? checkDone() : el.onload = () => { el.onload = null; checkDone(); };
				} else if (el instanceof HTMLVideoElement) {
					el.readyState >= 3 ? checkDone() : el.onloadeddata = () => { el.onloadeddata = null; checkDone(); };
				}
			});
		});
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

	// Special route mappings (only use when route name differs from API page name)
	private routeToPageNameMap: { [key: string]: string } = {
		'/': 'home',
		'/product/search': 'product/search',
		'/product/list/rent-hatchback-car': 'product/list/rent-hatchback-car',
		'/product/list/rent-convertible-car-India': 'product/list/rent-convertible-car-India',
		'/product/list/sedan-car-for-rent-India': 'product/list/sedan-car-for-rent-India',
		'/product/list/rent-coupe-cars-India': 'product/list/rent-coupe-cars-India',
		'/product/list/suv-rentals-India': 'product/list/suv-rentals-India',
		'/product/list/van-rental-India': 'product/list/van-rental-India'
	};
}
