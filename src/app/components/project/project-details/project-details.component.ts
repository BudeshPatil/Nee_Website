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
  recentProjects: any[] = [];
  imagePath = environment.baseUrl + '/public/';
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
    this.projectService.getProjectsByURL({ url_key: urlKey }).subscribe(res => {
      if (res?.code === 200) {
        this.projectData = res.result;
        this.recentProjects = res.result.related_prjects || [];
        this.seo.updateProjectMeta(urlKey, `/project/${urlKey}`);
        this.cdr.detectChanges();
      }
    });
  }

  onImageLoad(): void {
    if (this.isBrowser) AOS.refresh();
  }

  ngOnDestroy(): void {
    this.swiper?.destroy(true, true);
    this.swiper = null;
  }
}
