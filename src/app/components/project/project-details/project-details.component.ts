import {
  Component,
  Inject,
  OnInit,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { ProjectService } from '../../../providers/project/project.service';
import { SeoService } from '../../../providers/seo/seo.service';
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
import * as AOS from 'aos';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.scss'
})
export class ProjectDetailsComponent
  implements OnInit, AfterViewInit, OnDestroy {

  projectData: any;
  normalizedPhases: any[] = [];
  selectedPhaseIndex = 0;
  selectedPhase: any = null;
  selectedPhaseImage: string | null = null;
  selectedPhaseDetails: { label: string; value: string; icon: string }[] = [];
  selectedPhaseAdditionalFields: { label: string; value: string }[] = [];
  recentProjects: any[] = [];
  imagePath = environment.baseUrl + '/public/';
  loading = false;
  errorMessage: string | null = null;
  private swiper: Swiper | null = null;
  isBrowser = false;

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService,
    private seo: SeoService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) return;

    this.route.params.subscribe(() => {
      this.loadProject();
      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      Swiper.use([Autoplay, Pagination]);
      this.swiper = new Swiper('.mySwiper', {
        slidesPerView: 1,
        loop: true,
        autoplay: { delay: 5000 },
        pagination: { el: '.swiper-pagination', clickable: true }
      });
    }, 500);
  }

  loadProject(): void {
    const urlKey = this.route.snapshot.paramMap.get('url_key')!;
    this.loading = true;
    this.errorMessage = null;
    this.projectService.getProjectsByURL({ url_key: urlKey }).subscribe(
      (res) => {
        if (res?.code === 200) {
          this.projectData = res.result;
          this.normalizedPhases = this.normalizePhases(this.projectData?.phases);
          this.selectPhase(0);
          this.recentProjects = res.result.related_prjects || [];
          this.seo.updateProjectMeta(urlKey, `/project/${urlKey}`);
        } else {
          this.errorMessage = res?.message || 'Failed to load project data.';
        }
        this.cdr.detectChanges();
      },
      (err) => {
        this.errorMessage = 'Failed to load project data.';
        this.loading = false;
        this.cdr.detectChanges();
      },
      () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    );
  }

  onImageLoad(): void {
    if (this.isBrowser) AOS.refresh();
  }

  normalizePhases(phases: any): any[] {
    if (!phases) {
      return [];
    }
    if (Array.isArray(phases)) {
      return phases.filter(phase => phase && typeof phase === 'object');
    }
    if (typeof phases === 'string') {
      try {
        const parsed = JSON.parse(phases);
        if (Array.isArray(parsed)) {
          return parsed.filter(phase => phase && typeof phase === 'object');
        }
      } catch {
        return [];
      }
    }
    if (typeof phases === 'object') {
      return [phases];
    }
    return [];
  }

  selectPhase(index: number): void {
    this.selectedPhaseIndex = index;
    this.selectedPhase = this.normalizedPhases[index] || null;

    if (!this.selectedPhase) {
      this.selectedPhaseImage = null;
      this.selectedPhaseDetails = [];
      this.selectedPhaseAdditionalFields = [];
      return;
    }

    this.selectedPhaseImage = this.selectedPhase.image || this.selectedPhase.project_images?.[0] || null;

    const details: { label: string; value: string; icon: string }[] = [];
    if (this.selectedPhase.area) {
      details.push({ label: 'Area', value: this.selectedPhase.area, icon: 'fas fa-chart-area text-primary me-2' });
    }
    if (this.selectedPhase.noofplots || this.selectedPhase.plots) {
      details.push({ label: 'Plots', value: this.selectedPhase.noofplots || this.selectedPhase.plots, icon: 'fas fa-th text-primary me-2' });
    }
    if (this.selectedPhase.dimentions) {
      details.push({ label: 'Dimensions', value: this.selectedPhase.dimentions, icon: 'fas fa-ruler-combined text-primary me-2' });
    }
    if (this.selectedPhase.price) {
      details.push({ label: 'Price', value: this.selectedPhase.price, icon: 'fas fa-tags text-primary me-2' });
    }
    if (this.selectedPhase.location) {
      details.push({ label: 'Location', value: this.selectedPhase.location, icon: 'fas fa-map-marker-alt text-primary me-2' });
    }
    this.selectedPhaseDetails = details;

    const skipKeys = new Set(['name', 'description', 'image', 'project_images', 'area', 'noofplots', 'plots', 'dimentions', 'price', 'location']);
    this.selectedPhaseAdditionalFields = this.objectKeys(this.selectedPhase)
      .filter(key => this.selectedPhase[key] && !skipKeys.has(key))
      .map(key => ({ label: this.prettyKey(key), value: this.selectedPhase[key] }));
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  prettyKey(key: string): string {
    return key ? key.replace(/_/g, ' ') : key;
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);
    this.swiper = null;
  }
}
