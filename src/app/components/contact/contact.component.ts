import { Component, Inject, PLATFORM_ID, HostListener, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
// Services
import { ContactService } from '../../providers/contact/contact.service';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { isPlatformBrowser } from '@angular/common';
import { CategoryService } from '../../providers/category/category.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  addcontactForm: FormGroup;
  submitted: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  throw_msg: any;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India];
  service: any;
  isvalidSubmit: boolean = true;
  baseUrl: any;
  private isInitialized = false;


  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private metaTagService: Meta,
    private titleService: Title,
    private contactservice: ContactService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef,
    private eRef: ElementRef,

    // private pageservice: PageService,
  ) {
    this.getAllservices();
    this.baseUrl = environment.url;
    this.addcontactForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', Validators.required],
      subject: ['', Validators.required],
      message: [''],
    });
    // this.get_PageMeta();
    // this.service = this.route.snapshot.params['url_key'];

    // if (this.service) {
      // this.addcontactForm.patchValue({
      //   service: this.service
      // });
    // }
    setTimeout(() => {
      this.isInitialized = true;
    });
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      window.scrollTo(0, 0);
      this.route.paramMap.subscribe(params => {
        const serviceName = params.get('url_key');
        if (serviceName) {
          this.selectedService = serviceName;
          this.addcontactForm.get('service')?.setValue(serviceName);
        }
      });
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    // return this.addcontactForm.controls[controlName].hasError(errorName);
    const control = this.addcontactForm.get(controlName);
    return control?.hasError(errorName) && (control.dirty || control.touched || this.submitted);
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
  onSubmit() {

    this.submitted = true;
    let obj = this.addcontactForm.value;
    if (this.service) {
      obj['product'] = this.service;
    }
    if (this.addcontactForm.invalid) {
      return;
    }
    if (this.isvalidSubmit == false) {
      return
    }
    let internationalNumber = this.addcontactForm.get('phone')?.value;
    obj['phone'] = internationalNumber.internationalNumber;
    this.contactservice.addContact(obj).subscribe(
      (response) => {
        if (response.code == 200) {
          this.throw_msg = response.message;
          this.msg_success = true;
          // Hide msg_success after 5 seconds
          setTimeout(() => {
            this.msg_success = false;
          }, 5000);
          this.submitted = true;
          setTimeout(() => {
            this.submitted = false;
            this.addcontactForm.reset();
            this.isvalidSubmit = true;
            // Reset the dropdown display value
            this.selectedService = '';
            // Also close the dropdown
            this.dropdownOpen = false;
          }, 2000);
        }
        else if (response.code == 400) {
          this.throw_msg = response.message;
          this.addcontactForm.reset();
          this.msg_danger = true;
        }
      },
    );

  }
  // get_PageMeta() {
  // 	let obj = { pageName: 'contact' };
  // 	this.pageservice.getpageWithName(obj).subscribe(
  // 		(response) => {
  // 			if (response.body.code == 200 && response?.body.result) {
  // 				this.titleService.setTitle(response?.body.result.meta_title);
  // 				this.metaTagService.addTags([
  // 					{ name: 'description', content: response?.body.result.meta_description },
  // 					{ name: 'keywords', content: response?.body.result.meta_keywords },
  // 				]);
  // 			} else if (response.body.code == 400) {
  // 			}
  // 			else {

  // 			}

  // 		},
  // 	);
  // }

  dropdownOpen = false;
  servicesData: any = [];

  getAllservices() {
    let obj = {};
    this.categoryService.getAllCategory(obj).subscribe((response: any) => {
      if (response.code == 200) {
        if (response.result != null && response.result.length > 0) {
          this.servicesData = response.result;
        }
      }
    });
  }

  selectedService: string | null = null;

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectService(option: string, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.selectedService = option;
    this.addcontactForm.get('subject')?.setValue(option);
    this.dropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent) {
    if (!this.isInitialized) return;

    const target = event.target as HTMLElement;
    const dropdown = this.eRef.nativeElement.querySelector('.custom-dropdown');

    if (dropdown && !dropdown.contains(target) && this.dropdownOpen) {
      this.dropdownOpen = false;
      // Trigger change detection
      setTimeout(() => {
        this.cdr.detectChanges();
      });
    }
  }
}
