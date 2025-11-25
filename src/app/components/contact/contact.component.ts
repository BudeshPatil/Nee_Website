import { Component, OnInit, ElementRef, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
// Services
import { ContactService } from '../../providers/contact/contact.service';
import { PageService } from '../../providers/page/page.service';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { isPlatformBrowser } from '@angular/common';
import * as AOS from 'aos';
export { };
declare global {
	interface Window {
		Calendly: any;
	}
}
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  imageURL: string = `${environment.url}/assets`;
  @ViewChild('calendly') calendlySection!: ElementRef;
	addcontactForm: FormGroup;
	submitted: boolean = false;
	msg_success: boolean = false;
	msg_danger: boolean = false;
	throw_msg: any;
	url = 'https://calendly.com/tinaz-miniaar/30min';
	prod:any;
	isvalidSubmit: boolean = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.India,CountryISO.UnitedStates, CountryISO.UnitedKingdom,CountryISO.UnitedArabEmirates];
	separateDialCode = false;
	baseUrl:any;
	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private metaTagService: Meta,
		private titleService: Title,
		private contactservice: ContactService,
		private pageservice: PageService,
		 @Inject(PLATFORM_ID) private platformId: Object
	) {
		this.addcontactForm = this.formBuilder.group({
			name: ['', Validators.required],
      lastname: ['', Validators.required],
			email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
			phone: ['', Validators.required],
			message: [''],
		});
		this.get_PageMeta();
		this.prod = this.route.snapshot.params['prod'];
		this.baseUrl = environment.url;

	}

	public hasError = (controlName: string, errorName: string) => {
		return this.addcontactForm.controls[controlName].hasError(errorName);
	};

	public hasEmailError = (controlName: string, errorName: string) => {
    if (this.addcontactForm.controls['email'].value == "") {
      return "Email is required";
    } else if (this.addcontactForm.controls['email'].status == "INVALID") {
      return "Invalid Email";
    } else {
      return this.addcontactForm.controls['email'].hasError(errorName);
    }
  };

	public hasPhoneNumberError = (controlName: string,errorName: string) => {
		if (this.addcontactForm.controls['phone'].value == "") {
			return "Phone Number is required";
		} else if (this.addcontactForm.controls['phone'].status == "INVALID") {
			return "Invalid Phone Number";
		} else {
			return this.addcontactForm.controls['phone'].hasError(errorName);
		}
	};

	ngOnInit(): void {
		// window.Calendly.initInlineWidget({
		// 	url: this.url,
		// 	parentElement: document.querySelector('.calendly-inline-widget'),
		// 	prefill: {}
		// });

	}

	get_PageMeta() {
		let obj = { pageName: 'contact' };
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

	onSubmit() {
		this.submitted = true;
		let obj = this.addcontactForm.value;
		if(this.prod){
			obj['product'] = this.prod;
		}
		if (this.addcontactForm.invalid) {
			return;
		}
		if(this.isvalidSubmit == false){
			return
		}
		obj['phone'] = obj.phone.internationalNumber;
		this.contactservice.addContact(obj).subscribe(
			(response) => {
				if (response.code == 200) {
					this.throw_msg = response.message;
					this.msg_success = true;
					this.submitted = true;
					setTimeout(() => {
						this.submitted = false;
						this.addcontactForm.reset();
						this.isvalidSubmit = true;
					}, 5000);
				}
				else if (response.code == 400) {
					this.throw_msg = response.message;
					this.addcontactForm.reset();
					this.msg_danger = true;
				}
			},
		);

	}
	ngAfterViewInit() {
		// if (isPlatformBrowser(this.platformId)) {
		// 	AOS.init({
		// 	  once: true,
		// 	  mirror: true,
		// 	  easing: 'ease',
		// 	});
		// }
    this.route.fragment.subscribe((fragment) => {
      setTimeout(() => {
        if (fragment === 'calendly') {
          this.calendlySection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
			}, 500); // Wait for sections to be ready
    });
		const el = document.querySelector('.iti__selected-flag.dropdown-toggle');
  el?.setAttribute('role', 'button');
  el?.setAttribute('tabindex', '0');
  }

	sendWhatsppMsg() {
			this.submitted = true;
			let obj = this.addcontactForm.value;
			if (this.addcontactForm.invalid) {
				return;
			}
			if(this.isvalidSubmit == false){
				return
			}
      const message = `Hello Ghost Rentals Team!\n\nI hope this message finds you well. I am sending this new service inquiry through your Contact Us form from your website, and I wanted your immediate attention.\n\nHere are the details:\nName : ${obj.name} ${obj.lastname}\nEmail : ${obj.email}\nPhone : ${obj.phone.internationalNumber}${!obj.message?'':'\nMessage : '+obj.message}\n\nPlease take a moment to review the service information provided and respond at your earliest convenience. If there is any follow-up required, kindly coordinate.\n\nThank you!`;
      const encodedMsg = encodeURIComponent(message);
      const phoneNumber = "97180044678"; // With country code, no "+" or "-"
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
  }
}
