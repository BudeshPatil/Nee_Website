// smooth-scroll.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({ providedIn: 'root' })
export class SmoothScrollService {
  private content!: HTMLElement | null;
  private running = false;
  private speed = 0.12; // lower = smoother/slower feel
  private scrollY = 0;
  private renderedY = 0;
  private resizeObserver?: ResizeObserver;
  private tickFn = () => { this.tick(); };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // only register plugin in browser
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
    }
  }

  init(selector = '.smooth-scroll-content') {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.running) return;

    this.content = document.querySelector(selector) as HTMLElement | null;
    if (!this.content) {
      console.warn('SmoothScrollService: no element found for', selector);
      return;
    }

    // set initial body height so scrollbar exists
    this.setBodyHeight();

    // hook native scroll to update target value
    this.scrollY = window.scrollY || window.pageYOffset;
    this.renderedY = this.scrollY;
    window.addEventListener('scroll', this.onScroll, { passive: true });

    // let ScrollTrigger use the browser scroll (we are transforming content)
    ScrollTrigger.scrollerProxy(document.scrollingElement || document.documentElement, {
      scrollTop: (value?: number) => {
        if (value !== undefined) {
          window.scrollTo(0, value);
        }
        return window.scrollY || window.pageYOffset;
      },
      getBoundingClientRect: () => ({ top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }),
      pinType: this.content.style.transform ? 'transform' : 'fixed'
    });

    // observe content size changes (images, dynamic content)
    this.resizeObserver = new ResizeObserver(() => {
      this.setBodyHeight();
      ScrollTrigger.refresh();
    });
    this.resizeObserver.observe(this.content);

    // refresh listener
    ScrollTrigger.addEventListener('refresh', () => this.setBodyHeight());
    ScrollTrigger.refresh();

    // start ticker
    gsap.ticker.add(this.tickFn);
    this.running = true;
  }

  private onScroll = () => {
    this.scrollY = window.scrollY || window.pageYOffset;
  };

  private tick() {
    // Interpolate (lerp)
    this.renderedY += (this.scrollY - this.renderedY) * this.speed;
    // round to avoid sub-pixel jitter
    const rounded = Math.round(this.renderedY * 100) / 100;
    if (this.content) {
      // transform only — cheap paint, avoids layout thrash
      gsap.set(this.content, { y: -rounded });
    }
    ScrollTrigger.update();
  }

  private setBodyHeight() {
    if (!this.content) return;
    // Use scrollHeight so full content (including overflow) is considered
    const h = Math.max(this.content.scrollHeight, document.documentElement.clientHeight);
    document.body.style.height = `${h}px`;
  }

  // Call on navigation/destroy to cleanup listeners
  destroy() {
    try {
      ScrollTrigger.getAll().forEach(t => t.kill());
      gsap.ticker.remove(this.tickFn);
      window.removeEventListener('scroll', this.onScroll);
      ScrollTrigger.removeEventListener('refresh', () => this.setBodyHeight());
      if (this.resizeObserver && this.content) {
        this.resizeObserver.unobserve(this.content);
        this.resizeObserver.disconnect();
      }
      // clear body height override
      document.body.style.height = '';
      this.running = false;
    } catch (e) {
      console.warn('SmoothScrollService destroy error', e);
    }
  }
}
