// meta-tag.service.ts
import { Injectable, Inject, Optional } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PageService } from '../page/page.service';
import { SeoService } from '../seo/seo.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { REQUEST } from '@nguniversal/express-engine/tokens';

@Injectable({ providedIn: 'root' })
export class MetaTagService {
	constructor(
		private metaTagService: Meta,
		private titleService: Title,
		private pageService: PageService,
		private seoService: SeoService,
		private http: HttpClient,
		@Optional() @Inject(REQUEST) private request?: any
	) { }

	/**
	 * Get the current URL (works on server and client)
	 */
	private getBaseUrl(): string {
		if (this.request) {
			// Running on server
			return `${this.request.protocol}://${this.request.get('host')}`;
		}
		// Running in browser
		return window.location.origin;
	}

	setMetaTagsFromApi(pageName: string, canonicalUrl: string): void {
		const obj = { pageName };

		this.pageService.getpageWithName(obj).subscribe(
			(response) => {
				if (response.body?.code === 200 && response.body.result) {
					const result = response.body.result;
					this.applyMetaTags(result.meta_title, result.meta_description, result.meta_keywords, canonicalUrl);
				}
			},
			(error) => {
				console.error('Error fetching page meta tags:', error);
			}
		);
	}

	/**
	 * Set meta tags for dynamic product detail pages
	 * Fetches product data by URL key (slug) using POST request
	 */
	setProductMetaTags(productSlug: string, canonicalUrl: string): void {
		const apiUrl = `${environment.baseUrl}/api/vehicle/getVehicleWithURLKey`;
		const requestBody = { url_key: productSlug };
		if (!environment.production) {
			console.log('🔍 Fetching:', apiUrl); // ALWAYS LOG
		}
		this.http.post<any>(apiUrl, requestBody).subscribe(
			(response) => {
				if (!environment.production) {
					// console.log('✅ Response:', response); // ALWAYS LOG
				}
				if (response.code === 200 && response.result && response.result.length > 0) {
					const product = response.result[0];
					if (!environment.production) {
						console.log('📦 Product:', product.name); // ALWAYS LOG
					}
					const title = product.meta_title || `${product.name} - Luxury Rental | Ghost Rentals`;
					const description = product.meta_description || product.short_description || `Book ${product.name} rental in Dubai with Ghost Rentals.`;
					const keywords = product.meta_keywords || `${product.name}, luxury rental, dubai`;
					const image = product.image || 'https://www.ghostrentals.com/assets/images/ghostrental-og-image.jpg';
					if (!environment.production) {
						console.log('✨ Applying meta tags...'); // ALWAYS LOG
					}
					this.applyMetaTags(title, description, keywords, canonicalUrl, image);
				}
			},
			(error) => {
				console.error('❌ API Error:', error); // ALWAYS LOG
			}
		);
	}

	/**
	 * Apply meta tags to the page
	 */
	private applyMetaTags(title: string, description: string, keywords?: string, canonicalUrl?: string, image?: string): void {
		if (title) {
			this.titleService.setTitle(title);
			this.metaTagService.updateTag({ property: 'og:title', content: title });
			if (!environment.production) {
				console.log('✓ Title set:', title); // ALWAYS LOG
			}
		}
		if (description) {
			this.metaTagService.updateTag({ name: 'description', content: description });
			this.metaTagService.updateTag({ property: 'og:description', content: description });
			if (!environment.production) {
				console.log('✓ Description set:', description); // ALWAYS LOG
			}
		}
		if (keywords) {
			this.metaTagService.updateTag({ name: 'keywords', content: keywords });
			if (!environment.production) {
				console.log('✓ Keywords set:', keywords); // ALWAYS LOG
			}
		}
		if (image) {
			this.metaTagService.updateTag({ property: 'og:image', content: image });
			if (!environment.production) {
				console.log('✓ Image set:', image); // ALWAYS LOG
			}
		}
		if (canonicalUrl) {
			this.seoService.setCanonicalURL(canonicalUrl);
			if (!environment.production) {
				console.log('✓ Canonical set:', canonicalUrl); // ALWAYS LOG
			}
		}
	}

	/**
	 * Set meta tags directly (for fallback/default values)
	 */
	setMetaTags(
		title: string,
		description: string,
		keywords?: string,
		canonicalUrl?: string,
		image?: string
	): void {
		this.applyMetaTags(title, description, keywords, canonicalUrl, image);
	}
}
