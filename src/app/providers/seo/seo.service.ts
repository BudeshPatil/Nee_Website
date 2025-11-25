import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
	constructor(@Inject(DOCUMENT) private doc: Document) { }

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
}
