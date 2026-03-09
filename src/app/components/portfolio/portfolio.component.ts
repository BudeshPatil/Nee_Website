import {
  AfterViewInit,
  Component,
  OnDestroy,
  Renderer2,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { register } from 'swiper/element/bundle';
import { SwiperOptions } from 'swiper/types';
import { environment } from '../../../environments/environment';
import { Mousewheel, EffectCreative } from 'swiper/modules';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../providers/data/data.service';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../providers/category/category.service';
import { ActivatedRoute, Router } from '@angular/router';

register();

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements AfterViewInit, OnDestroy {
  baseUrl: string = environment.url;
  private observer: IntersectionObserver | null = null;
  private visibleSlides = new Set<number>();
  private destroy$ = new Subject<void>();
  imagePath: string = environment.baseUrl + '/public/';

  servicesData: any = [];
  selectedCategory: string = 'all';

  allProjects: any = [];
  projects: any[] = [];

  activecategory: string = '';
  bannerData: any = [];
  totalPages: any;
  currentPage: any;
  pages: any;
  displayedList: any = [];
  sortOption: any;
  constructor(
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    public dataService: DataService,
    public categoryService: CategoryService,
    private router: Router,
    public route: ActivatedRoute

  ) {
    this.getAllprojects();
    this.getAllServices();
    this.getBannerdata();
    this.route.params.subscribe(params => {
      this.activecategory = params['category'] || '';
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const swiperEl = document.querySelector('swiper-container');
      if (swiperEl) {
        Object.assign(swiperEl, this.swiperConfig);
        // @ts-ignore
        swiperEl.initialize();
        // this.setupImageLoading();
      }
      window.scrollTo(0, 0);
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectProject(url_key: string): void {
    this.router.navigate(['/project/project-details', url_key]);
  }

  changePage(i) {

  }

  goToPage(p) {

  }

  setSort(s) {

  }

  getBannerdata() {
    let obj = {};
    this.dataService.getAllBanner(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          let tempcat = response.result.filter((cat: any) => cat.name == 'about');
          if (tempcat && tempcat.length > 0) {
            this.bannerData = tempcat;
          }
        } else {
        }
      }
    });
  }

  // private setupImageLoading(): void {
  //   // Load first slide immediately
  //   const firstSlide = document.querySelector('swiper-slide[data-index="0"]');
  //   if (firstSlide) {
  //     this.visibleSlides.add(0);
  //     this.renderer.addClass(firstSlide, 'loaded');
  //   }

  //   // Load all other slides after 1 second
  //   setTimeout(() => {
  //     const allSlides = document.querySelectorAll('swiper-slide');
  //     allSlides.forEach((slide, index) => {
  //       if (index > 0) {
  //         this.visibleSlides.add(index);
  //         this.renderer.addClass(slide, 'loaded');
  //       }
  //     });
  //   }, 1000);
  // }

  // shouldLoadImage(index: number): boolean {
  //   return this.visibleSlides.has(index);
  // }

  swiperConfig: SwiperOptions = {
    direction: 'vertical',
    modules: [Mousewheel, EffectCreative],
    slidesPerView: 1,
    grabCursor: true,
    spaceBetween: 0,
    observer: true,
    observeParents: true,
    loop: false,
    rewind: false,
    mousewheel: {
      // releaseOnEdges: true,
      releaseOnEdges: false,
      sensitivity: 1,
      forceToAxis: true
    },
    speed: 900,
    resistance: true,
    resistanceRatio: 1,
    pagination: false,
    effect: 'creative',
    creativeEffect: {
      prev: {
        translate: ["0%", 0, -1],
      },
      next: {
        translate: [0, "100%", 0],
      },
    }
  };

  isActive(categoryId: string): boolean {
    return this.selectedCategory === categoryId;
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.updateDisplayedItems();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      const swiperEl = document.querySelector('swiper-container');
      if (swiperEl?.swiper) {
        swiperEl.swiper.slideTo(0, 0);
        swiperEl.swiper.update();
      }
    }, 150);
  }

  private updateDisplayedItems(): void {
    if (this.selectedCategory === 'all') {
      this.projects = Object.values(this.allProjects)
        .flat()
        .sort((a: any, b: any) => (a.sequence_number || 0) - (b.sequence_number || 0));
    } else {
      this.projects = (this.allProjects[this.selectedCategory] || [])
        .slice() // prevent mutation
        .sort((a: any, b: any) => (a.sequence_number || 0) - (b.sequence_number || 0));
    }
  }


  getAllprojects(): void {
    const obj = {
      limit: 1000,
    };
    this.dataService
      .getAllProjects(obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.code === 200 && response.result) {
          this.allProjects = response.result;

          this.updateDisplayedItems();
        }
      });
  }

  getAllServices(): void {
    const obj = {};
    this.categoryService
      .getAllCategory(obj)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        if (response.code === 200 && response.result?.length > 0) {
          this.servicesData = [
            { _id: 'all', name: 'All' },
            ...response.result,
          ];
          if (this.activecategory) {
            response.result.forEach((cat: any) => {
              if (cat.url_key.toLowerCase() === this.activecategory.toLowerCase()) {
                this.selectedCategory = cat._id;
              }
            });
          } else {
            this.selectedCategory = 'all';
          }
          this.updateDisplayedItems();
        }
      });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'OnGoing Project':
        return 'status-ongoing';
      case 'Completed Projects':
        return 'status-completed';
      case 'Featured Project':
        return 'status-featured';
      default:
        return '';
    }
  }
}