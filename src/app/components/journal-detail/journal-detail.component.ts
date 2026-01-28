import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
@Component({
  selector: 'app-journal-detail',
  templateUrl: './journal-detail.component.html',
  styleUrls: ['./journal-detail.component.scss']
})
export class JournalDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  baseUrl = environment.url;
  activeSection: string = 'section1';
  private observer: IntersectionObserver;

  constructor(private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setupIntersectionObserver();
      // this.initScrollTrigger();
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  scrollTo(sectionId: string): void {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      // Calculate the exact position to scroll to
      const headerOffset = 150; // Same as your sticky header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      // Smooth scroll to the calculated position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      const visibleSections = new Map();

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          // Calculate visibility ratio (0 to 1)
          const rect = entry.boundingClientRect;
          const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
          const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
          const visibilityRatio = Math.max(0, Math.min(1, visibleHeight / viewportHeight));

          if (visibilityRatio > 0) {
            visibleSections.set(sectionId, visibilityRatio);
          }
        }
      });

      // Find the most visible section
      let maxVisibility = 0;
      let mostVisibleSection = this.activeSection; // Default to current active section

      visibleSections.forEach((visibility, sectionId) => {
        if (visibility > maxVisibility) {
          maxVisibility = visibility;
          mostVisibleSection = sectionId;
        }
      });

      // Only update if we found a visible section and it's different from current
      if (mostVisibleSection && mostVisibleSection !== this.activeSection) {
        this.activeSection = mostVisibleSection;
        this.cdr.detectChanges();
      }
    }, options);

    // Observe all section headers
    const sections = document.querySelectorAll('h3[id^="section"]');
    sections.forEach(section => this.observer.observe(section));

    // Also observe the last section's content to handle the bottom of the page
    const lastSection = sections[sections.length - 1]?.nextElementSibling;
    if (lastSection) {
      this.observer.observe(lastSection);
    }
  }

  isActive(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }
  initScrollTrigger(): void {
    gsap.from('.main-animate', {
      clipPath: 'inset(0 0 100% 0)',
      duration:1,
      ease: 'power3.inOut',
    });


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
