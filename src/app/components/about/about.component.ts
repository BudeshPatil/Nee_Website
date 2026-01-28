import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../providers/data/data.service';
import { CategoryService } from '../../providers/category/category.service';
import { ElementRef } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
interface TeamMember {
  id: number;
  image: string;
  name: string;
  position: string;
}

@Component({
  selector: 'app-about',  

  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
  baseUrl: string = environment.url;
  imagePath: any;
bannerData:any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    public dataService: DataService,
    public categoryService: CategoryService, private el: ElementRef
  ) { 
    this.imagePath = environment.baseUrl + '/public/';
    this.getAboutdata();
    this.getBannerdata();
  }
  isBrowser: boolean = isPlatformBrowser(this.platformId);
  aboutData: any = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }
  teamMembers: TeamMember[] = [
    {
      id: 1,
      image: '/assets/images/aboutus/team-photos/team-01.webp',
      name: 'Claris Hofman ',
      position: 'Architect'
    },
    {
      id: 2,
      image: '/assets/images/aboutus/team-photos/team-02.webp',
      name: 'Claris Hofman ',
      position: 'Design Director'
    },
    {
      id: 3,
      image: '/assets/images/aboutus/team-photos/team-03.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 4,
      image: '/assets/images/aboutus/team-photos/team-04.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 5,
      image: '/assets/images/aboutus/team-photos/team-05.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 6,
      image: '/assets/images/aboutus/team-photos/team-06.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
     {
      id: 7,
      image: '/assets/images/aboutus/team-photos/team-07.webp',
      name: 'Claris Hofman ',
      position: 'Architect'
    },
    {
      id: 8,
      image: '/assets/images/aboutus/team-photos/team-08.webp',
      name: 'Claris Hofman ',
      position: 'Design Director'
    },
    {
      id: 9,
      image: '/assets/images/aboutus/team-photos/team-09.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 10,
      image: '/assets/images/aboutus/team-photos/team-10.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 11,
      image: '/assets/images/aboutus/team-photos/team-11.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
    {
      id: 12,
      image: '/assets/images/aboutus/team-photos/team-12.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    },
     {
      id: 13,
      image: '/assets/images/aboutus/team-photos/team-13.webp',
      name: 'Claris Hofman ',
      position: 'Architect'
    },
    {
      id: 14,
      image: '/assets/images/aboutus/team-photos/team-14.webp',
      name: 'Claris Hofman ',
      position: 'Design Director'
    },
    {
      id: 15,
      image: '/assets/images/aboutus/team-photos/team-15.webp',
      name: 'Claris Hofman ',
      position: 'Interior Designer'
    }
  ];

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    // this.initScrollTrigger();
  }
  initScrollTrigger(): void {
    const tl = gsap.timeline({
      defaults:{
        ease: 'power3.out',
      }
    });
    tl.from('.sub-heading', {
      yPercent:-500,
    },.5)
    
    .from('.heading', {
      yPercent:-200,
      duration:2,
    },.5)
    .from('.description', {
      yPercent:-200,
      duration:2,
    },.8)
    .from('.button', {
      opacity:1,
      duration:2,
    },1)
    .from('.content-animate', {
      clipPath: 'inset(0 0 100% 0)',
    },.5);


    const scrollElems = gsap.utils.toArray('.scroll-animate') as HTMLElement[];

    scrollElems.forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(0 0 100% 0)', 
        ease: 'power3.inOut',
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
        }
      });
    });
    
  }
  getAboutdata() {
    let obj = {};
    this.dataService.getAllAbout(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          let temppage = response.result.filter((pagesection: any) => pagesection.page_section == 'about');
          if (temppage && temppage.length > 0) {
            this.aboutData = temppage;
          }
        }
      }
    });
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

}