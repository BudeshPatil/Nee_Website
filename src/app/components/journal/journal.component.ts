import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-journal',
  templateUrl: './journal.component.html',
  styleUrl: './journal.component.scss'
})  
export class JournalComponent {
  baseUrl = environment.url;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }

  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => {
      // this.initScrollTrigger();
    }, 100);
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
      duration:2,
    },1);


    const scrollElems = gsap.utils.toArray('.scroll-animate') as HTMLElement[];

    scrollElems.forEach((el) => {
      gsap.from(el, {
        clipPath: 'inset(0 0 100% 0)', 
        ease: 'power3.out',
        duration: 1.5,
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 20%',
        }
      });
    });
    
  }
}
