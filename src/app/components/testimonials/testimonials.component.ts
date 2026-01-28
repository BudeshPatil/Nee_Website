import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { DataService } from '../../providers/data/data.service';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.scss'
})
export class TestimonialsComponent {
baseUrl: any;
  imagePath: any;
  isBrowser: boolean;
constructor(
    @Inject(PLATFORM_ID) private _platformId: Object,
    public dataService: DataService,
  ) {
     
    this.isBrowser = isPlatformBrowser(this._platformId);
    this.imagePath = environment.baseUrl + '/public/';
    this.baseUrl = environment.url;
    this.isBrowser = isPlatformBrowser(this._platformId);
  }
}
