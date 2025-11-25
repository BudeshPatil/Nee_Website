import { Component, Inject, OnInit, Optional, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';
@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrl: './error404.component.scss'
})
export class Error404Component implements OnInit {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private meta: Meta,
    private title: Title,
    @Optional() @Inject(RESPONSE) private response: Response

  ) {}

  // Handle search form submission
  search(query: string): void {
    if (query && query.trim()) {
      // In a real app, you would navigate to search results
      // For now, we'll just log it
      console.log('Searching for:', query.trim());
      // Example: this.router.navigate(['/search'], { queryParams: { q: query.trim() } });
    }
  }

  // Handle keyboard enter key in search input
  onSearchKeydown(event: KeyboardEvent, query: string): void {
    if (event.key === 'Enter') {
      this.search(query);
    }
  }

  ngOnInit(): void {
    const url = this.router.url;
    const message = `404 Not Found: ${url}`;
    
    // Set page title and meta tags
    this.title.setTitle('Page Not Found | Ghost Rentals');
    this.meta.updateTag({ name: 'robots', content: 'noindex, follow' });
    
    // Set HTTP status code to 404
    if (isPlatformServer(this.platformId)) {
      // This will be handled by the server's response status code
      console.error('🚨 SSR 404:', message);
      this.response.status(404);
      
      // In a real SSR setup, you would set the response status code here
      // This requires server-side implementation in your server.ts file
    } else {
      // For client-side navigation, we can't set the status code directly
      // But we can log it for debugging
      console.error('🚨 Client 404:', message);
      
      // For client-side 404s, we can update the browser's history state
      const state = window.history.state || {};
      window.history.replaceState(
        { ...state, is404: true },
        '',
        window.location.href
      );
    }
  }
}
