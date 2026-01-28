import { Inject,  Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get nativeWindow(): Window | null {
    if (isPlatformBrowser(this.platformId)) {
      return window;
    }
    return null;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Safe to use `window` here
      console.log(window.location.href);
    }
  }
}
