import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PageService } from '../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrl: './location.component.scss'
})
export class LocationComponent {
  url: any;
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
  ) {
    // this.get_PageMeta();
  }

  ngOnInit() {

  }

   get_PageMeta() {
    let url = this.router.url;
    if(url){
      url = url.split('/')[1];
      let obj = { pageName: url };
      this.pageservice.getpageWithName(obj).subscribe((response) => {
        if (response.body.code == 200) {
          this.titleService.setTitle(response?.body.result.meta_title);
          this.metaTagService.updateTag({
            name: 'description',
            content: response?.body.result.meta_description,
          });
          this.metaTagService.updateTag({
            name: 'keywords',
            content: response?.body.result.meta_keywords,
          });
          this.metaTagService.updateTag({
            property: 'og:title',
            content: response?.body.result.meta_title,
          });
          this.metaTagService.updateTag({
            property: 'og:description',
            content: response?.body.result.meta_description,
          });
          this.getLoadURL();
        } else if (response.code == 400) {
          this.getLoadURL();
        } else {
          this.getLoadURL();
        }
      });
    }
  }

  getLoadURL(){
    if (isPlatformBrowser(this.platformId)) {
      this.url = this.router.url;
      if(this.url.includes('Locations')){
        let waUrl = 'https://maps.app.goo.gl/2AxX5kQzyzKzHCc26';
        window.open(waUrl,"_self");
      } else if(this.url.includes('Reviews')){
        let waUrl = 'https://g.page/r/CYLV9IPjYTZLEBM/review';
        window.open(waUrl,"_self");
      } else if(this.url.includes('Instagrams')){
        let waUrl = 'https://www.instagram.com/ghost.rentals/?hl=en';
        window.open(waUrl,"_self");
      } else if(this.url.includes('Facebooks')){
        let waUrl = 'https://www.facebook.com/Ghostrentalsdubai';
        window.open(waUrl,"_self");
      } else if(this.url.includes('TikToks')){
        let waUrl = 'https://www.tiktok.com/@ghostrentals';
        window.open(waUrl,"_self");
      } else if(this.url.includes('Linkedins')){
        let waUrl = 'https://ae.linkedin.com/company/ghostrentals';
        window.open(waUrl,"_self");
      } else if(this.url.includes('YouTubes')){
        let waUrl = 'https://www.youtube.com/@GhostRentalsDXB?app=desktop';
        window.open(waUrl,"_self");
      } else if(this.url.includes('ViewYachts')){
        let waUrl = 'https://www.ghostrentals.com/product/search?type=Yachts';
        window.open(waUrl,"_self");
      } else if(this.url.includes('ViewCars')){
        let waUrl = 'https://www.ghostrentals.com/product/search?type=Car';
        window.open(waUrl,"_self");
      } else if(this.url.includes('ContactUs')){
        let waUrl = 'https://www.ghostrentals.com/contact';
        window.open(waUrl,"_self");
      }
    }
  }
}
