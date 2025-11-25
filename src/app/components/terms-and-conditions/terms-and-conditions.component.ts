import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';
@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.scss'
})
export class TermsAndConditionsComponent implements AfterViewInit {
 constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngAfterViewInit() {
    //   if (isPlatformBrowser(this.platformId)) {
    //     AOS.init({
    //       once: true,
    //       mirror: true,
    //       easing: 'ease',
    //     });
    //   }
    }
  
}
