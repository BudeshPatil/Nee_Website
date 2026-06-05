import { Injectable, Inject, Optional } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SchemaService {
	private collectedSchemas: any[] = [];

	constructor(
		private metaService: Meta,
		private http: HttpClient,
		@Optional() @Inject(REQUEST) private request?: any,
		@Optional() @Inject('PLATFORM_ID') private platformId?: Object
	) { }

	/**
	 * Check if running in browser
	 */
	private isBrowser(): boolean {
		return isPlatformBrowser(this.platformId);
	}

	/**
	 * Get the current URL (works on server and client)
	 */
	private getBaseUrl(): string {
		if (this.request) {
			// Running on server
			return `${this.request.protocol}://${this.request.get('host')}`;
		}
		// Running in browser
		if (this.isBrowser()) {
			return window.location.origin;
		}
		// Fallback
		return 'https://www.neelgund.com';
	}

	/**
	 * Set Organization Schema (global for all pages)
	 */
	setOrganizationSchema(): void {
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'Organization',
			'name': 'Neelgund',
			'url': `${this.getBaseUrl()}`,
			'logo': `${this.getBaseUrl()}/assets/logo_footer.png`,
			'description': 'Neelgund Group – Residential Plots, Construction & Club in Hubballi',
			'sameAs': [
				'https://www.facebook.com/neelgunddevelopers?mibextid=ZbWKwL',
				'https://x.com/NeelgunddevlLLP',
				'https://www.instagram.com/neelgunddevelopers?igsh=aTM5eGRiMWxpZ2N2',
				'https://www.linkedin.com/company/neelgund/',
			],
			'contactPoint': {
				'@type': 'ContactPoint',
				'contactType': 'Customer Service',
				'telephone': ' +918050238777',
				'email': 'info@neelgund.com'
			},
			'address': {
				'@type': 'PostalAddress',
				'streetAddress': 'No 14A, 3rd Floor, Stellar Mall, beside JG commerce college, Jayanagar, Vidya Nagar, Hubballi',
				'addressLocality': 'India',
				'addressRegion': 'India',
				'postalCode': '560036',
				'addressCountry': 'IN'
			}
		};
		this.injectSchema(schema);
	}

	/**
	 * Set BreadcrumbList Schema (for navigation hierarchy)
	 */
	setBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): void {
		const items = breadcrumbs.map((item, index) => ({
			'@type': 'ListItem',
			'position': index + 1,
			'name': item.name,
			'item': item.url
		}));

		const schema = {
			'@context': 'https://schema.org',
			'@type': 'BreadcrumbList',
			'itemListElement': items
		};

		if (!environment.production) {
			// console.log('📍 Breadcrumb Schema:', schema);
		}

		this.injectSchema(schema);
	}

	/**
	 * Set Product Schema (for product/car detail pages)
	 */
	setProductSchema(product: any, canonicalUrl: string): void {
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'Product',
			'name': product.name || 'oaks',
			'description': product.short_description || product.meta_description || '',
			'url': canonicalUrl,
			'image': product.image || `${this.getBaseUrl()}/assets/logo.png`,
			'brand': {
				'@type': 'Brand',
				'name': product.brand || 'Neelgund'
			},
			'offers': {
				'@type': 'AggregateOffer',
				'availability': 'https://schema.org/InStock',
				'priceCurrency': 'IND',
				'price': product.price || '0',
				'url': canonicalUrl
			},
			'aggregateRating': product.rating ? {
				'@type': 'AggregateRating',
				'ratingValue': product.rating.value,
				'reviewCount': product.rating.count
			} : undefined
		};

		// Remove undefined properties
		Object.keys(schema).forEach(key => schema[key] === undefined && delete schema[key]);

		if (!environment.production) {
			// console.log('🏎️ Product Schema:', schema);
		}

		this.injectSchema(schema);
	}

	/**
	 * Set Product via API (fetches from backend)
	 * OPTIMIZED: Now uses schema from backend response
	 * Returns a Promise to allow waiting for API completion
	 */
	setProductSchemaFromApi(productSlug: string, canonicalUrl: string): Promise<void> {
		return new Promise((resolve) => {
			const apiUrl = `${environment.baseUrl}/api/vehicle/getVehicleWithURLKey`;
			const requestBody = { url_key: productSlug };

			this.http.post<any>(apiUrl, requestBody).subscribe(
				(response) => {
					if (response.code === 200 && response.result && response.result.length > 0) {
						const product = response.result[0];

						// ✅ CHECK IF SCHEMA IS IN RESPONSE (NEW!)
						if (product.schema) {
							// Use backend-provided schema directly - NO extra processing needed!
							this.injectSchema(product.schema);

							if (!environment.production) {
								// console.log('✅ Schema from backend:', product.schema);
							}
						} else {
							// Fallback to building schema locally (old method)
							this.setProductSchema(product, canonicalUrl);

							if (!environment.production) {
								// console.log('⚠️ Backend schema not provided, building locally');
							}
						}
					}
					resolve();
				},
				(error) => {
					console.error('❌ Product Schema API Error:', error);
					resolve();
				}
			);
		});
	}

	/**
	 * Set LocalBusiness Schema (for service pages)
	 */
	setLocalBusinessSchema(data?: any): void {
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'LocalBusiness',
			'name': data?.name || 'Neelgund',
			'description': data?.description || 'Neelgund Group – Residential Plots, Construction & Club in Hubballi',
			'url': `${this.getBaseUrl()}`,
			'image': `${this.getBaseUrl()}/assets/logo_footer.png`,
			'telephone': data?.phone || '+91 80502 38777',
			'email': data?.email || 'info@neelgund.com',
			'address': {
				'@type': 'PostalAddress',
				'streetAddress': data?.streetAddress || 'No 14A, 3rd Floor, Stellar Mall, beside JG commerce college, Jayanagar, Vidya Nagar, Hubballi',
				'addressLocality': data?.city || 'India',
				'addressRegion': data?.region || 'India',
				'postalCode': data?.postalCode || '560036',
				'addressCountry': data?.country || 'IN'
			},
			'priceRange': data?.priceRange || '$$$',
			'sameAs': [
				'https://www.facebook.com/neelgunddevelopers?mibextid=ZbWKwL',
				'https://x.com/NeelgunddevlLLP',
				'https://www.instagram.com/neelgunddevelopers?igsh=aTM5eGRiMWxpZ2N2',
				'https://www.linkedin.com/company/neelgund/',
			],
			'openingHoursSpecification': [
				{
					'@type': 'OpeningHoursSpecification',
					'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
					'opens': '00:00',
					'closes': '23:59'
				}
			]
		};

		if (!environment.production) {
			// console.log('🏢 Local Business Schema:', schema);
		}

		this.injectSchema(schema);
	}

	/**
	 * Set Service Schema (for service detail pages)
	 */
	setServiceSchema(service: any): void {
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'Service',
			'name': service.name || 'NEELGUND CLUBS',
			'description': service.description || service.meta_description || '',
			'provider': {
				'@type': 'Organization',
				'name': 'Neelgund'
			},
			'areaServed': {
				'@type': 'City',
				'name': 'India'
			},
			'image': service.image || `${this.getBaseUrl()}/assets/logo.png`,
			'priceRange': service.priceRange || '$$$',
			'url': service.url || `${this.getBaseUrl()}/services`
		};

		if (!environment.production) {
			console.log('🔧 Service Schema:', schema);
		}

		this.injectSchema(schema);
	}

	/**
	 * Set Category/Collection Schema
	 */
	setCategorySchema(category: any, canonicalUrl: string, items?: Array<{ name: string; url: string }>): void {
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			'name': category.name || 'NEELGUND CONSTRUCTION',
			'description': category.description || category.meta_description || '',
			'url': canonicalUrl,
			'image': category.image || `${this.getBaseUrl()}/assets/logo.png`,
			'mainEntity': items ? items.map(item => ({
				'@type': 'Product',
				'name': item.name,
				'url': item.url
			})) : undefined
		};

		// Remove undefined properties
		Object.keys(schema).forEach(key => schema[key] === undefined && delete schema[key]);

		if (!environment.production) {
			console.log('📂 Category Schema:', schema);
		}

		this.injectSchema(schema);
	}

	/**
	 * Set FAQ Schema (for FAQ sections)
	 */
	setFaqSchema(faqs: Array<{ question: string; answer: string }>): void {
		const mainEntity = faqs.map(faq => ({
			'@type': 'Question',
			'name': faq.question,
			'acceptedAnswer': {
				'@type': 'Answer',
				'text': faq.answer
			}
		}));

		const schema = {
			'@context': 'https://schema.org',
			'@type': 'FAQPage',
			'mainEntity': mainEntity
		};

		if (!environment.production) {
			// console.log('❓ FAQ Schema:', schema);
		}

		this.injectSchema(schema);
	}

	/**
	 * Set Contact Page Schema
	 */
	setContactPageSchema(contactData?: any): void {
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'ContactPage',
			'name': 'Contact Us - Neelgund',
			'description': 'Get In Touch contact for any query',
			'url': `${this.getBaseUrl()}/contact`,
			'mainEntity': {
				'@type': 'LocalBusiness',
				'name': 'Neelgund',
				'telephone': contactData?.phone || '+91 80502 38777',
				'email': contactData?.email || 'info@neelgund.com',
				'address': {
					'@type': 'PostalAddress',
					'streetAddress': contactData?.streetAddress || 'No 14A, 3rd Floor, Stellar Mall, beside JG commerce college, Jayanagar, Vidya Nagar, Hubballi',
					'addressLocality': 'India',
					'addressCountry': 'IN'
				}
			}
		};

		if (!environment.production) {
			// console.log('📞 Contact Page Schema:', schema);
		}

		this.injectSchema(schema);
	}

	/**
	 * Set Image Schema (for gallery/image-heavy pages)
	 */
	setImageSchema(images: Array<{ url: string; caption: string }>): void {
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'ImageGallery',
			'associatedMedia': images.map(img => ({
				'@type': 'ImageObject',
				'url': img.url,
				'description': img.caption
			}))
		};

		if (!environment.production) {
			// console.log('🖼️ Image Schema:', schema);
		}

		this.injectSchema(schema);
	}

	/**
	 * Collect schema for injection (works on both server and client)
	 */
	private injectSchema(schema: any): void {
		// Track the schema for injection
		this.collectedSchemas.push(schema);

		if (!environment.production) {
			// console.log('✅ Schema collected for injection:', JSON.stringify(schema, null, 2));
		}

		// For browser: also inject directly as script tag
		if (this.isBrowser()) {
			setTimeout(() => {
				const scriptTag = document.createElement('script');
				scriptTag.type = 'application/ld+json';
				scriptTag.setAttribute('data-schema-type', schema['@type']);
				scriptTag.textContent = JSON.stringify(schema);
				document.head.appendChild(scriptTag);

				if (!environment.production) {
					console.log('✅ Schema injected into browser DOM');
				}
			}, 0);
		}
	}

	/**
	 * Get collected schemas (used by app component for SSR injection)
	 */
	getCollectedSchemas(): any[] {
		return this.collectedSchemas;
	}

	/**
	 * Clear collected schemas
	 */
	clearCollectedSchemas(): void {
		this.collectedSchemas = [];

		if (!environment.production) {
			console.log('🗑️ Collected schemas cleared');
		}
	}

	/**
	 * Remove all schemas from DOM (browser only)
	 */
	removeAllSchemas(): void {
		if (!this.isBrowser()) {
			return;
		}

		const scripts = document.querySelectorAll('script[type="application/ld+json"][data-schema-type]');
		scripts.forEach(script => script.remove());

		this.clearCollectedSchemas();

		if (!environment.production) {
			console.log('🗑️ All schemas removed from DOM');
		}
	}

	/**
	 * Clear and set fresh schema (recommended for SPA navigation)
	 */
	resetAndSetSchema(schema: any): void {
		this.removeAllSchemas();
		setTimeout(() => {
			this.injectSchema(schema);
		}, 0);
	}
}
