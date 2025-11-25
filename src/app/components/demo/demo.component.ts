import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';
import * as AOS from 'aos';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent {
 title = 'ghost-rental';
  isLoading = true;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Method called when the video ends
  onVideoEnded(): void {
    this.isLoading = false;
    if (this.isBrowser) {
      document.body.style.overflow = 'auto';
    }
  }

  ngOnInit(): void {
    if (this.isLoading && this.isBrowser) {
      document.body.style.overflow = 'hidden';
    }

    if (this.isBrowser) {
      AOS.init({
        once: true,
      });
    }
  }
}
