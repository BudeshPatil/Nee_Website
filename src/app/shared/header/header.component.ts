import { Component, HostListener, OnInit, Renderer2, Inject, ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  imageURL: string = `${environment.url}/assets`;
  isScrolled = false;
  isMenuOpen = false;
  isDarkText = false;
  hasLargePadding = false;
  
  // Routes that should have dark text by default
  private darkTextRoutes = [
    '/privacy',
    '/testimonials',
    '/product/search',
    '/terms',
    '/contact',
    '/product',
    '/services'
    
  ];

  // Routes that should have white text by default
  private whiteTextRoutes = [
    '/',
    '/about',
    '/product/list',
    '/services',
    // '/booking/cars',
    // '/booking/yachts',

  ];

  // Routes that should have large padding
  private largePaddingRoutes = [
    '/',
    '/about',
    '/services',
    // '/booking/cars',
    // '/booking/yachts',
    '/product/list',
    // '/demo'
    
  ];

  private currentRoute = '';
  private isBrowser: boolean;

  constructor(
    public router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private changeDetector: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.setupRouterEvents();
  }

  ngOnInit(): void {
    this.updateRouteState(this.router.url);
  }

  private setupRouterEvents(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const path = event.url.split('?')[0];
      this.updateRouteState(path);
      
      if (this.isBrowser) {
        window.scrollTo(0, 0);
      }
      
      this.updateTextColor();
      this.changeDetector.detectChanges();
    });
  }

  private updateRouteState(path: string): void {
    this.currentRoute = path;
    this.isDarkText = this.darkTextRoutes.some(route => 
      path === route || path.startsWith(route + '/')
    ) && !this.whiteTextRoutes.some(route => 
      path === route || path.startsWith(route + '/')
    );

    this.hasLargePadding = this.largePaddingRoutes.some(route => 
      path === route || path.startsWith(route + '/')
    );
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    
    this.isScrolled = window.scrollY > 50;
    this.renderer[this.isScrolled ? 'addClass' : 'removeClass'](this.document.body, 'header-scrolled');
    this.updateTextColor();
    this.changeDetector.detectChanges();
  }

  private updateTextColor(): void {
    const navElement = this.document.querySelector('nav');
    if (!navElement) return;

    if (this.isScrolled || this.isMenuOpen) {
      this.renderer.addClass(navElement, 'scrolled');
      this.renderer.removeClass(navElement, 'dark-text');
    } else {
      if (this.isDarkText) {
        this.renderer.addClass(navElement, 'dark-text');
        this.renderer.removeClass(navElement, 'scrolled');
      } else {
        this.renderer.removeClass(navElement, 'dark-text');
        this.renderer.removeClass(navElement, 'scrolled');
      }
    }
  }

  toggleMenu(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      this.openMenu();
    } else {
      this.closeMenu();
    }

    this.changeDetector.detectChanges();
  }

  private openMenu(): void {
    this.renderer.addClass(this.document.body, 'menu-open');
    this.renderer.addClass(this.document.documentElement, 'menu-open');
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    this.renderer.setStyle(this.document.documentElement, 'overflow', 'hidden');
    this.animateMenuItems();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.renderer.removeClass(this.document.body, 'menu-open');
    this.renderer.removeClass(this.document.documentElement, 'menu-open');
    this.renderer.removeStyle(this.document.body, 'overflow');
    this.renderer.removeStyle(this.document.documentElement, 'overflow');
    this.resetMenuItems();
  }

  private animateMenuItems(): void {
    if (!this.isBrowser) return;
    
    setTimeout(() => {
      const menuItems = this.document.querySelectorAll<HTMLElement>('.mobile-menu .nav li');
      menuItems.forEach((item) => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
      });
    }, 50);
  }

  private resetMenuItems(): void {
    if (!this.isBrowser) return;
    
    const menuItems = this.document.querySelectorAll<HTMLElement>('.mobile-menu .nav li');
    menuItems.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    const menuButton = this.document.querySelector('.navbar-toggler');
    const menu = this.document.querySelector('.mobile-menu');

    if (this.isMenuOpen &&
      !target.closest('.mobile-menu') &&
      !target.closest('.navbar-toggler')) {
      this.toggleMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.isBrowser && window.innerWidth >= 1200) {
      this.closeMenu();
    }
  }
}