import { Component, HostListener, PLATFORM_ID, OnDestroy, OnInit, Inject, Renderer2 } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DataService } from '../../providers/data/data.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})

export class HeaderComponent implements OnInit, OnDestroy {
	baseUrl = environment.url;
	isScrolled = false;
	isFleetOpen = false;
	isSearchOpen = false;
	menuOpen = false;
	menuText = 'MENU';
	invertRoutes = ['/journal', '/journal-detail'];
	hideHeader = false;
	lastScrollTop = 0;
	searchtxt: any = '';
	projects: any = [];
	filteredProjects: any = [];
	isPopupshow: boolean = false;
	imagePath: any;
	menuItems = [
		{ label: 'home', path: '/', menuText: 'HOME' },
		{ label: 'about us', path: '/about', menuText: 'ABOUT' },
		{ label: 'services', path: '/services', menuText: 'SERVICES' },
		{ label: 'portfolio', path: '/portfolio', menuText: 'PORTFOLIO' },
		// { label: 'journal', path: '/journal', menuText: 'JOURNAL' },
		{ label: 'contact us', path: '/contact', menuText: 'CONTACT' }
	];
	isMenuOpen:boolean = false;

	private routerSubscription: any;

	constructor(
		public router: Router,
		private renderer: Renderer2,
		@Inject(DOCUMENT) private document: Document,
		@Inject(PLATFORM_ID) private platformId: Object,
		public dataService: DataService
	) {
		this.imagePath = environment.baseUrl + '/public/';
	 }

	@HostListener('window:scroll', [])
	onScroll(): void {
		const currentScroll = window.scrollY;

		this.isScrolled = currentScroll > 50;

		if (currentScroll > this.lastScrollTop && currentScroll > 200) {
			this.hideHeader = true;
		} else {
			this.hideHeader = false;
		}

		this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
	}

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			this.currentRoute = window.location.pathname;
			this.setMenuTextFromRoute(this.currentRoute);
		}
		this.routerSubscription = this.router.events.pipe(
			filter(event => event instanceof NavigationEnd)
		).subscribe((event: any) => {
			this.currentRoute = event.url.split('?')[0];
			this.setMenuTextFromRoute(this.currentRoute);
		});
		this.getAllprojects();
	}

	ngOnDestroy() {
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}

	togglePopup() {
		this.isPopupshow = !this.isPopupshow;
		if (this.isPopupshow) {
			this.filteredProjects = [];
			this.searchtxt = '';
		}
	}
	toggelmenu() {
  		this.isMenuOpen = !this.isMenuOpen;
	}
	closeMenu() {
  		this.isMenuOpen = false;
	}

	onSearchInput(event: any) {
		const searchValue = event.target.value.toLowerCase();
		this.searchtxt = searchValue;

		if (!searchValue.trim()) {
			this.filteredProjects = [];
			return;
		}

		this.filteredProjects = this.projects.filter((project: any) =>
			project.name?.toLowerCase().includes(searchValue) ||
			project.location?.toLowerCase().includes(searchValue) ||
			project.category_data?.some((cat: string) => cat.toLowerCase().includes(searchValue))
		);
	}

	goToProjectDetail(project: any) {
		this.isPopupshow = false;
		this.searchtxt = '';
		this.filteredProjects = [];
		// Navigate to project detail based on project type
		if (project.is_completed) {
			this.router.navigate(['/portfolio', project.url_key]);
		} else {
			this.router.navigate(['/portfolio', project.url_key]);
		}
	}

	getAllprojects() {
		let obj = {
			limit:100,
			page:1,
			selected_status:'all'
		};
		this.dataService.getAllProjects(obj).subscribe((response: any) => {
		if (response.code == 200) {
			if (response.result != null && response.result != '') {
			this.projects = response.result;
			} else {
			}
		}
		});
  }

	trackByFn(index: number, project: any): string | number {
		return project._id;
	}

	currentRoute: string = '';

	shouldInvertLogo(): boolean {
		const shouldInvert = this.invertRoutes.some(route => this.currentRoute.startsWith(route));
		return shouldInvert;
	}

	private setMenuTextFromRoute(url: string) {
		this.currentRoute = url.split('?')[0];
		const currentItem = this.menuItems.find(item => item.path === this.currentRoute || (this.currentRoute.startsWith(item.path) && item.path !== '/'));
		if (currentItem) {
			this.menuText = currentItem.menuText;
		} else if (url === '/') {
			this.menuText = 'HOME';
		} else {
			this.menuText = 'MENU';
		}
	}

	toggleMenu() {
		this.menuOpen = !this.menuOpen;
		if (isPlatformBrowser(this.platformId)) {
			if (this.menuOpen) {
				this.renderer.addClass(this.document.body, 'no-scroll');
			} else {
				this.renderer.removeClass(this.document.body, 'no-scroll');
			}
		}
	}

	toggleMenuClose() {
		this.menuOpen = false;
		if (isPlatformBrowser(this.platformId)) {
			this.renderer.removeClass(this.document.body, 'no-scroll');
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize() {
		if (window.innerWidth > 992) {
			this.menuOpen = false;
			document.body.style.overflow = '';
		}
	}

	onMenuItemHover(menuItem: any) {
		this.menuText = menuItem.menuText;
	}

	onMenuLeave() {
		const currentRoute = window.location.pathname;
		const currentItem = this.menuItems.find(item => item.path === currentRoute || (currentRoute.startsWith(item.path) && item.path !== '/'));

		if (!currentItem) {
			this.menuText = 'MENU';
		}
	}
}