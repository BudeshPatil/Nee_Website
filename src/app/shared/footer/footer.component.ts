import { Component, Inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  baseUrl:any;
  heartURL: string = `${environment.url}/assets/images/icons`;

  
  currentYear: number = new Date().getFullYear();
  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    private router: Router
  ){
      this.baseUrl=environment.url;
  }


  isActive = false;

  setActive(state: boolean): void {
    this.isActive = state;
  }

  getImagePath(): string {
    return `${this.heartURL}/heart_${this.isActive ? 'active' : 'inactive'}.svg`;
  }
}
