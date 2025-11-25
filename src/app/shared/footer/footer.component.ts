import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild, HostListener } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DOCUMENT, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, first } from 'rxjs/operators';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  imageURL: string = `${environment.url}/assets`;
  heartURL: string = `${environment.url}/assets/images/icons`;
  private isBrowser: boolean;
  isImageVisible = false;
  activeLink = '';
  // Listen to window scroll
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (typeof window === 'undefined') return;
    const scrollY = window.scrollY || window.pageYOffset;
    this.isImageVisible = scrollY >= 100;
  }

  @ViewChild('heartIcon', { static: false }) heartIcon!: ElementRef<HTMLImageElement>;
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Handle fragment navigation after route changes
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const urlTree = this.router.parseUrl(this.router.url);
        if (urlTree.fragment) {
          this.scrollToElement(urlTree.fragment);
        }
      });
      this.setActiveFromUrl();
    }
  }
  setActivemenu(link: string) {
    this.activeLink = link;
  }

  setActiveFromUrl() {
    if (typeof window === 'undefined') return;
    const currentUrl = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const type = searchParams.get('type');

    if (currentUrl.includes('about')) {
      this.activeLink = 'about';
    } else if (currentUrl.includes('services')) {
      this.activeLink = 'services';
    } else if (currentUrl.includes('privacy')) {
      this.activeLink = 'privacy';
    } else if (currentUrl.includes('contact')) {
      this.activeLink = 'contact';
    } else if (currentUrl.includes('terms')) {
      this.activeLink = 'terms';
    } else if (currentUrl.includes('product/search')) {
      if (type === 'Car') {
        this.activeLink = 'cars';
      } else if (type === 'Yachts') {
        this.activeLink = 'yachts';
      }
    }
  }
  // scrollToFAQ(event: Event): void {
  //   if (!this.isBrowser) return;

  //   event.preventDefault();

  //   // Get current route without query params or fragment
  //   const currentRoute = this.router.url.split('?')[0].split('#')[0];

  //   // If already on the current page with the fragment, just scroll
  //   if (this.router.url.includes('faq')) {
  //     this.scrollToElement('faq');
  //     return;
  //   }

  //   // Navigate to current page with fragment
  //   this.router.navigate([currentRoute], { fragment: 'faq' });
  // }

  private scrollToElement(id: string): void {
    if (!this.isBrowser) return;

    const element = this.document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Element with ID '${id}' not found.`);
    }
  }

  isActive = false;

  setActive(state: boolean): void {
    this.isActive = state;
  }

  getImagePath(): string {
    return `${this.heartURL}/heart_${this.isActive ? 'active' : 'inactive'}.svg`;
  }
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


    goToVehiclePage(type: string) {
    this.router.navigate(['/product/search'], { queryParams: { type } });
  }
}
