import { Component, HostListener, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment';
import { Swiper } from 'swiper';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { DataService } from '../../providers/data/data.service';
import { isPlatformBrowser } from '@angular/common';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { ContactService } from '../../providers/contact/contact.service';
import { PageService } from '../../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

Swiper.use([Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private carSwiper: Swiper | null = null;
  private yachtSwiper: Swiper | null = null;

  private trendingSwiper: Swiper | null = null;
  bannerData: any;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;
  cartypeData: any = [];
  brandsData: any = [];
  isCar: boolean = true;
  maxDate: string;
  reservationForm!: FormGroup;
  isVehicleYacht = false;
  ourCarCollections: any = [];
  ourYachtsCollections: any = [];
  trendingRentalCars: any = [];
  vehicleData: any = [];
  vehicletype: any = "Car";
  listBodytype: any = [];
  filteredBodytype: any = [];
  listModels: any = [];
  filteredModels: any = [];
  listBrands: any = [];
  filteredBrands: any = [];
  selectedbodytype: any;
  selectedbrand: any;
  selelctedmodel: any;
  locationData: any = [];
  pickupLocations: any = [];
  dropLocations: any = [];
  showPopup: boolean = false;
  throw_msg: any;
  addcontactForm: FormGroup;
  submitted: boolean = false;
  msg_success: boolean = false;
  msg_danger: boolean = false;
  prod: any;
  isvalidSubmit: boolean = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  separateDialCode = false;
  isReservationFilled = true;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.UnitedArabEmirates];
  isPopupOpen: boolean = false;
  isHovered = false;
  featuresList: any = [];
  filteredFeatures: any = [];
  YachtSizes = ['Up To 30 ft', '31-49 ft', '50-69 ft', '70-99 ft', '100-149 ft', '> 150 ft'];
  YachtSeats = ['8', '10', '12', '20', '25', '40', '100'];
  YachtHours = ['4', '8', '12', '16', '24'];
  @ViewChild('trendingCarsCarousel', { static: false }) carousel!: ElementRef;
  selectedYachtSize: any;
  selectedYachtSeats: any;
  selectedYachtHours: any;
  selectedYachtAddOns: any = [];
  selectedAddons: Array<{ url_key: string, name: string }> = [];
  isDropdownOpen = false;



  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });



  onDateChange(event: any) {
    // This method is triggered when the date input changes
    // The [(ngModel)] will automatically update selectedStartDate
  }
  // Form data structure
  formData = {
    type: '',
    brand: '',
    pickupDate: new Date(),
    pickupTime: new Date(),
    pickupLocation: '',
    dropDate: new Date(),
    dropTime: new Date(),
    dropLocation: '',
    addOns: ''
  };

  features = [
    {
      image: 'images/icons/hire-luxury-cars-from-ghost-rentals-dubai.webp',
      title: 'Premium Cars for Rent in Dubai',
      alt: 'Premium Cars',
      description: 'Premium Cars and Yacht rentals suitable for family use.',
    },
    {
      image: 'images/icons/trusted-car-rental-services-from-ghost-rentals.webp',
      title: 'Top Rated Car Rental Service in Dubai',
      alt: 'Top Rental Service Provider',
      description: 'Building lasting relationships through exceptional service.',
    },
    {
      image: 'images/icons/247-white.svg',
      title: '24/7 Cars Available for Rent in Dubai',
      alt: '24/7 Rental Services',
      description: 'Instant booking with 24/7 service assistance.',
    },
    {
      image: 'images/icons/map-white.svg',
      title: 'Premium Car Rental Services Available Throughout the UAE',
      alt: 'Car Rental Services Available Across UAE',
      description: 'Enjoy seamless doorstep delivery across the UAE.',
    }
  ];
  constructor(
    private elementRef: ElementRef,
    private formBuilder: FormBuilder,
    private dataservice: DataService,
    public router: Router,
    private contactservice: ContactService,
    public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.generateCalendar();
    this.generateEndCalendar();
    this.addcontactForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      phone: ['', Validators.required],
      message: ['', Validators.required],
    });
    // const todayDate = new Date();
    // this.today = todayDate.toISOString().split('T')[0];
    // const futureDate = new Date(todayDate.setFullYear(todayDate.getFullYear() + 1));
    // this.maxDate = futureDate.toISOString().split('T')[0];
    // this.pickuptoday = this.today;
    // this.dropofftoday = this.today;
    // this.get_PageMeta();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.minDate = `${yyyy}-${mm}-${dd}`;
    // this.pickuptoday = this.minDate;
    // this.dropofftoday = this.minDate;
  }

  ngOnInit() {
    this.initForm();
    this.getBannerData();
    this.getCarTypes();
    this.getCarData();
    this.getYachtsData();
    this.getBodyTypes();
    this.getModels();
    this.getBrands();
    this.getFeatures();
    this.getLocations();
    this.initYachtSwiper();
    this.initTrendingSwiper();
    this.initCarSwiper();
    this.initializeTimePicker();
  }

  get_PageMeta() {
    let obj = { pageName: 'home' };
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

  ngAfterViewInit() {

    // Initialize Bootstrap Carousel
    if (isPlatformBrowser(this.platformId) && (window as any).bootstrap) {
      const carouselEl = document.getElementById('trendingCarsCarousel');
      if (carouselEl) {
        this.carouselInstance = new (window as any).bootstrap.Carousel(carouselEl, {
          interval: false,
          touch: true
        });
      }
    }
  }
  onSubmit() {
    this.submitted = true;
    let tempData = {};
    if (this.vehicletype) {
      tempData['Vehicle'] = this.vehicletype;
    }
    if (this.selectedbrand) {
      tempData['Brand'] = this.selectedbrand;
    }
    if (this.selectedbodytype) {
      tempData['Type'] = this.selectedbodytype;
    }
    if (this.selelctedmodel) {
      tempData['Model'] = this.selelctedmodel;
    }
    if (this.selectedpickaddress) {
      tempData['Pickup Address'] = this.selectedpickaddress;
    }
    if (this.selecteddropaddress) {
      tempData['Drop Address'] = this.selecteddropaddress;
    }
    if (this.selectedStartDate) {
      tempData['Pickup Date'] = this.selectedStartDate;
    }
    if (this.selectedStartTime) {
      tempData['Pick Time'] = this.selectedStartTime;
    }
    if (this.selectedEndDate) {
      tempData['Drop Date'] = this.selectedEndDate;
    }
    if (this.selectedEndTime) {
      tempData['Drop Time'] = this.selectedEndTime;
    }
    if (this.selectedYachtSize) {
      tempData['Size'] = this.vehicletype;
    }
    if (this.selectedYachtSeats) {
      tempData['Seats'] = this.selectedYachtSeats;
    }
    if (this.selectedYachtHours) {
      tempData['Hours'] = this.selectedYachtHours;
    }
    if (this.selectedYachtAddOns && this.selectedYachtAddOns.length > 0) {
      let tempspl = [];
      this.selectedYachtAddOns.forEach((spladds) => {
        tempspl.push(spladds.name)
      });
      tempData['Special Add-ons'] = tempspl;
    }
    let obj = this.addcontactForm.value;
    if (this.prod) {
      obj['product'] = this.prod;
    }
    if (tempData) {
      obj['seacrh_data'] = tempData;
    }
    if (this.addcontactForm.invalid) {
      return;
    }
    if (this.isvalidSubmit == false) {
      return
    }
    obj['phone'] = obj.phone.internationalNumber;
    this.contactservice.addQuickSearch(obj).subscribe(
      (response) => {
        if (response.code == 200) {
          this.throw_msg = response.message;
          this.msg_success = true;
          this.submitted = true;
          setTimeout(() => {
            // this.sendContactEmial(obj);
            this.submitted = false;
            this.addcontactForm.reset();
            this.isvalidSubmit = true;
            window.location.reload();
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

  sendContactEmial(data) {
    let obj = data;
    if (!data) {
      return;
    }
    this.contactservice.addContact(obj).subscribe(
      (response) => {
        if (response.code == 200) {
          this.throw_msg = response.message;
          this.msg_success = true;
        }
        else if (response.code == 400) {
          this.throw_msg = response.message;
          this.msg_danger = true;
        }
      },
    );
  }

  private carouselInstance: any;

  prevSlide() {
    if (this.carouselInstance) {
      this.carouselInstance.prev();
    } else {
      // Fallback to jQuery if needed
      const carouselEl = document.getElementById('trendingCarsCarousel');
      if (carouselEl) {
        const bsCarousel = (window as any).bootstrap.Carousel.getInstance(carouselEl);
        if (bsCarousel) {
          bsCarousel.prev();
        }
      }
    }
  }

  nextSlide() {
    if (this.carouselInstance) {
      this.carouselInstance.next();
    } else {
      // Fallback to jQuery if needed
      const carouselEl = document.getElementById('trendingCarsCarousel');
      if (carouselEl) {
        const bsCarousel = (window as any).bootstrap.Carousel.getInstance(carouselEl);
        if (bsCarousel) {
          bsCarousel.next();
        }
      }
    }
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

  public hasPhoneNumberError = (controlName: string, errorName: string) => {
    if (this.addcontactForm.controls['phone'].value == "") {
      return "Phone Number is required";
    } else if (this.addcontactForm.controls['phone'].status == "INVALID") {
      return "Invalid Phone Number";
    } else {
      return this.addcontactForm.controls['phone'].hasError(errorName);
    }
  };

  openPopup() {
    let isValid = true;
    if (this.vehicletype == 'Car' && !this.selectedpickaddress) {
      isValid = false;
    }
    if (this.vehicletype == 'Car' && !this.selecteddropaddress) {
      isValid = false;
    }
    if (this.vehicletype == 'Car' && !this.selectedbrand) {
      isValid = false;
    }
    if (this.vehicletype == 'Car' && !this.selectedbodytype) {
      isValid = false;
    }
    if (this.vehicletype == 'Yachts' && !this.selectedbodytype) {
      isValid = false;
    }
    if (this.vehicletype == 'Yachts' && !this.selectedYachtSize) {
      isValid = false;
    }
    if (this.vehicletype == 'Yachts' && !this.selectedYachtSeats) {
      isValid = false;
    }
    if (this.vehicletype == 'Yachts' && !this.selectedYachtHours) {
      isValid = false;
    }
    if (!this.selectedStartDate) {
      isValid = false;
    }
    if (this.vehicletype == 'Car' && !this.selectedEndDate) {
      isValid = false;
    }
    if (!isValid) {
      this.isReservationFilled = false;
      return;
    }
    if (this.selectedStartDate) {
      const today = new Date(this.selectedStartDate);
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.selectedStartDate = `${yyyy}-${mm}-${dd}`;
    }
    if (this.selectedEndDate) {
      const today = new Date(this.selectedEndDate);
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.selectedEndDate = `${yyyy}-${mm}-${dd}`;
    }
    // this.showPopup = true;
    // this.isReservationFilled = true;
    // if (isPlatformBrowser(this.platformId)) {
    //   // Store the current scroll position
    //   const scrollY = window.scrollY;
    //   // Add class to body to prevent scrolling
    //   document.body.style.position = 'fixed';
    //   document.body.style.top = `-${scrollY}px`;
    //   document.body.style.width = '100%';
    //   document.body.style.overflow = 'hidden';
    // }
    let tempspl = [];
    let tempvar: any = '';
    if (this.selectedAddons && this.selectedAddons.length > 0) {
      this.selectedAddons.forEach((spladds, index) => {
        tempspl.push(index + '. ' + spladds.name + '\n');
        index = index + 1;
        tempvar += index + '. ' + spladds.name + '\n';
      });
    }
    setTimeout(() => {
      window.location.reload();
    }, 2000)
    let tempspladdons
    if (tempspl && tempspl.length > 0) {
      tempspladdons = JSON.stringify(tempspl).replace(/"/g, '');
    }
    if (this.vehicletype == 'Car') {
      const message = `Hello Ghost Rentals!\n\nI'm interested in booking through your website and would like assistance with:\n\nVehicle: ${this.vehicletype}\nType: ${this.selectedbodytype}\nBrand: ${this.selectedbrand}\nPickup Address: ${this.selectedpickaddress}\nDrop Address: ${this.selecteddropaddress}\nPickup Date: ${this.selectedStartDate} ${!this.selectedStartTime ? '' : this.selectedStartTime}\nDrop Date: ${this.selectedEndDate} ${!this.selectedEndTime ? '' : this.selectedEndTime}\n${!tempspladdons ? '' : 'Special Add-ons: \n' + tempvar}\nThank you!`;
      const encodedMsg = encodeURIComponent(message);
      const phoneNumber = "97180044678"; // With country code, no "+" or "-"
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    } else {
      const message = `Hello Ghost Rentals!\n\nI'm interested in booking through your website and would like assistance with:\n\nVehicle: ${this.vehicletype}\nType: ${this.selectedbodytype}\nSize: ${this.selectedYachtSize}\nPax: ${this.selectedYachtSeats}\nHours: ${this.selectedYachtHours}\nPickup Date: ${this.selectedStartDate} ${!this.selectedStartTime ? '' : this.selectedStartTime}\n${!tempspladdons ? '' : 'Special Add-ons: \n' + tempvar}\nThank you!`;
      const encodedMsg = encodeURIComponent(message);
      const phoneNumber = "97180044678"; // With country code, no "+" or "-"
      const waUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;
      window.open(waUrl, '_blank');
    }

  }

  closePopup(event: MouseEvent) {
    event?.preventDefault();
    event?.stopPropagation();
    this.showPopup = false;
    if (isPlatformBrowser(this.platformId)) {
      // Restore the scroll position and reset styles
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }


  public initCarSwiper() {
    if (this.carSwiper) {
      this.carSwiper.destroy(true, true);
    }
    if (isPlatformBrowser(this.platformId)) {
      const swiper = new Swiper('.car-collection-swiper', {
        loop: true,
        modules: [Navigation, Pagination, Autoplay],
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: '.car-swiper-button-next',
          prevEl: '.car-swiper-button-prev',
        },
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        slidesPerView: 'auto', // This allows slides to size naturally
        centeredSlides: false, // Ensure slides are not centered
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          430: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          575: {
            slidesPerView: 1,
            spaceBetween: 15
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20
          },
          992: {
            slidesPerView: 3.5,
            spaceBetween: 15
          },
          1281: {
            slidesPerView: 4.5,
            spaceBetween: 20
          },
          1400: {
            slidesPerView: 4.5,
            spaceBetween: 20
          },
          1921: {
            slidesPerView: 5.5,
            spaceBetween: 20
          }
        },
      });
    }
  }
  public initYachtSwiper() {
    if (this.yachtSwiper) {
      this.yachtSwiper.destroy(true, true);
    }
    if (isPlatformBrowser(this.platformId)) {
      const swiper = new Swiper('.yacht-collection-swiper', {
        loop: true,
        modules: [Navigation, Pagination, Autoplay],
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: '.yacht-swiper-button-next',
          prevEl: '.yacht-swiper-button-prev',
        },
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          430: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          575: {
            slidesPerView: 1,
            spaceBetween: 15
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 20
          },
          992: {
            slidesPerView: 3.5,
            spaceBetween: 15
          },
          1281: {
            slidesPerView: 4.5,
            spaceBetween: 20
          },
          1400: {
            slidesPerView: 4.5,
            spaceBetween: 20
          },
          1921: {
            slidesPerView: 5.5,
            spaceBetween: 20
          }
        },
      });
    }
  }

  public initTrendingSwiper() {
    if (this.trendingSwiper) {
      this.trendingSwiper.destroy(true, true);
    }
    if (isPlatformBrowser(this.platformId)) {
      this.trendingSwiper = new Swiper('.trending-cars-swiper', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        modules: [Navigation, Pagination, Autoplay],
        loop: true,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        centeredSlides: false,
        breakpoints: {
          0: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          481: {
            slidesPerView: 1,
            spaceBetween: 10
          },
          575: {
            slidesPerView: 1.5,
            spaceBetween: 15
          },
          790: {
            slidesPerView: 2.5,
            spaceBetween: 20
          },
        },
        navigation: false,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
        },
      });
    }
  }

  ngOnDestroy() {
    // Clean up Swiper instances
    if (this.carSwiper) {
      this.carSwiper?.destroy(true, true);
      this.carSwiper = null;
    }
    if (this.yachtSwiper) {
      this.yachtSwiper?.destroy(true, true);
      this.yachtSwiper = null;
    }
    if (this.trendingSwiper) {
      this.trendingSwiper?.destroy(true, true);
      this.trendingSwiper = null;
    }

    // Clean up popup state if still open
    this.showPopup = false;

    // Only access document in browser environment
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('popup-open');
    }
  }

  initForm() {
    this.reservationForm = this.formBuilder.group({
      vehicleType: ['Car'],
      type: [''],
      model: [''],
      pickupDate: [''],
      pickupTime: [''],
      pickupLocation: [''],
      returnDate: [''],
      returnTime: [''],
      returnLocation: [''],
      departureDate: [''],
      departureTime: [''],
      departureMarina: [''],
      returnMarina: ['']
    });
  }

  getCarCategoriesImageUrl(car: { image: string }): string {
    return `${this.imageURL}/${car.image}`;
  }

  toggleVehicle() {
    this.selectedYachtAddOns = [];
    this.selectedAddons = [];

    // Reset time inputs to placeholders
    this.selectedStartTime = '';
    this.selectedEndTime = '';
    this.selectedHour = '';
    this.selectedMinute = '';
    this.selectedEndHour = '';
    this.selectedEndMinute = '';
    this.selectedStartDate = '';
    this.selectedEndDate = '';
    this.selectedpickaddress = '';
    this.selecteddropaddress = '';
    this.selectedYachtSize = '';
    this.selectedYachtSeats = '';
    this.selectedYachtHours = '';
    this.selectedbrand = '';
    this.selectedbodytype = '';

    this.isReservationFilled = true;


    // Reset dropdown states
    this.isDropdownOpen = false;
    this.showStartTimePicker = false;
    this.showEndTimePicker = false;
    this.showCalendar = false;
    this.showEndCalendar = false;


    this.isVehicleYacht = !this.isVehicleYacht;
    if (!this.isVehicleYacht) {
      this.vehicletype = "Car";
    } else {
      this.vehicletype = "Yachts";
    }

    if (this.listBodytype && this.listBodytype.length > 0) {
      this.filteredBodytype = this.listBodytype.filter((bodytype) => bodytype.type == this.vehicletype);
    }
    if (this.listModels && this.listModels.length > 0) {
      this.filteredModels = this.listModels.filter((model) => model.type == this.vehicletype);
    }
    if (this.listBrands && this.listBrands.length > 0) {
      this.filteredBrands = this.listBrands.filter((brand) => brand.type == this.vehicletype);
    }
    if (this.featuresList && this.featuresList.length > 0) {
      this.filteredFeatures = this.featuresList.filter((feature) => feature.vehicle_type == this.vehicletype);
    }
  }

  selectData(type, event) {
    if (type == 'body_type') {
      this.selectedbodytype = event.target.value;
    } else if (type == 'brand') {
      this.selectedbrand = event.target.value;
      this.selectedbodytype = '';
      let tempBrand = this.filteredBrands.filter(
        (item) => item.name === this.selectedbrand
      );
      if (tempBrand && tempBrand.length > 0) {
        this.filteredBodytype = tempBrand[0].bodytype_data;
      }
    } else if (type == 'model') {
      this.selelctedmodel = event.target.value;
    } else if (type == 'feature') {
      this.selectedYachtAddOns.push(event.target.value);
    } else if (type == 'size') {
      this.selectedYachtSize = event.target.value;
    } else if (type == 'seats') {
      this.selectedYachtSeats = event.target.value;
    } else if (type == 'hours') {
      this.selectedYachtHours = event.target.value;
    }
  }

  goToResults() {
    this.router.navigate(['/booking'], {
      queryParams: {
        vehicle: this.vehicletype,
        body_type: this.selectedbodytype,
        brand: this.selectedbrand,
        model: this.selelctedmodel,
        startDate: this.mergeDateTime(this.selectedStartTime, this.selectedStartDate),
        endDate: this.mergeDateTime(this.selectedEndTime, this.selectedEndDate),
        pick_address: this.selectedpickaddress,
        drop_address: this.selecteddropaddress
      }
    });
  }

  mergeDateTime(time, date): any {
    if (time && date) {
      const [hours, minutes] = time.split(':').map(Number);
      const dateObj = new Date(date);
      dateObj.setHours(hours);
      dateObj.setMinutes(minutes);
      dateObj.setSeconds(0);
      dateObj.setMilliseconds(0);
      return dateObj;
    }
  }


  getBannerData() {
    let obj = {};
    this.dataservice.getAllBanner(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          response.result.forEach(banner => {
            if (banner && banner.page == 'home') {
              this.bannerData = banner;
            }
          });
        }
      }
    });
  }

  getCarTypes() {
    let obj = {};
    this.dataservice.getCarTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.cartypeData = response.result;
        }
      }
    });
  }

  getCarData() {
    let obj = {
      limit: 10,
      page: 1,
      availabilityStatus: 'available',
      vehicle_type: "Car",
      home_vehicle: true
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result;
          let index = 0;
          if (this.vehicleData && this.vehicleData.length > 0) {
            this.vehicleData.forEach((vehicle, i) => {
              if (vehicle && vehicle.home_vehicle) {
                this.ourCarCollections.push(vehicle);
              }
              if (vehicle && vehicle.featured_vehicle && index < 6) {
                index = index + 1
                this.trendingRentalCars.push(vehicle);
              }
            });
          }
        }
        setTimeout(() => this.initCarSwiper(), 0);
      }
    });
  }

  getYachtsData() {
    let obj = {
      limit: 10,
      page: 1,
      availabilityStatus: 'available',
      vehicle_type: "Yachts",
      home_vehicle: true
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.ourYachtsCollections = response.result;
        }
        setTimeout(() => this.initYachtSwiper(), 0);
      }
    });
  }

  getBodyTypes() {
    let obj = {};
    this.dataservice.getAllBodyTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listBodytype = response.result;
          if (this.listBodytype && this.listBodytype.length > 0) {
            this.filteredBodytype = this.listBodytype.filter((bodytype) => bodytype.type == this.vehicletype);
          }
        }
      }
    });
  }

  getModels() {
    let obj = {};
    this.dataservice.getAllModels(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listModels = response.result;
          if (this.listModels && this.listModels.length > 0) {
            this.filteredModels = this.listModels.filter((model) => model.type == this.vehicletype);
          }
        }
      }
    });
  }

  getBrands() {
    let obj = {};
    this.dataservice.getBrands(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listBrands = response.result;
          if (this.listBrands && this.listBrands.length > 0) {
            this.filteredBrands = this.listBrands.filter((model) => model.type == this.vehicletype);
          }
        }
      }
    });
  }

  getLocations() {
    let obj = {};
    this.dataservice.getAllLocations(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.locationData = response.result;
          this.pickupLocations = this.locationData;
          this.dropLocations = this.locationData;
        }
      }
    });
  }

  getFeatures() {
    let obj = {};
    this.dataservice.getSpecialAddons(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.featuresList = response.result;
          if (this.featuresList && this.featuresList.length > 0) {
            this.filteredFeatures = this.featuresList.filter((feature) => feature.vehicle_type == this.vehicletype);
          }
        }
      }
    });
  }

  onSelectPickupLocation(loc) {
    if (loc && loc.target.value) {
      this.selectedpickaddress = loc.target.value;
      let tempLoc = this.locationData.filter((location) => location.name != loc.target.value);
      if (tempLoc.length > 0) {
        this.dropLocations = tempLoc
      }
    }
  }

  onSelectDropLocation(loc) {
    if (loc && loc.target.value) {
      this.selecteddropaddress = loc.target.value;
      let tempLoc = this.locationData.filter((location) => location.name != loc.target.value);
      if (tempLoc.length > 0) {
        this.pickupLocations = tempLoc
      }
    }
  }

  // onSelectPickupDate() {
  //   if (this.selectedStartDate) {
  //     const today = new Date(this.selectedStartDate);
  //     const yyyy = today.getFullYear();
  //     const mm = String(today.getMonth() + 1).padStart(2, '0');
  //     const dd = String(today.getDate()).padStart(2, '0');
  //     this.minDate = `${yyyy}-${mm}-${dd}`;
  //     this.dropofftoday = this.minDate;
  //   }
  // }

  // onSelectDropDate() {
  //   if (!this.selectedStartDate) {
  //     this.Toast.fire({
  //       title: 'Please select pickup date first!',
  //       icon: 'warning',
  //     });
  //     this.selectedEndDate = '';
  //   }
  // }



  toggleMenu(event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    this.isPopupOpen = !this.isPopupOpen;

    if (this.isPopupOpen) {
    } else {
      this.closeMenu();
    }

  }

  closeMenu(): void {
    this.isPopupOpen = false;
    const menuItems = document.querySelectorAll<HTMLElement>('.mobile-menu .nav li');
    menuItems.forEach((item) => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
    });
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    const target = event.target as HTMLElement;
    const menuButton = document.querySelector('.navbar-toggler');
    const menu = document.querySelector('.mobile-menu');

    if (this.isPopupOpen &&
      !target.closest('.mobile-menu') &&
      !target.closest('.navbar-toggler')) {
      this.toggleMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (window.innerWidth >= 768) {
      this.isPopupOpen = false;
    }
  }

  getAdditionalReq() {
    let obj = {};
    this.dataservice.getAllBodyTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listBodytype = response.result;
          if (this.listBodytype && this.listBodytype.length > 0) {
            this.filteredBodytype = this.listBodytype.filter((bodytype) => bodytype.type == this.vehicletype);
          }
        }
      }
    });
  }

  sendWhatsappmsg() {
    let obj = {};
    this.dataservice.sendWhatappMessage(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          let result = response.result;
        }
      }
    });
  }

  goToVehiclePage(type: string) {
    this.router.navigate(['/product/search'], { queryParams: { type } });
  }

  getFirstTwoWords(name: string): string {
    if (!name) return "";
    return name.split(' ').slice(0, 2).join(' ');
  }


  setIsHovered(isHovered: boolean) {
    this.isHovered = isHovered;
  }
  // getImagePath(): string {
  //   return `${this.whatsappURL}/whatsapp-${this.isHovered ? 'white' : 'green'}.svg`;
  // }


  // toggleAddonsDropdown(event?: Event): void {
  //   this.isDropdownOpen = !this.isDropdownOpen;
  // }

  toggleAddonsDropdown(event?: Event): void {
    event?.stopPropagation();
    event?.preventDefault();

    if (!this.isDropdownOpen) {
      this.closeAllPickers();
    }

    this.isDropdownOpen = !this.isDropdownOpen;
  }
  toggleSelection(addon: { url_key: string, name: string }, event: Event): void {
    event.stopPropagation();

    const updatedAddons = [...this.selectedAddons];
    const index = updatedAddons.findIndex(a => a.url_key === addon.url_key);

    if (index > -1) {
      updatedAddons.splice(index, 1);
    } else {
      updatedAddons.push({ ...addon });
    }

    this.selectedAddons = updatedAddons;
    if (event) {
      this.selectedYachtAddOns.push(event.target);
    }
  }

  isSelected(addon: { url_key: string, name: string }): boolean {
    return this.selectedAddons.some(a => a.url_key === addon.url_key);
  }

  getSelectedAddonsLabel(): string {
    if (!this.selectedAddons || this.selectedAddons.length === 0) {
      return 'Choose Add-ons*';
    } else if (this.selectedAddons.length === 1) {
      return this.selectedAddons[0].name;
    } else {
      return `${this.selectedAddons.length} Add-ons Selected`;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.isDropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }



  // today: string;
  // pickuptoday: string;
  // dropofftoday: string;

  // date functionality
  // selectedStartDate: Date | null = null;
  // selectedEndDate: Date | null = null;
  showEndCalendar = false;
  endMonth: Date = new Date();
  selectedStartDate: any;
  selectedEndDate: any;
  selectedpickaddress: any;
  selecteddropaddress: any;
  availableStartDate: any;
  showCalendar = false;
  currentMonth: Date = new Date();
  calendarDates: Date[] = [];
  endCalendarDates: Date[] = [];
  dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // time functionality
  minDate: any;
  hours: string[] = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"];
  minutes: string[] = ['00', '15', '30', '45'];
  selectedHour: string = '';
  selectedMinute: string = '';
  selectedEndHour: string = '';
  selectedEndMinute: string = '';
  showEndTimePicker = false;
  showAddOnsDropdown = false;
  isEndPM: boolean = false;
  showStartTimePicker: boolean = false;
  selectedStartTime: string = '';
  // selectedStartTime: any;
  selectedEndTime: string = '';
  // selectedStartTime: any;
  // selectedEndTime: any;
  isPM: boolean = false;
  displayHours: string[] = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  // Time picker state management
  private previousStartTime: { hour: string, minute: string } | null = null;
  private previousEndTime: { hour: string, minute: string } | null = null;


  generateCalendar() {
    const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    const dates: Date[] = [];

    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    while (start <= lastDay || start.getDay() !== 0) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    this.calendarDates = dates;
  }

  isBeforeToday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }
  isBeforePickupDate(date: Date): boolean {
    if (!this.selectedStartDate) return false;
    const pickup = new Date(this.selectedStartDate);
    pickup.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    return target < pickup;
  }

  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
    this.generateCalendar();
  }


  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.currentMonth.getMonth() &&
      date.getFullYear() === this.currentMonth.getFullYear()
    );
  }

  isCurrentEndMonth(date: Date): boolean {
    return (
      date.getMonth() === this.endMonth.getMonth() &&
      date.getFullYear() === this.endMonth.getFullYear()
    );
  }

  selectDate(date: Date) {
    const newDate = new Date(date);
    this.selectedStartDate = newDate;
    this.showCalendar = false;

    // Check if the month or year has changed
    const prevMonth = this.selectedStartDate ? this.selectedStartDate.getMonth() : -1;
    const prevYear = this.selectedStartDate ? this.selectedStartDate.getFullYear() : -1;

    // Reset all time-related fields when pickup date changes
    this.selectedStartTime = '';
    this.selectedHour = '';
    this.selectedMinute = '';
    this.isPM = false;

    // Reset end date and time if month or year changes, or if the new pickup date is after the current drop date
    if (newDate.getMonth() !== prevMonth ||
      newDate.getFullYear() !== prevYear ||
      (this.selectedEndDate && newDate > this.selectedEndDate)) {
      this.selectedEndDate = null;
      this.selectedEndTime = '';
      this.selectedEndHour = '';
      this.selectedEndMinute = '';
      this.isEndPM = false;
    }

    // Update the form control if needed
    if (this.formData) {
      this.formData.pickupDate = this.selectedStartDate;
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isSelectedStartDate(date: Date): boolean {
    return (
      this.selectedStartDate &&
      date.getDate() === this.selectedStartDate.getDate() &&
      date.getMonth() === this.selectedStartDate.getMonth() &&
      date.getFullYear() === this.selectedStartDate.getFullYear()
    );
  }
  confirmTime() {
    if (!this.selectedHour && !this.selectedMinute) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please select both hour and minute'
      });
      return;
    }

    if (!this.selectedHour) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please select an hour'
      });
      return;
    }

    if (!this.selectedMinute) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please select minutes'
      });
      return;
    }

    this.selectedStartTime = `${this.selectedHour}:${this.selectedMinute}`;
    this.showStartTimePicker = false;

    this.previousStartTime = {
      hour: this.selectedHour,
      minute: this.selectedMinute,
    };
  }
  isPastTime(hour: string, minute: string): boolean {
    if (!this.selectedStartDate || !this.isToday(this.selectedStartDate)) return false;
    const now = new Date();
    const selectedTime = new Date(
      this.selectedStartDate.getFullYear(),
      this.selectedStartDate.getMonth(),
      this.selectedStartDate.getDate(),
      parseInt(hour, 10),
      parseInt(minute, 10)
    );
    return selectedTime < now;
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }


  isPastEndTime(hour: string, minute: string): boolean {
    if (!this.selectedEndDate) return false;

    const selectedHour = parseInt(hour, 10);
    const selectedMinute = parseInt(minute, 10);
    const selectedTime = new Date(this.selectedEndDate);
    selectedTime.setHours(selectedHour, selectedMinute, 0, 0);

    // If it's today, check if the time has passed
    if (this.isToday(this.selectedEndDate)) {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      if (selectedHour < currentHour) return true;
      if (selectedHour === currentHour && selectedMinute <= currentMinute) return true;
    }

    // If drop date = pickup date, ensure drop time > pickup time
    if (this.selectedStartDate && this.selectedStartTime && this.isSameDay(this.selectedStartDate, this.selectedEndDate)) {
      const [pickupHour, pickupMinute] = this.selectedStartTime.split(':').map(Number);

      // If same hour, check minutes
      if (selectedHour === pickupHour) {
        return selectedMinute <= pickupMinute;
      }

      // If selected hour is before pickup hour, it's invalid
      if (selectedHour < pickupHour) {
        return true;
      }
    }

    return false;
  }



  // selectHour(hour: string) {
  //   const hourNum = parseInt(hour, 10);
  //   this.selectedHour = hour;
  //   // this.selectedMinute = '00';
  // }
  onStartDateTimeChange() {
    // Reset end date/time if 'from' date or time changes
    this.resetEndDateTimeSelection();
  }
  resetEndDateTimeSelection() {
    // Reset only end
    this.selectedEndDate = null;
    this.selectedEndHour = '';
    this.selectedEndMinute = '';
    this.selectedEndTime = '';
  }
  selectHour(hour: string) {
    this.selectedHour = hour;
    if (this.selectedHour && this.selectedMinute) {
      this.selectedStartTime = `${this.selectedHour}:${this.selectedMinute}`;
      this.onStartDateTimeChange();
    }
  }


  selectMinute(minute: string) {
    if (!this.selectedHour) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please select an hour first'
      });
      return;
    }

    const hourNum = parseInt(this.selectedHour, 10);
    const minuteNum = parseInt(minute, 10);

    this.selectedMinute = minute;
  }

  selectEndHour(hour: string) {
    const hourNum = parseInt(hour, 10);

    // this.selectedEndMinute = '00';

    this.selectedEndHour = hour;
  }

  selectEndMinute(minute: string) {
    this.selectedEndMinute = minute;
  }


  // arrow rotation
  selectBrandOpen = false;
  selectBodyTypeOpen = false;
  selectYachtSizeOpen = false;
  selectYachtSeatsOpen = false;
  selectYachtHoursOpen = false;
  brandControl = new FormControl('', Validators.required);
  bodyTypeControl = new FormControl('', Validators.required);
  yachtSizeControl = new FormControl('', Validators.required);
  yachtSeatsControl = new FormControl('', Validators.required);
  yachtHoursControl = new FormControl('', Validators.required);
  toggleDropdown(type: 'brand' | 'bodytype' | 'size' | 'seats' | 'hours') {
    this.showCalendar = false;
    this.showEndCalendar = false;
    this.showStartTimePicker = false;
    this.showEndTimePicker = false;
    if (type === 'brand') {
      this.selectBrandOpen = !this.selectBrandOpen;
      this.selectBodyTypeOpen = false;
      this.selectYachtSizeOpen = false;
      this.selectYachtSeatsOpen = false;
      this.selectYachtHoursOpen = false;
    } else if (type === 'bodytype') {
      this.selectBrandOpen = false;
      this.selectBodyTypeOpen = !this.selectBodyTypeOpen;
      this.selectYachtSizeOpen = false;
      this.selectYachtSeatsOpen = false;
      this.selectYachtHoursOpen = false;
    } else if (type === 'size') {
      this.selectBrandOpen = false;
      this.selectBodyTypeOpen = false;
      this.selectYachtSizeOpen = !this.selectYachtSizeOpen;
      this.selectYachtSeatsOpen = false;
      this.selectYachtHoursOpen = false;
    } else if (type === 'seats') {
      this.selectBrandOpen = false;
      this.selectBodyTypeOpen = false;
      this.selectYachtSizeOpen = false;
      this.selectYachtSeatsOpen = !this.selectYachtSeatsOpen;
      this.selectYachtHoursOpen = false;
    } else if (type === 'hours') {
      this.selectBrandOpen = false;
      this.selectBodyTypeOpen = false;
      this.selectYachtSizeOpen = false;
      this.selectYachtSeatsOpen = false;
      this.selectYachtHoursOpen = !this.selectYachtHoursOpen;
    }
  }


  selectBrand(brand: any) {
    this.selectedbrand = brand.name;
    this.brandControl.setValue(brand.name);
    this.brandControl.markAsTouched();
    this.selectBrandOpen = false;
    this.selectBodyTypeOpen = false;

    this.selectData('brand', { target: { value: brand.name } });
    this.getCarData();
  }

  selectBodytype(bodytype: any) {
    this.selectedbodytype = bodytype.name;
    this.bodyTypeControl.setValue(bodytype.name);
    this.bodyTypeControl.markAsTouched();
    this.selectBrandOpen = false;
    this.selectBodyTypeOpen = false;

    this.selectData('body_type', { target: { value: bodytype.name } });
    this.getCarData();
  }

  selectYachtSize(size: string) {
    this.selectedYachtSize = size;
    this.yachtSizeControl.setValue(size);
    this.yachtSizeControl.markAsTouched();
    this.selectBrandOpen = false;
    this.selectBodyTypeOpen = false;
    this.selectYachtSizeOpen = false;
    this.selectYachtSeatsOpen = false;
    this.selectYachtHoursOpen = false;

    this.selectData('size', { target: { value: size } });
    this.getCarData();
  }

  selectYachtSeats(seats: string) {
    this.selectedYachtSeats = seats;
    this.yachtSeatsControl.setValue(seats);
    this.yachtSeatsControl.markAsTouched();
    this.selectBrandOpen = false;
    this.selectBodyTypeOpen = false;
    this.selectYachtSizeOpen = false;
    this.selectYachtSeatsOpen = false;
    this.selectYachtHoursOpen = false;

    this.selectData('seats', { target: { value: seats } });
    this.getCarData();
  }

  selectYachtHours(hours: string) {
    this.selectedYachtHours = hours;
    this.yachtHoursControl.setValue(hours);
    this.yachtHoursControl.markAsTouched();
    this.selectBrandOpen = false;
    this.selectBodyTypeOpen = false;
    this.selectYachtSizeOpen = false;
    this.selectYachtSeatsOpen = false;
    this.selectYachtHoursOpen = false;

    this.selectData('hours', { target: { value: hours } });
    this.getCarData();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const inStart = target.closest('.date-selector');
    const inEnd = target.closest('.end-date-selector');
    const inTime = target.closest('.time-selector');
    const inEndTime = target.closest('.end-time-selector');
    const inTimePicker = target.closest('.time-picker-dropdown');
    const inTimeInput = target.closest('.time-selector input');

    // Only close pickers if the click is outside all relevant elements
    if (!inStart) this.showCalendar = false;
    if (!inEnd) this.showEndCalendar = false;
    if (!inTime && !inTimePicker && !inTimeInput) this.showStartTimePicker = false;
    if (!inEndTime) this.showEndTimePicker = false;
    this.isDropdownOpen = false;
    const clickedInside = target.closest('.custom-dropdown') || target.closest('.dropdown-menu-custom');
    if (!clickedInside) {
      this.selectBrandOpen = false;
      this.selectBodyTypeOpen = false;
      this.selectYachtSizeOpen = false;
      this.selectYachtSeatsOpen = false;
      this.selectYachtHoursOpen = false;

    }
  }



  toggleCalendar(event?: MouseEvent) {
    event?.stopPropagation();
    this.closeAllPickers();
    this.showCalendar = !this.showCalendar;
  }

  toggleEndCalendar(event?: MouseEvent) {
    if (!this.selectedStartDate) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please select pickup date first'
      });
      return;
    }
    event?.stopPropagation();
    this.closeAllPickers();
    this.showEndCalendar = !this.showEndCalendar;
  }



  private initializeTimePicker() {
    // Set hours from 1 to 12
    this.displayHours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

    this.minutes = ['00', '15', '30', '45'];

    if (!this.selectedHour) {
      this.selectedHour = '12';
    }
    if (!this.selectedMinute) {
      this.selectedMinute = '00';
    }
    if (!this.selectedEndHour) {
      this.selectedEndHour = '12';
    }
    if (!this.selectedEndMinute) {
      this.selectedEndMinute = '00';
    }

    this.updateDisplayHours();
  }
  // private initializeTimePicker() {
  //   this.updateDisplayHours();
  //   const now = new Date();
  //   this.isPM = now.getHours() >= 12;
  //   this.selectedHour = String(now.getHours() % 12 || 12).padStart(2, '0');
  //   this.selectedMinute = String(now.getMinutes()).padStart(2, '0');
  //   // this.updateselectedStartTime();
  // }

  updateDisplayHours() {
    this.displayHours = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];

  }

  isSelectedHour(hour: string): boolean {
    return this.selectedHour === hour;
  }


  private closeAllPickers() {
    this.showCalendar = false;
    this.showEndCalendar = false;
    this.showStartTimePicker = false;
    this.showEndTimePicker = false;
    this.isDropdownOpen = false;
    this.selectBrandOpen = false;
    this.selectBodyTypeOpen = false;
    this.selectYachtSizeOpen = false;
    this.selectYachtSeatsOpen = false;
    this.selectYachtHoursOpen = false;
  }

  toggleStartTimePicker(event: MouseEvent) {
    if (!this.selectedStartDate) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please select pickup date first'
      });
      this.showStartTimePicker = false;
      return;
    }
    event.stopPropagation();
    this.closeAllPickers();
    this.showStartTimePicker = !this.showStartTimePicker;

    if (this.showStartTimePicker && !this.selectedStartTime) {
      const now = new Date();
      this.selectedHour = String(now.getHours()).padStart(2, '0');
    }

    if (this.showStartTimePicker) {
      this.showEndTimePicker = false;
      this.showCalendar = false;
      this.showEndCalendar = false;
    }
  }
  toggleEndTimePicker(event: MouseEvent) {
    if (!this.selectedEndDate) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please select return date first'
      });
      this.showEndTimePicker = false;
      return;
    }
    event.stopPropagation();
    this.closeAllPickers();
    this.showEndTimePicker = !this.showEndTimePicker;

    if (this.showEndTimePicker && !this.selectedEndTime) {
      const now = new Date();
      this.selectedEndHour = String(now.getHours()).padStart(2, '0');
    }

    if (this.showEndTimePicker) {
      this.showStartTimePicker = false;
      this.showCalendar = false;
      this.showEndCalendar = false;
    }
  }




  // cancelTimeSelection() {
  //   this.showStartTimePicker = false;
  //   this.showEndTimePicker = false;
  //   if (!this.selectedStartTime) {
  //     this.selectedHour = '';
  //     this.selectedMinute = '';
  //     this.isPM = false;
  //   } else {
  //     const [hours, minutes] = this.selectedStartTime.split(':');
  //     const hourNum = parseInt(hours, 10);
  //     this.isPM = hourNum >= 12;
  //     this.selectedHour = String(hourNum % 12 || 12).padStart(2, '0');
  //     this.selectedMinute = minutes;
  //   }
  // }

  // resetTimeSelection() {
  //   if (this.previousStartTime) {
  //     this.selectedHour = this.previousStartTime.hour;
  //     this.selectedMinute = this.previousStartTime.minute;
  //     this.isPM = this.previousStartTime.isPM;
  //   } else {
  //     this.selectedHour = '';
  //     this.selectedMinute = '';
  //   }
  //   this.showStartTimePicker = false;
  // }
  resetTimeSelection() {
    this.selectedHour = '';
    this.selectedMinute = '';
    this.selectedStartTime = '';
    this.showStartTimePicker = false;
  }


  validateDateTimeSelection() {
    if (!this.selectedStartDate || !this.selectedEndDate || !this.selectedStartTime || !this.selectedEndTime) return true;

    const start = new Date(this.selectedStartDate);
    const end = new Date(this.selectedEndDate);

    const [startHourStr, startMinStr] = this.selectedStartTime.split(':');
    const [endHourStr, endMinStr] = this.selectedEndTime.split(':');

    const startHour = parseInt(startHourStr, 10);
    const startMin = parseInt(startMinStr, 10);
    const endHour = parseInt(endHourStr, 10);
    const endMin = parseInt(endMinStr, 10);

    // Handle AM/PM conversion
    let startH = this.isPM && startHour < 12 ? startHour + 12 : startHour;
    if (!this.isPM && startHour === 12) startH = 0;

    let endH = this.isEndPM && endHour < 12 ? endHour + 12 : endHour;
    if (!this.isEndPM && endHour === 12) endH = 0;

    start.setHours(startH, startMin);
    end.setHours(endH, endMin);

    if (end < start) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Please select a valid end time after the start time'
      });
      return false;
    }
    return true;
  }





  resetEndTimeSelection() {
    this.selectedEndHour = '';
    this.selectedEndMinute = '';
    this.selectedEndTime = '';
    this.showEndTimePicker = false;
  }

  // confirmEndTime() {
  //   if (this.selectedEndHour && this.selectedEndMinute) {
  //     let hour = parseInt(this.selectedEndHour, 10);
  //     if (this.isEndPM && hour < 12) hour += 12;
  //     if (!this.isEndPM && hour === 12) hour = 0;

  //     this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute}`;
  //     this.showEndTimePicker = false;

  //     const time = new Date();
  //     time.setHours(hour, parseInt(this.selectedEndMinute, 10));

  //     if (this.formData) {
  //       this.formData.dropTime = time;
  //     }

  //     this.validateDateTimeSelection();
  //   }

  // }

  confirmEndTime() {
    if (!this.selectedEndHour && !this.selectedEndMinute) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please select both hour and minute'
      });
      return;
    }

    if (!this.selectedEndHour) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please select an hour'
      });
      return;
    }

    if (!this.selectedEndMinute) {
      this.Toast.fire({
        icon: 'error',
        title: 'Please select minutes'
      });
      return;
    }

    this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute}`;
    this.showEndTimePicker = false;

    this.previousEndTime = {
      hour: this.selectedEndHour,
      minute: this.selectedEndMinute,
    };

  }


  isSelectedEndHour(hour: string) {
    return this.selectedEndHour === hour;
  }



  // sfagags
  generateEndCalendar() {
    const firstDay = new Date(this.endMonth.getFullYear(), this.endMonth.getMonth(), 1);
    const lastDay = new Date(this.endMonth.getFullYear(), this.endMonth.getMonth() + 1, 0);
    const dates: Date[] = [];

    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - firstDay.getDay());

    while (start <= lastDay || start.getDay() !== 0) {
      dates.push(new Date(start));
      start.setDate(start.getDate() + 1);
    }

    this.endCalendarDates = dates;
  }

  nextEndMonth() {
    this.endMonth = new Date(
      this.endMonth.getFullYear(),
      this.endMonth.getMonth() + 1,
      1
    );
    this.generateEndCalendar();
  }

  prevEndMonth() {
    this.endMonth = new Date(
      this.endMonth.getFullYear(),
      this.endMonth.getMonth() - 1,
      1
    );
    this.generateEndCalendar();
  }

  isEndMonth(date: Date): boolean {
    return (
      date.getMonth() === this.endMonth.getMonth() &&
      date.getFullYear() === this.endMonth.getFullYear()
    );
  }

  isSelectedEndDate(date: Date): boolean {
    return (
      this.selectedEndDate &&
      date.getDate() === this.selectedEndDate.getDate() &&
      date.getMonth() === this.selectedEndDate.getMonth() &&
      date.getFullYear() === this.selectedEndDate.getFullYear()
    );
  }

  selectEndDate(date: Date) {
    const pickup = new Date(this.selectedStartDate);
    pickup.setHours(0, 0, 0, 0);

    const selected = new Date(date);
    selected.setHours(0, 0, 0, 0);



    this.selectedEndDate = selected;
    this.showEndCalendar = false;
    // Reset end time values when date changes
    this.selectedEndTime = '';
    this.selectedEndHour = '';
    this.selectedEndMinute = '';
    this.isEndPM = false;
  }

  isVisible = false; // controls opacity of mainsection
  onThumbnailClicked() {
    this.isVisible = true;
    localStorage.setItem('isVisible', 'true'); // remember for next page loads
  }
  onVideoClicked() {
    setTimeout(() => {
      this.isVisible = true;
    }, 3000);
    localStorage.setItem('isVisible', 'true');
  }
  isLoading = true;
  private isBrowser: boolean;

  onVideoEnded(): void {
    this.isLoading = false; // 👈 switches from loader to website
    if (this.isBrowser) {
      document.body.style.overflow = 'auto';
    }
  }



}
