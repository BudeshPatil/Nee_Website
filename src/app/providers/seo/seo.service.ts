import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs';
import { of } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
	private readonly pageApi = `${environment.baseUrl}/api/home/getpagewithName`;
	private readonly projectApi = `${environment.baseUrl}/api/project/projectbyurlKey`;
	constructor(@Inject(DOCUMENT) private doc: Document,private http: HttpClient,private meta: Meta,
		private title: Title,@Inject(DOCUMENT) private dom: Document) { }

	setCanonicalURL(url?: string): void {
		const canonicalUrl = url || this.doc.URL;
		let link: HTMLLinkElement = this.doc.querySelector("link[rel='canonical']");

		if (link) {
			link.href = canonicalUrl;
		} else {
			link = this.doc.createElement('link');
			link.setAttribute('rel', 'canonical');
			link.setAttribute('href', canonicalUrl);
			this.doc.head.appendChild(link);
		}
	}

	/** ------- STATIC PAGE SEO ------- */
	updatePageMeta(pageName: string, path: string): void {
		this.http.post<any>(this.pageApi, { pageName })
			.pipe(catchError(() => of(null)))
			.subscribe(res => {
				if (!res || res.status !== 'Success' || !res.result) {
					return; // 🚀 do nothing, NO crash
				}

				const meta_title = res.result.meta_title || '';
				const meta_description = res.result.meta_description || '';
				const meta_keywords = res.result.meta_keywords || '';

				const fullUrl = environment.url + path;

				this.applyMeta(meta_title, meta_description, meta_keywords, fullUrl);
				this.insertSchema(this.generateDefaultSchema(meta_title, meta_description, fullUrl));
			});
	}


	/** ------- PROJECT DETAIL SEO ------- */
	updateProjectMeta(urlKey: string, path: string): void {
		this.http.post<any>(this.projectApi, { url_key: urlKey })
			.pipe(catchError(() => of(null)))
			.subscribe(res => {
				if (!res || res.status !== 'Success' || !res.result) {
					return; // 🚀 avoids crash during prerender
				}

				const p = res.result;

				const title = p.name || 'Project';
				const desc = p.desc || p.desc_1 || '';
				const keywords = p.category_name || '';
				const fullUrl = environment.url + path;

				this.applyMeta(title, desc, keywords, fullUrl);
				this.insertSchema(this.generateProjectSchema(p, fullUrl));
			});
	}

	/** ------- COMMON META HANDLER ------- */
	private applyMeta(title: string, description: string, keywords: string, url: string): void {
		this.title.setTitle(title);
		this.meta.updateTag({ name: 'description', content: description });
		this.meta.updateTag({ name: 'keywords', content: keywords });

		this.meta.updateTag({ property: 'og:title', content: title });
		this.meta.updateTag({ property: 'og:description', content: description });
		this.meta.updateTag({ property: 'og:url', content: url });

		this.updateCanonical(url);
	}

	/** ------- CANONICAL ------- */
	private updateCanonical(url: string): void {
		let link: HTMLLinkElement =
			this.dom.querySelector("link[rel='canonical']") || this.dom.createElement('link');
		link.setAttribute('rel', 'canonical');
		link.setAttribute('href', url);
		if (!link.parentNode) this.dom.head.appendChild(link);
	}

	/** ------- DEFAULT SCHEMA ------- */
	private generateDefaultSchema(title: string, desc: string, url: string): any {
		return {
			"@context": "https://schema.org",
			"@type": "WebPage",
			"url": url,
			"name": title,
			"description": desc
		};
	}

	/** ------- PROJECT SCHEMA ------- */
	private generateProjectSchema(p: any, url: string): any {
		const imgBase = `${environment.baseUrl}/public/project/`;

		return {
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			"name": p.name,
			"description": p.desc,
			"url": url,
			"image": [
				p.image ? imgBase + p.image : null,
				p.image_thumnail ? imgBase + p.image_thumnail : null
			].filter(Boolean),
			"creator": {
				"@type": "Organization",
				"name": "Neelgund"
			}
		};
	}

	/** ------- INSERT SCHEMA ------- */
	private insertSchema(schemaData: any): void {
		const existing = this.dom.querySelector('script[type="application/ld+json"]');
		if (existing) existing.remove();

		const script = this.dom.createElement('script');
		script.type = 'application/ld+json';
		script.textContent = JSON.stringify(schemaData, null, 2);

		this.dom.head.appendChild(script);
	}
}
