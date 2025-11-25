import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { PageService } from '../../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  imageURL: string = `${environment.url}/assets`;
  constructor(
    private route: ActivatedRoute,
    private router: Router,public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
  ) {
    // this.get_PageMeta();
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.route.fragment.pipe(first()).subscribe(fragment => {
        if (fragment) {
          setTimeout(() => {
            const element = document.getElementById(fragment);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 0);
        }
      });
    });
  }
  goToVehiclePage(type: string) {
    this.router.navigate(['/product/search'], { queryParams: { type } });
  }
  get_PageMeta() {
		let obj = { pageName: 'services' };
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
			} else if (response.code == 400) {
			} else {
			}
		});
	}

  sendWhatsAppMsgs() {
      const message = `Hello Ghost Rentals!\n\nI'm interested in booking your Chauffeur Services\n\nCould you please help me with:\n - Is the pricing based on the number of hours or the kilometers driven?\n - What's included in the services?\n - Cars available for my dates?\n\nThank you!`;
      const encodedMsg = encodeURIComponent(message);
      const phoneNumber = "97180044678"; // With country code, no "+" or "-"
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
  }
}
