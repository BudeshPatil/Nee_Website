import { Injectable } from '@angular/core';

/**
 * Service to handle schema injection for SSR
 * This collects schemas during rendering and injects them into the document
 */
@Injectable({ providedIn: 'root' })
export class SchemaSsrService {
	private schemas: any[] = [];

	/**
	 * Add schema to collection (called during SSR rendering)
	 */
	addSchema(schema: any): void {
		this.schemas.push(schema);
	}

	/**
	 * Get all collected schemas
	 */
	getSchemas(): any[] {
		return this.schemas;
	}

	/**
	 * Clear schemas (useful for route changes)
	 */
	clearSchemas(): void {
		this.schemas = [];
	}

	/**
	 * Inject all schemas into head as script tags
	 */
	injectIntoHead(document: Document): void {
		this.schemas.forEach(schema => {
			const scriptTag = document.createElement('script');
			scriptTag.type = 'application/ld+json';
			scriptTag.textContent = JSON.stringify(schema);
			document.head.appendChild(scriptTag);
		});
	}

	/**
	 * Get schemas as combined graph (Google recommended)
	 */
	getSchemasAsGraph(): any {
		return {
			'@context': 'https://schema.org',
			'@graph': this.schemas
		};
	}
}
