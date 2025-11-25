import { Component, ElementRef, HostListener, Inject, PLATFORM_ID, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../providers/data/data.service';
import { isPlatformBrowser } from '@angular/common';
import { Options } from '@angular-slider/ngx-slider';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PageService } from '../../../providers/page/page.service';
import { Meta, Title } from '@angular/platform-browser';

// const Toast = Swal.mixin({
//   toast: true,
//   position: 'top-end',
//   showConfirmButton: false,
//   timer: 3000,
//   timerProgressBar: true,
//   didOpen: (toast) => {
//     toast.onmouseenter = Swal.stopTimer;
//     toast.onmouseleave = Swal.resumeTimer;
//   }
// });


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;


  isMobileFilterVisible: boolean = false;
  isMobile: boolean = false;



  Math = Math;
  mobileFilterHeight: string = 'calc(100vh - 7.5rem)';
  isTablate: boolean = false;
  isFilterCollapsed: boolean = false;


  // Pagination properties
  currentLimit = 12;
  currentPage = 1;
  itemsPerPage = 12;
  totalItems = 0;
  private previousVehicleType: string; // Track previous vehicle type for pagination
  carTypes: any = [];
  vehicleData: any = [];
  pagedCars: any[] = [];
  totolvehicle = 0;
  cartypeData: any = [];
  bodyData: any = [];
  brandData: any = [];
  modelData: any = [];
  vehicleType: any = '';
  bodyTypeData: any = [];
  allBodyTypes: any[] = [];
  allBrands: any[] = [];
  selectedBodyTypeId: string = '';
  selectedBodytype: any = '';
  selectedBrand: any = '';
  selectedModel: any = '';
  selectedCartype: any = '';
  selectedLength: any = '';
  yachtLengthOptions: string[] = [];
  pickuptoday: string;
  dropofftoday: string;
  selectedRentalType: any;
  minPrice: any = 0;
  maxPrice: any = 20000;
  // price_type: any = 'dailyRate';
  filteredModel: any = [];
  price_type: any = '';
  availableStartDate: any;
  availableEndDate: any;
  vipNumberPlate: any = '';
  sort: any = '';
  // param_type: any;
  sliderVisible: any = false;
  value: number = 40;
  highValue: number = 20000;
  options: Options = {
    floor: 0,
    ceil: 20000,
  };

  // Date-Time Functionlity.
  showEndDateTimeDropdown = false;
  showDateTimeDropdown = false;
  today: string = '';
  showStartTimePicker = false;
  showCalendar = false;
  showEndCalendar = false;
  showEndTimePicker = false;
  showDateTimePicker = false;
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  selectedStartTime: string = '';
  selectedEndTime: string | null = null;
  selectedHour: string = '';
  selectedEndHour: string | null = null;
  selectedMinute: string = '';
  selectedEndMinute: string | null = null;
  displayHours: string[] = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23"];
  minutes: string[] = ['00', '15', '30', '45'];
  currentMonth: Date = new Date();
  calendarDates: Date[] = [];
  dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  private previousStartTime: { hour: string, minute: string } | null = null;
  private previousEndTime: { hour: string, minute: string } | null = null;
  endMonth: Date = new Date();
  endCalendarDates: Date[] = [];

  activeStartView: 'calendar' | 'time' = 'calendar';
  activeEndView: 'calendar' | 'time' = 'calendar';
  page:any = '';

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


  @ViewChild('minPriceInput') minPriceInput!: ElementRef;
  @ViewChild('maxPriceInput') maxPriceInput!: ElementRef;
  @ViewChild('rangeMin') rangeMin!: ElementRef;
  @ViewChild('rangeMax') rangeMax!: ElementRef;
  @ViewChild('filterContainer') filterRef!: ElementRef;
  @ViewChild('resultsSection') resultsRef!: ElementRef;
  @ViewChild('startDateTimePicker') startDateTimePicker: ElementRef;
  @ViewChild('endDateTimePicker') endDateTimePicker: ElementRef;


  constructor(
    private dataservice: DataService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    public pageservice: PageService,
    private metaTagService: Meta,
    private titleService: Title,
  ) {

  }


  private queryParamsToApply: Params | null = null;


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile = window.innerWidth <= 1199;
      this.isTablate = window.innerWidth <= 2561 && window.innerWidth >= 1200;
      this.isMobileFilterVisible = !this.isMobile;
      setTimeout(() => {
        this.sliderVisible = true;
      }, 200);
    }
    Promise.all([
      this.getBrands(),
      this.getCarTypes(),
      this.getModels(),
      this.getBodyTypes()
    ]).then(() => {
      this.route.queryParams.subscribe(params => {
        const type = params['type'];
        if (type) {
          this.vehicleType = type;
          if (this.isMobile) {
            this.SearchItems();
          } else {
            this.setVehicleType();
          }
        } else {
          this.processQueryParams(params);
        }
      });

      Promise.all([
        this.getBrands(),
        this.getCarTypes(),
        this.getModels(),
        this.getBodyTypes()
      ]).then(() => {
        // Now that data is ready, subscribe to queryParams
        this.route.queryParams.subscribe(params => {
          this.queryParamsToApply = params;
          this.processQueryParams(params);
        });
      });
    });
    this.page = 'search';
    // this.get_PageMeta();
    this.generateCalendar();
    this.generateEndCalendar();
    this.generateHours();
    // Set initial time to current time
    const now = new Date();
    this.selectedHour = String(now.getHours()).padStart(2, '0');
    this.selectedMinute = String(Math.floor(now.getMinutes() / 15) * 15).padStart(2, '0');
    this.selectedStartTime = `${this.selectedHour}:${this.selectedMinute}`;

    // Initialize end time to 1 hour after start time
    const endTime = new Date(now);
    endTime.setHours(now.getHours() + 1);
    this.selectedEndHour = String(endTime.getHours()).padStart(2, '0');
    this.selectedEndMinute = this.selectedMinute;
    this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute}`;
  }


  get_PageMeta() {
    let obj = { pageName: 'search' };
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




  toggleFilter(): void {
    this.isMobileFilterVisible = !this.isMobileFilterVisible;
  }

  // resetFilter() {
  //   this.vehicleType = '';
  //   this.carTypes = '';
  //   this.selectedBodytype = [];
  //   this.selectedBrand = [];
  //   this.selectedModel = [];
  //   this.selectedLength = '';
  //   // this.selectedRentalType = 'Daily';
  //   this.selectedStartDate = null;
  //   this.selectedEndDate = null;
  //   this.selectedRentalType = null;
  //   this.minPrice = 0;
  //   this.maxPrice = 150000;
  //   this.vipNumberPlate = '';
  //   this.sort = null;
  //   this.updateSlider();
  //   this.getCarData();
  // }
  // setVehicleType() {
  //   if (this.vehicleType === 'Car') {
  //     this.maxPrice = 10000;
  //     this.currentLimit = 12;
  //     this.currentPage = 1;
  //     this.itemsPerPage = 12;
  //     this.price_type = 'dailyRate';
  //   } else if (this.vehicleType === 'Yachts') {
  //     this.maxPrice = 20000;
  //     this.currentLimit = 12;
  //     this.currentPage = 1;
  //     this.itemsPerPage = 12;
  //     this.price_type = 'hourlyRate';
  //   }
  //   this.filterBodyTypesByVehicleType();
  //   this.selectedBodytype = [];
  //   this.selectedBrand = [];
  //   this.selectedModel = [];
  //   this.selectedStartDate = null;
  //   this.selectedEndDate = null;
  //   this.getCarData();
  // }


  // private processQueryParams(params: Params) {
  //   // Update component state from query params
  //   if (params['bodyType']) {
  //     this.selectedBodytype = [params['bodyType']];
  //   }
  //   if (params['brand']) {
  //     this.selectedBrand = [params['brand']];
  //     // Update filtered models based on selected brand
  //     if (this.modelData?.length) {
  //       this.filteredModel = this.modelData.filter(item => item.brand === params['brand']);
  //     }
  //   }
  //   if (params['model']) {
  //     this.selectedModel = [params['model']];
  //   }
  //   if (params['rentalType']) {
  //     this.selectedRentalType = params['rentalType'];
  //     this.changeRentalType({ target: { value: params['rentalType'] } });
  //   }
  //   if (params['minPrice']) {
  //     this.minPrice = +params['minPrice'];
  //   }
  //   if (params['maxPrice']) {
  //     this.maxPrice = +params['maxPrice'];
  //   }
  //   if (params['vip']) {
  //     this.vipNumberPlate = params['vip'] === 'true';
  //   }
  //   if (params['sort']) {
  //     this.sort = params['sort'];
  //   }

  //   // Fetch data after processing all params
  //   this.getCarData();
  // }

  formatDateTime(date: Date, hour: string, minute: string): string {
    if (!date) return '';

    const pad = (num: number) => num < 10 ? '0' + num : num;

    // Format date as YYYY-MM-DD
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());

    // Use provided hour/minute or default to 00:00
    const timeHour = hour || '00';
    const timeMinute = minute || '00';

    // Return ISO string format: YYYY-MM-DDTHH:MM:SS
    return `${year}-${month}-${day}T${timeHour}:${timeMinute}:00`;
  }

  getCarData() {
    if (this.previousVehicleType !== this.vehicleType) {
      this.currentPage = 1;
      this.previousVehicleType = this.vehicleType;
    }

    // Format start date with time
    let startDate = '';
    if (this.selectedStartDate) {
      startDate = this.formatDateTime(
        this.selectedStartDate,
        this.selectedHour || '00',
        this.selectedMinute || '00'
      );
    }

    // Format end date with time
    let endDate = '';
    if (this.selectedEndDate) {
      endDate = this.formatDateTime(
        this.selectedEndDate,
        this.selectedEndHour || '23',
        this.selectedEndMinute || '59'
      );
    }

    const obj: any = {
      limit: this.currentLimit,
      page: this.currentPage,
      availabilityStatus: 'available',
      vehicle_type: this.vehicleType,
      car_type: this.carTypes,
      bodyTypeId: this.selectedBodytype || [],
      brandId: this.selectedBrand || [],
      modelId: this.selectedModel || [],
      rental_type: this.selectedRentalType,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      price_type: this.price_type,
      startDate: startDate || null,
      endDate: endDate || null,
      sort: this.sort,
      isvipNumberPlate: this.vipNumberPlate
    };

    if (this.vehicleType == 'Yachts' && this.selectedLength) {
      this.vehicleData = this.vehicleData.filter(item => (item.length ?? '').trim() === this.selectedLength);
    }


    // console.log('API Request:', JSON.stringify(obj, null, 2)); // Debug log

    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        this.totolvehicle = response.count || 0;
        this.vehicleData = response.result || [];
        this.totalItems = response.count || 0;


        // console.log('Filtered Vehicle Data:', this.vehicleData);

        if (this.vehicleType == 'Yachts') {
          this.extractYachtLengths(this.vehicleData);
          if (this.selectedLength) {
            this.vehicleData = this.vehicleData.filter(
              item => (item.length ?? '').trim() === this.selectedLength
            );
            this.totalItems = this.vehicleData.length;
          }
          if (this.vehicleData.length === 0) {
            this.yachtLengthOptions = [];
          }
        }

        if (this.vehicleData.length > 0) {
          this.updatePagedCars();
        }

        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo(0, 0);
        }
      } else {
        this.vehicleData = [];
        this.totolvehicle = 0;
        this.totalItems = 0;
        this.yachtLengthOptions = [];
      }
    }, (error) => {
      console.error('Error fetching vehicles:', error);
      this.vehicleData = [];
      this.totolvehicle = 0;
      this.totalItems = 0;
      this.yachtLengthOptions = [];
    });

    // console.log('Filtering from', startDate, 'to', endDate);

  }

  // new one
  // getCarData() {
  //   if (this.previousVehicleType !== this.vehicleType) {
  //     this.currentPage = 1;
  //     this.previousVehicleType = this.vehicleType;
  //   }

  //   const obj: any = {
  //     limit: this.currentLimit,
  //     page: this.currentPage,
  //     availabilityStatus: 'available',
  //     vehicle_type: this.vehicleType,
  //     car_type: this.carTypes,
  //     bodyTypeId: this.selectedBodytype ? [this.selectedBodytype] : [],
  //     brandId: this.selectedBrand ? [this.selectedBrand] : [],
  //     modelId: this.selectedModel ? [this.selectedModel] : [],
  //     rental_type: this.selectedRentalType,
  //     minPrice: this.minPrice,
  //     maxPrice: this.maxPrice,
  //     price_type: this.price_type,
  //     startDate: this.selectedStartDate,
  //     endDate: this.selectedEndDate,
  //     sort: this.sort,
  //     isvipNumberPlate: this.vipNumberPlate
  //   };

  //   if (this.vehicleType == 'Yachts') {
  //     if (this.selectedLength) {
  //       obj.length = this.selectedLength;
  //     }
  //   }

  //   this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
  //     if (response.code == 200 && response.result && response.result.length > 0) {
  //       this.totolvehicle = response.count;
  //       this.vehicleData = response.result;
  //       this.totalItems = response.count;
  //       if (this.vehicleType == 'Yachts') {
  //         this.extractYachtLengths(response.result);
  //       }
  //       this.updatePagedCars();
  //       if (isPlatformBrowser(this.platformId)) {
  //         window.scrollTo(0, 0);
  //       }
  //     } else {
  //       this.vehicleData = [];
  //       this.totolvehicle = 0;
  //       this.totalItems = 0;
  //       this.yachtLengthOptions = [];
  //     }
  //   }, (error) => {
  //     console.error('Error fetching vehicle data:', error);
  //     this.vehicleData = [];
  //     this.totolvehicle = 0;
  //     this.totalItems = 0;
  //     this.yachtLengthOptions = [];
  //   });
  // }


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

  getBrands() {
    const obj = {};
    this.dataservice.getBrands(obj).subscribe((response) => {
      if (response.code === 200 && response.result?.length > 0) {
        this.allBrands = response.result;
        this.brandData = response.result;
        // this.filterBrandsByBodyType(); // Initial filtering
      }
    });
  }

  // getModels() {
  //   let obj = {};
  //   this.dataservice.getAllModels(obj).subscribe((response) => {
  //     if (response.code == 200) {
  //       if (response.result && response.result.length > 0) {
  //         this.modelData = response.result;
  //       }
  //     }
  //   });
  // }
  getModels() {
    let obj = {};
    this.dataservice.getAllModels(obj).subscribe((response) => {
      if (response.code == 200 && response.result?.length > 0) {
        this.modelData = response.result;
        this.updateFilteredModels();
      } else {
        this.modelData = [];
        this.filteredModel = [];
      }
    });
  }
  private updateFilteredModels() {
    if (this.selectedBrand?.length && this.modelData?.length) {
      this.filteredModel = this.modelData.filter(m => m.brand === this.selectedBrand[0]);
    } else {
      this.filteredModel = [];
    }
  }
  getBodyTypes() {
    let obj = {};
    this.dataservice.getAllBodyTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.allBodyTypes = response.result; // Store all body types
          this.filterBodyTypesByVehicleType(); // Filter based on current vehicle type
        }
      }
    });
  }
  filterBodyTypesByVehicleType() {
    if (this.vehicleType) {
      this.bodyTypeData = this.allBodyTypes.filter(
        (item) => item.type === this.vehicleType
      );
    } else {
      this.bodyTypeData = [];
    }
  }

  filterBrandsByBodyType() {
    if (!this.selectedBodyTypeId) {
      this.brandData = [];
      return;
    }
    this.brandData = this.allBrands.filter(
      (brand) => brand.bodytype === this.selectedBodyTypeId
    );
  }


  extractYachtLengths(data: any[]) {
    const allLengths = data.map(y => (y.length ?? '').trim()).filter(Boolean);
    const uniqueSorted = Array.from(new Set(allLengths)).sort((a, b) => {
      const aNum = parseInt(a);
      const bNum = parseInt(b);
      return isNaN(aNum) || isNaN(bNum) ? a.localeCompare(b) : aNum - bNum;
    });
    this.yachtLengthOptions = uniqueSorted;

  }

  changeModel(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.selectedModel = selectedId ? [selectedId] : [];
    this.getCarData();
  }

  changeCartype(data) {
    if (data?.target?.value) {
      this.selectedCartype = [data.target.value];
    }
  }
  changeRentalType(data) {
    if (data?.target?.value) {
      this.selectedRentalType = data.target.value;
      if (data.target.value === 'Daily') {
        this.price_type = 'dailyRate';
        this.maxPrice = 150000;
      } else if (data.target.value === 'Hourly') {
        this.price_type = 'hourlyRate';
        this.maxPrice = 20000;
      } else if (data.target.value === 'Weekly') {
        this.price_type = 'weeklyRate';
      } else if (data.target.value === 'Monthly') {
        this.price_type = 'monthlyRate';
      }
    }
  }
  changeBrand(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.selectedBrand = selectedId ? [selectedId] : [];
    this.selectedModel = [];
    if (selectedId && this.modelData.length > 0) {
      this.filteredModel = this.modelData.filter(item => item.brand === selectedId);
    } else {
      this.filteredModel = [];
    }
    let tempBrand = this.brandData.filter(
      (item) => item._id === selectedId
    );
    if (tempBrand && tempBrand.length > 0) {
      this.bodyTypeData = tempBrand[0].bodytype_data;
    }
    this.getCarData();
  }


  onSelectBlur(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const downArrow = select.parentElement?.querySelector('.down-arrow') as HTMLElement;
    if (downArrow) {
      downArrow.style.transform = 'translateY(-50%)';
    }
    select.classList.remove('expanded');
  }

  get totalPages(): number {
    return Math.ceil(this.totolvehicle / this.itemsPerPage);
  }

  updatePagedCars() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.pagedCars = this.vehicleData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onPageChange(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getCarData();
      this.updateUrlParams();
      if (isPlatformBrowser(this.platformId)) {
        window.scrollTo(0, 0);
      }
    }
  }

  getPages(): number[] {
    return [...Array(this.totalPages).keys()].map(i => i + 1);
  }

  onChangeSpecialNumber(data) {
    if (data?.target?.value) {
      this.vipNumberPlate = data.target.value === 'true';
    } else {
      this.vipNumberPlate = false;
    }
  }


  onBodyTypeSelect(event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedId = target.value;
    this.selectedBodyTypeId = selectedId;
    this.selectedBodytype = selectedId ? [selectedId] : [];
    this.getCarData();
  }

  onYachtBodyTypeSelect(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.selectedBodytype = selectedId ? [selectedId] : [];
    this.selectedLength = '';
    this.getCarData();
  }

  onYachtLengthSelect(event: Event) {
    const selectedLength = (event.target as HTMLSelectElement).value;
    this.selectedLength = selectedLength || '';
    this.getCarData();
  }

  // getFilteredVehicles() {
  //   const startDateStr = this.selectedStartDate
  //     ? this.formatDateTime(this.selectedStartDate, this.selectedHour || '00', this.selectedMinute || '00')
  //     : null;

  //   const endDateStr = this.selectedEndDate
  //     ? this.formatDateTime(this.selectedEndDate, this.selectedEndHour || '00', this.selectedEndMinute || '00')
  //     : null;

  //   const obj: any = {
  //     limit: this.currentLimit,
  //     page: this.currentPage,
  //     availabilityStatus: 'available',
  //   };

  //   if (this.vehicleType) obj.vehicle_type = this.vehicleType;
  //   if (this.selectedBodytype) obj.bodyTypeId = this.selectedBodytype;
  //   if (this.selectedBrand) obj.brandId = this.selectedBrand;
  //   if (this.selectedModel) obj.modelId = this.selectedModel;
  //   if (this.selectedRentalType) obj.rental_type = this.selectedRentalType;
  //   if (this.minPrice !== null && this.minPrice !== undefined) obj.minPrice = this.minPrice;
  //   if (this.maxPrice !== null && this.maxPrice !== undefined) obj.maxPrice = this.maxPrice;
  //   if (this.price_type) obj.price_type = this.price_type;
  //   if (startDateStr) obj.startDate = startDateStr;
  //   if (endDateStr) obj.endDate = endDateStr;
  //   if (this.sort) obj.sort = this.sort;
  //   if (this.vipNumberPlate) obj.isvipNumberPlate = this.vipNumberPlate;

  //   if (this.vehicleType === 'Yachts' && this.selectedLength) {
  //     obj.length = this.selectedLength.trim();
  //   }

  //   console.log("Search Payload (clean):", obj);

  //   this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
  //     if (response.code === 200) {
  //       this.vehicleData = response.result || [];
  //       this.totalItems = response.count || 0;

  //       if (this.vehicleType === 'Yachts') {
  //         this.extractYachtLengths(this.vehicleData);
  //         if (this.selectedLength) {
  //           this.vehicleData = this.vehicleData.filter(item => (item.length ?? '').trim() === this.selectedLength);
  //           this.totalItems = this.vehicleData.length;
  //         }
  //       }

  //       if (this.vehicleData.length > 0) {
  //         this.updatePagedCars();
  //       } else if (this.vehicleType === 'Yachts') {
  //         this.yachtLengthOptions = [];
  //       }

  //       if (isPlatformBrowser(this.platformId)) {
  //         window.scrollTo(0, 0);
  //       }
  //     }
  //   });
  // }

  private formatDateForUrl(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  onChangeSort(data) {
    if (data?.target?.value) {
      this.sort = data.target.value;
      this.getCarData();
    }
  }

  SearchItems() {
    this.updateUrlParams();
    this.getCarData();
    if (this.isMobile) {
      this.isMobileFilterVisible = false;
    }
    window.scrollTo(0, 0);
  }


  onPriceInputChange(type: 'min' | 'max') {
    // Ensure values are numbers
    this.minPrice = Number(this.minPrice) || 0;
    this.maxPrice = Number(this.maxPrice) || 200000;

    // Ensure min and max are within bounds
    if (this.minPrice < 0) this.minPrice = 0;
    if (this.maxPrice > 200000) this.maxPrice = 200000;

    // Ensure minimum gap between min and max
    const minGap = 500;
    if (this.maxPrice - this.minPrice < minGap) {
      if (type === 'min') {
        this.maxPrice = this.minPrice + minGap;
        if (this.maxPrice > 20000) {
          this.maxPrice = 20000;
          this.minPrice = 20000 - minGap;
        }
      } else {
        this.minPrice = this.maxPrice - minGap;
        if (this.minPrice < 0) {
          this.minPrice = 0;
          this.maxPrice = minGap;
        }
      }
    }

    this.updateSlider();
  }

  initializeSlider() {
    this.updateSlider();
    if (isPlatformBrowser(this.platformId)) {
      const minThumb = document.getElementById('thumb-min') as HTMLElement;
      const maxThumb = document.getElementById('thumb-max') as HTMLElement;
      const range = document.getElementById('slider-range') as HTMLElement;
      const slider = document.getElementById('slider') as HTMLElement;

      if (!minThumb || !maxThumb || !range || !slider) return;

      let isDragging = false;
      let activeThumb: HTMLElement | null = null;
      let startX = 0;
      let startLeft = 0;

      // Set initial positions

      // Mouse/Touch event handlers
      const startDrag = (e: MouseEvent | TouchEvent, thumb: HTMLElement) => {
        isDragging = true;
        activeThumb = thumb;
        startX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        startLeft = parseInt(activeThumb.style.left || '0');
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag);
      };

      const onDrag = (e: MouseEvent | TouchEvent) => {
        if (!isDragging || !activeThumb) return;

        const sliderRect = slider.getBoundingClientRect();
        const sliderWidth = sliderRect.width;
        const clientX = e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;

        // Calculate new position
        let newLeft = startLeft + (clientX - startX);

        // Constrain to slider bounds
        newLeft = Math.max(0, Math.min(newLeft, sliderWidth));

        // Update thumb position
        activeThumb.style.left = `${newLeft}px`;

        // Update range fill
        this.updateRangeFill();

        // Update price values
        this.updatePricesFromSlider();
      };

      const stopDrag = () => {
        isDragging = false;
        activeThumb = null;
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('touchmove', onDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchend', stopDrag);
      };

      // Add event listeners
      minThumb.addEventListener('mousedown', (e) => startDrag(e, minThumb));
      maxThumb.addEventListener('mousedown', (e) => startDrag(e, maxThumb));
      minThumb.addEventListener('touchstart', (e) => startDrag(e, minThumb));
      maxThumb.addEventListener('touchstart', (e) => startDrag(e, maxThumb));

      // Handle keyboard controls
      minThumb.setAttribute('tabindex', '0');
      maxThumb.setAttribute('tabindex', '0');

      const handleKeyDown = (e: KeyboardEvent, isMin: boolean) => {
        const thumb = isMin ? minThumb : maxThumb;
        const currentPos = parseInt(thumb.style.left || '0');
        const sliderWidth = slider.offsetWidth;
        const step = sliderWidth / 100; // 1% of slider width

        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            thumb.style.left = `${Math.max(0, currentPos - step)}px`;
            break;
          case 'ArrowRight':
            e.preventDefault();
            thumb.style.left = `${Math.min(sliderWidth, currentPos + step)}px`;
            break;
          case 'Home':
            e.preventDefault();
            thumb.style.left = '0px';
            break;
          case 'End':
            e.preventDefault();
            thumb.style.left = `${sliderWidth}px`;
            break;
        }

        this.updateRangeFill();
        this.updatePricesFromSlider();
      };

      minThumb.addEventListener('keydown', (e) => handleKeyDown(e, true));
      maxThumb.addEventListener('keydown', (e) => handleKeyDown(e, false));
    }
  }


  updateSlider() {
    const minThumb = document.getElementById('thumb-min');
    const maxThumb = document.getElementById('thumb-max');
    const slider = document.getElementById('slider');

    if (!minThumb || !maxThumb || !slider) return;

    const sliderWidth = slider.offsetWidth;
    const minPos = (this.minPrice / 10000) * sliderWidth;
    const maxPos = (this.maxPrice / 10000) * sliderWidth;

    minThumb.style.left = `${minPos}px`;
    maxThumb.style.left = `${maxPos}px`;

    this.updateRangeFill();
  }

  updateRangeFill() {
    const minThumb = document.getElementById('thumb-min');
    const maxThumb = document.getElementById('thumb-max');
    const range = document.getElementById('slider-range');
    const slider = document.getElementById('slider');

    if (!minThumb || !maxThumb || !range || !slider) return;

    const minPos = parseFloat(minThumb.style.left) || 0;
    const maxPos = parseFloat(maxThumb.style.left) || 100;
    const sliderWidth = slider.offsetWidth;

    // Ensure min is always left of max
    if (minPos > maxPos) {
      minThumb.style.left = `${maxPos}px`;
      maxThumb.style.left = `${minPos}px`;

      // Swap values if needed
      const temp = this.minPrice;
      this.minPrice = this.maxPrice;
      this.maxPrice = temp;

      return this.updateRangeFill();
    }

    range.style.left = `${minPos}px`;
    range.style.width = `${maxPos - minPos}px`;
  }

  updatePricesFromSlider() {
    const minThumb = document.getElementById('thumb-min');
    const maxThumb = document.getElementById('thumb-max');
    const slider = document.getElementById('slider');

    if (!minThumb || !maxThumb || !slider) return;

    const sliderWidth = slider.offsetWidth;
    const minPos = parseFloat(minThumb.style.left) || 0;
    const maxPos = parseFloat(maxThumb.style.left) || 0;

    // Update price values based on thumb positions (0-10000 range)
    this.minPrice = Math.round((minPos / sliderWidth) * 10000);
    this.maxPrice = Math.round((maxPos / sliderWidth) * 10000);

    // Ensure minimum gap between thumbs (e.g., 500)
    const minGap = 500;
    if (this.maxPrice - this.minPrice < minGap) {
      if (minThumb === document.activeElement) {
        this.minPrice = this.maxPrice - minGap;
        if (this.minPrice < 0) this.minPrice = 0;
      } else {
        this.maxPrice = this.minPrice + minGap;
        if (this.maxPrice > 10000) this.maxPrice = 10000;
      }
      this.updateSlider();
    }
  }

  formatDate(date: Date | null): string {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  toggleDateTimeDropdown(event: Event) {
    event.stopPropagation();
    if (this.showDateTimeDropdown) {
      // If already open, just close it
      this.showDateTimeDropdown = false;
      return;
    }
    this.closeAllDropdowns();
    this.showDateTimeDropdown = !this.showDateTimeDropdown;
    this.activeStartView = 'calendar';
  }

  toggleEndDateTimeDropdown(event: Event) {
    event.stopPropagation();

    if (!this.selectedStartDate) {
      this.Toast.fire({
        title: 'Please select the start date & time first.',
        icon: 'warning'
      });
      return;
    }

    if (this.showEndDateTimeDropdown) {
      // If already open, just close it
      this.showEndDateTimeDropdown = false;
      return;
    }

    this.closeAllDropdowns();
    this.showEndDateTimeDropdown = true;
    this.activeEndView = 'calendar';
  }
  // toggleEndDateTimeDropdown(event: Event) {
  //   event.stopPropagation();
  //   if (!this.selectedStartDate) {
  //     this.Toast.fire({ title: 'Please select the start date & time first.', icon: 'warning' });
  //     return;
  //   }
  //   this.closeAllDropdowns();
  //   this.showEndDateTimeDropdown = !this.showEndDateTimeDropdown;
  //   if (this.showEndDateTimeDropdown) {
  //     this.activeEndView = 'calendar';
  //   }
  // }

  // showCalendarView() {
  //   this.closeAllDropdowns();
  //   this.activeView = 'calendar';
  //   this.showDateTimeDropdown = true;
  // }

  // showTimeView() {
  //   this.closeAllDropdowns();
  //   this.activeView = 'time';
  //   this.showDateTimeDropdown = true;
  // }

  showCalendarView(context: 'start' | 'end') {
    if (context === 'start') {
      this.activeStartView = 'calendar';
    } else {
      this.activeEndView = 'calendar';
    }
  }

  showTimeView(context: 'start' | 'end') {
    if (context === 'start') {
      this.activeStartView = 'time';
    } else {
      this.activeEndView = 'time';
    }
  }

  // canGoPrevMonth(): boolean {
  //   const today = new Date();
  //   return this.currentMonth > new Date(today.getFullYear(), today.getMonth(), 1);
  // }


  canGoPrevMonth(): boolean {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.currentMonth > minDate;
  }

  canGoPrevEndMonth(): boolean {
    if (!this.selectedStartDate) return false;
    const minDate = new Date(this.selectedStartDate.getFullYear(), this.selectedStartDate.getMonth(), 1);
    return this.endMonth > minDate;
  }


  // calendaer
  generateCalendar() {
    this.calendarDates = [];
    const startOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endOfMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);

    const startDay = startOfMonth.getDay();
    for (let i = startDay; i > 0; i--) {
      this.calendarDates.push(new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), 1 - i));
    }

    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      this.calendarDates.push(new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), i));
    }

    const endDay = endOfMonth.getDay();
    for (let i = 1; i < 7 - endDay; i++) {
      this.calendarDates.push(new Date(endOfMonth.getFullYear(), endOfMonth.getMonth() + 1, i));
    }
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentMonth.getMonth();
  }

  prevMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendar();
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  isBeforeToday(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }


  selectHour(hour: string) {
    this.selectedHour = hour;
    if (this.selectedHour && this.selectedMinute) {
      this.selectedStartTime = `${this.selectedHour}:${this.selectedMinute}`;
      this.onStartDateTimeChange();
    }
  }

  isSelectedHour(hour: string): boolean {
    return this.selectedHour === hour;
  }


  selectMinute(minute: string) {
    this.selectedMinute = minute;
    if (this.selectedHour && this.selectedMinute) {
      this.selectedStartTime = `${this.selectedHour}:${this.selectedMinute}`;
      this.onStartDateTimeChange();
    }
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
  generateHours() {
    this.displayHours = [];
    for (let i = 0; i < 24; i++) {
      this.displayHours.push(i.toString().padStart(2, '0'));
    }
  }
  selectDate(date: Date) {
    // console.log('Selected Date:', date);
    if (!this.selectedStartDate || this.selectedStartDate.getTime() !== new Date(date).getTime()) {
      this.onStartDateTimeChange();
    }
    this.selectedStartDate = new Date(date);
  }

  isSelectedStartDate(date: Date): boolean {
    return (
      this.selectedStartDate &&
      date.getDate() === this.selectedStartDate.getDate() &&
      date.getMonth() === this.selectedStartDate.getMonth() &&
      date.getFullYear() === this.selectedStartDate.getFullYear()
    );
  }

  onStartDateTimeChange() {
    // Reset end date/time if 'from' date or time changes
    this.resetEndDateTimeSelection();
  }

  resetDateTimeSelection() {
    // Reset both start and end
    this.selectedStartDate = null;
    this.selectedHour = '';
    this.selectedMinute = '';
    this.selectedStartTime = '';

    this.selectedEndDate = null;
    this.selectedEndHour = '';
    this.selectedEndMinute = '';
    this.selectedEndTime = '';
  }

  confirmDateTime() {
    if (this.selectedStartDate && this.selectedHour && this.selectedMinute) {
      this.selectedStartTime = `${this.selectedHour}:${this.selectedMinute}`;
      this.showDateTimeDropdown = false;
    } else {
      this.Toast.fire({
        title: 'Please select both date and time before confirming.',
        icon: 'warning',
      });
    }
  }



  // end calender and time
  generateEndCalendar() {
    this.endCalendarDates = [];
    const startOfMonth = new Date(this.endMonth.getFullYear(), this.endMonth.getMonth(), 1);
    const endOfMonth = new Date(this.endMonth.getFullYear(), this.endMonth.getMonth() + 1, 0);

    const startDay = startOfMonth.getDay();
    for (let i = startDay; i > 0; i--) {
      this.endCalendarDates.push(new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), 1 - i));
    }

    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      this.endCalendarDates.push(new Date(this.endMonth.getFullYear(), this.endMonth.getMonth(), i));
    }

    const endDay = endOfMonth.getDay();
    for (let i = 1; i < 7 - endDay; i++) {
      this.endCalendarDates.push(new Date(endOfMonth.getFullYear(), endOfMonth.getMonth() + 1, i));
    }
  }

  isCurrentEndMonth(date: Date): boolean {
    return date.getMonth() === this.endMonth.getMonth();
  }

  prevEndMonth() {
    this.endMonth = new Date(this.endMonth.getFullYear(), this.endMonth.getMonth() - 1, 1);
    this.generateEndCalendar();
  }

  nextEndMonth() {
    this.endMonth = new Date(this.endMonth.getFullYear(), this.endMonth.getMonth() + 1, 1);
    this.generateEndCalendar();
  }

  selectEndHour(hour: string) {
    this.selectedEndHour = hour;
    if (this.selectedEndHour && this.selectedEndMinute) {
      this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute}`;
      this.onEndDateTimeChange();
    }
  }


  isSelectedEndHour(hour: string): boolean {
    return this.selectedEndHour === hour;
  }

  // isPastEndTime(hour: string, minute: string): boolean {
  //   if (!this.selectedEndDate || !this.isToday(this.selectedEndDate)) return false;
  //   const now = new Date();
  //   const selectedTime = new Date(
  //     this.selectedEndDate.getFullYear(),
  //     this.selectedEndDate.getMonth(),
  //     this.selectedEndDate.getDate(),
  //     parseInt(hour, 10),
  //     parseInt(minute, 10)
  //   );
  //   return selectedTime < now;
  // }

  isPastEndTime(hour: string, minute: string): boolean {
    if (!this.selectedEndDate) return false;

    // Case 1: Drop date is today → disable before current time
    if (this.isToday(this.selectedEndDate)) {
      const now = new Date();
      const selectedTime = new Date(
        this.selectedEndDate.getFullYear(),
        this.selectedEndDate.getMonth(),
        this.selectedEndDate.getDate(),
        parseInt(hour, 10),
        parseInt(minute, 10)
      );
      if (selectedTime < now) return true;
    }

    // Case 2: Drop date is same as pickup date → disable before pickup time
    if (
      this.selectedStartDate &&
      this.selectedEndDate &&
      this.selectedStartDate.getTime() === this.selectedEndDate.getTime()
    ) {
      const pickupTime = new Date(
        this.selectedStartDate.getFullYear(),
        this.selectedStartDate.getMonth(),
        this.selectedStartDate.getDate(),
        parseInt(this.selectedHour || '0', 10),
        parseInt(this.selectedMinute || '0', 10)
      );
      const dropTime = new Date(
        this.selectedEndDate.getFullYear(),
        this.selectedEndDate.getMonth(),
        this.selectedEndDate.getDate(),
        parseInt(hour, 10),
        parseInt(minute, 10)
      );
      return dropTime <= pickupTime;
    }

    return false;
  }

  selectEndMinute(minute: string) {
    this.selectedEndMinute = minute;
    if (this.selectedEndHour && this.selectedEndMinute) {
      this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute}`;
      this.onEndDateTimeChange();
    }
  }

  selectEndDate(date: Date) {
    // console.log('Selected End Date:', date);
    if (!this.selectedEndDate || this.selectedEndDate.getTime() !== new Date(date).getTime()) {
      this.onEndDateTimeChange();
    }
    this.selectedEndDate = new Date(date);
  }

  // isBeforePickupDate(date: Date): boolean {
  //   if (!this.selectedStartDate) return false;
  //   return date < this.selectedStartDate;
  // }

  isBeforePickupDate(date: Date): boolean {
    if (!this.selectedStartDate) return false;
    const pickupMidnight = new Date(this.selectedStartDate);
    pickupMidnight.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < pickupMidnight;
  }

  isDropTimeBeforePickup(): boolean {
    if (!this.selectedStartDate || !this.selectedEndDate) return false;

    const pickup = new Date(
      this.selectedStartDate.getFullYear(),
      this.selectedStartDate.getMonth(),
      this.selectedStartDate.getDate(),
      parseInt(this.selectedHour || '0', 10),
      parseInt(this.selectedMinute || '0', 10)
    );

    const drop = new Date(
      this.selectedEndDate.getFullYear(),
      this.selectedEndDate.getMonth(),
      this.selectedEndDate.getDate(),
      parseInt(this.selectedEndHour || '0', 10),
      parseInt(this.selectedEndMinute || '0', 10)
    );

    return drop <= pickup;
  }

  isSelectedEndDate(date: Date): boolean {
    return (
      this.selectedEndDate &&
      date.getDate() === this.selectedEndDate.getDate() &&
      date.getMonth() === this.selectedEndDate.getMonth() &&
      date.getFullYear() === this.selectedEndDate.getFullYear()
    );
  }
  resetEndDateTimeSelection() {
    // Reset only end
    this.selectedEndDate = null;
    this.selectedEndHour = '';
    this.selectedEndMinute = '';
    this.selectedEndTime = '';
  }
  confirmEndDateTime() {
    if (!this.selectedEndDate && !this.selectedEndHour && !this.selectedEndMinute) {
      // console.log("Please select both date and time.");
      this.Toast.fire({
        title: 'Please select both date and time before confirming.',
        icon: 'warning',
      });
      return;
    }

    if (!this.selectedEndDate) {
      // console.log("Please select date.");
      this.Toast.fire({
        title: 'Please select a date before confirming.',
        icon: 'warning',
      });
      return;
    }

    if (!this.selectedEndHour || !this.selectedEndMinute) {
      // console.log("Please select time.");
      this.Toast.fire({
        title: 'Please select a time before confirming.',
        icon: 'warning',
      });
      return;
    }
    // if (!this.selectedEndHour ) {
    //   console.log("Please select hour.");
    //   this.Toast.fire({
    //     title: 'Please select a hour before confirming.',
    //     icon: 'warning',
    //   });
    //   return;
    // }
    // if (!this.selectedEndMinute ) {
    //   console.log("Please select minute.");
    //   this.Toast.fire({
    //     title: 'Please select a minute before confirming.',
    //     icon: 'warning',
    //   });
    //   return;
    // }

    // If both date & time exist
    this.selectedEndTime = `${this.selectedEndHour}:${this.selectedEndMinute}`;
    this.showEndDateTimeDropdown = false;
  }

  onEndDateTimeChange() {
    // Reset end time selection stzate when date or time changes
    this.selectedEndTime = '';
  }


  // sort dropdown
  dropdownOpen = false;
  selectedSortLabel: string | null = null;

  sortOptions = [
    { value: 'H-L', label: 'Price: High to Low' },
    { value: 'L-H', label: 'Price: Low to High' },
    // { value: '', label: 'Reset' }
  ];

  toggleDropdown() {
    // this.closeAllDropdowns();
    this.dropdownOpen = !this.dropdownOpen;
  }


  selectSort(option: { value: string; label: string }) {
    this.selectedSortLabel = option.label;
    this.sort = option.value;
    this.dropdownOpen = false;
    this.getCarData();
    this.updateUrlParams();
  }

  vehicleTypeOpen = false;
  brandOpen = false;
  modelOpen = false;
  bodytypeOpen = false;
  yachtBodytypeOpen = false;
  specialnumberOpen = false;
  yachtLengthOpen = false;
  selectedSpecialNumber: string | null = null;


  toggleFilterDropdown(
    type: 'vehicleType' | 'brand' | 'model' | 'bodytype' | 'yachtbodytype' | 'specialnumber' | 'yachtlength'
  ) {
    const isSameDropdown =
      (type === 'vehicleType' && this.vehicleTypeOpen) ||
      (type === 'brand' && this.brandOpen) ||
      (type === 'model' && this.modelOpen) ||
      (type === 'bodytype' && this.bodytypeOpen) ||
      (type === 'yachtbodytype' && this.yachtBodytypeOpen) ||
      (type === 'specialnumber' && this.specialnumberOpen) ||
      (type === 'yachtlength' && this.yachtLengthOpen);

    // Close all dropdowns before opening the new one
    this.closeAllDropdowns();

    if (isSameDropdown) return; // Toggle off if clicking the same

    switch (type) {
      case 'vehicleType':
        this.vehicleTypeOpen = true;
        break;

      case 'brand':
        this.brandOpen = true;
        break;

      case 'model':
        if (!this.selectedBrand?.length) {
          this.Toast.fire({
            icon: 'warning',
            title: 'Please select a brand first',
            timer: 2000
          });
          this.brandOpen = true;
          return;
        }
        this.modelOpen = true;
        break;

      case 'bodytype':
        if (this.vehicleType === 'Car') {
          if (!this.selectedBrand?.length) {
            this.Toast.fire({
              icon: 'warning',
              title: 'Please select a brand first',
              timer: 2000
            });
            this.brandOpen = true;
            return;
          }
          if (!this.selectedModel?.length) {
            this.Toast.fire({
              icon: 'warning',
              title: 'Please select a model first',
              timer: 2000
            });
            this.modelOpen = true;
            return;
          }
          this.bodytypeOpen = true;
        }
        break;

      case 'yachtbodytype':

        this.yachtBodytypeOpen = true;
        break;

      case 'specialnumber':
        this.specialnumberOpen = true;
        break;

      case 'yachtlength':
        if (!this.selectedBodytype) {
          this.Toast.fire({
            icon: 'warning',
            title: 'Please select a body type first',
            timer: 2000
          });
          this.yachtBodytypeOpen = true;
          return;
        }
        this.yachtLengthOpen = true;
        break;

    }
  }

  // Display text mapping for vehicle types
  vehicleTypeDisplayText: { [key: string]: string } = {
    'Car': 'Cars',
    'Yachts': 'Yachts'
  };

  // Get display text for current vehicle type
  getVehicleTypeDisplay(): string {
    return this.vehicleType ? (this.vehicleTypeDisplayText[this.vehicleType] || this.vehicleType) : 'Select Vehicle Type';
  }

  selectVehicleType(vehicleType: string) {
    this.vehicleType = vehicleType;
    this.vehicleTypeOpen = false;


    this.currentLimit = 12;
    this.currentPage = 1;
    this.itemsPerPage = 12;


    if (this.vehicleType === 'Car') {
      this.maxPrice = 10000;
      this.price_type = 'dailyRate';
      this.vipNumberPlate = false;
      this.page = 'ViewCars';
    } else if (this.vehicleType === 'Yachts') {
      this.maxPrice = 20000;
      this.price_type = 'hourlyRate';
      this.vipNumberPlate = false;
      this.page = 'ViewYachts';
    }

    // Reset filters
    this.selectedBodytype = '';
    this.selectedBrand = '';
    this.selectedModel = '';
    this.selectedLength = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.minPrice = 0;
    this.filteredModel = [];
    this.bodyTypeData = [];

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { type: this.vehicleType },
      replaceUrl: true
    });
    // Filter body types based on vehicle type
    this.filterBodyTypesByVehicleType();

    // Fetch data
    this.updateSlider();
    this.getCarData();
    // this.get_PageMeta();
    // this.updateUrlParams();
  }

  // selectBrand(name: string): void {
  //   this.selectedBrand = name;
  //   console.log(this.selectedBrand);
  //   this.brandOpen = false;
  //   this.getCarData();
  // }

  // selectModel(id: string): void {
  //   this.filteredModel = id;
  //   const model = this.modelData.find(item => item._id === id);
  //   this.selectedModel = model?.name || '';
  //   this.modelOpen = false;
  //   this.getCarData();
  // }
  // selectBodyType(id: string): void {
  //   const selectedId = id;
  //   this.selectedBodyTypeId = selectedId;
  //   this.selectedBodytype = selectedId ? [selectedId] : [];
  //   this.bodytypeOpen = false;
  //   this.getCarData();
  // }
  // selectSpecialNumber(value: string): void {
  //   if (value) {
  //     this.vipNumberPlate = value === 'true';
  //   } else {
  //     this.vipNumberPlate = false;
  //   }
  //   this.selectedSpecialNumber = value;
  //   this.specialnumberOpen = false;
  //   this.getCarData();
  // }
  // selectYachtLength(value: string): void {
  //   this.selectedLength = value;
  //   this.yachtLengthOpen = false;
  //   this.getCarData();
  // }

  closeAllDropdowns() {
    this.dropdownOpen = false;
    this.vehicleTypeOpen = false;
    this.brandOpen = false;
    this.modelOpen = false;
    this.bodytypeOpen = false;
    this.yachtBodytypeOpen = false;
    this.specialnumberOpen = false;
    this.yachtLengthOpen = false;
    this.showDateTimeDropdown = false;
    this.showEndDateTimeDropdown = false;
  }
  // Helper methods to get selected item names for display
  getSelectedBrandName(): string {
    if (!this.selectedBrand || this.selectedBrand.length === 0) {
      return '';
    }
    const selectedBrand = this.brandData.find(item => item._id === this.selectedBrand[0]);
    return selectedBrand ? selectedBrand.name : '';
  }


  getSelectedModelName(): string {
    if (!this.selectedModel?.length || !this.filteredModel) return '';
    const modelId = Array.isArray(this.selectedModel) ? this.selectedModel[0] : this.selectedModel;
    const model = this.filteredModel.find(item => item._id === modelId);
    return model ? model.name : '';
  }

  getSelectedBodyTypeName(): string {
    if (!this.selectedBodytype?.length || !this.allBodyTypes) return '';
    const bodyTypeId = Array.isArray(this.selectedBodytype) ? this.selectedBodytype[0] : this.selectedBodytype;
    const bodyType = this.allBodyTypes.find(item => item._id === bodyTypeId);
    return bodyType ? bodyType.name : '';
  }


  selectBrand(item: any): void {
    this.selectedModel = '';
    this.selectedBodytype = '';
    this.selectedBrand = item._id ? [item._id] : [];
    this.selectedModel = [];

    if (item._id && this.modelData.length > 0) {
      this.filteredModel = this.modelData.filter(model => model.brand === item._id);
    } else {
      this.filteredModel = [];
    }

    if (item.bodytype_data) {
      this.bodyTypeData = item.bodytype_data;
    } else {
      this.bodyTypeData = [];
    }

    this.brandOpen = false;
    this.getCarData();
  }

  // selectModel(model: any): void {
  //   this.selectedModel = model._id;
  //   this.modelOpen = false;
  //   this.getCarData();
  // }

  // selectBodyType(bodyType: any): void {
  //   this.selectedBodytype = bodyType._id;
  //   this.bodytypeOpen = false;
  //   this.yachtBodytypeOpen = false; // Close yacht body type dropdown too
  //   this.getCarData();
  // }

  selectModel(model: any): void {
    this.selectedBodytype = '';
    this.selectedModel = model._id ? [model._id] : [];
    this.modelOpen = false;
    this.getCarData();
  }

  selectBodyType(bodyType: any): void {
    this.selectedLength = '';
    this.selectedBodytype = bodyType._id ? [bodyType._id] : [];
    this.bodytypeOpen = false;
    this.yachtBodytypeOpen = false;
    this.getCarData();
  }

  selectSpecialNumber(value: string): void {
    this.vipNumberPlate = value === 'true';
    this.selectedSpecialNumber = value === 'true' ? 'Opt for Special Number Plate' : 'Do Not Opt';
    this.specialnumberOpen = false;
    this.getCarData();
  }

  selectYachtLength(item: string): void {
    this.selectedLength = item;
    // console.log('Selected Length:', this.selectedLength);
    this.yachtLengthOpen = false;
    this.getCarData();
  }


  async resetFilter() {
    // Reset all filter properties
    this.vehicleType = '';
    this.carTypes = [];
    this.selectedBodytype = '';
    this.selectedBrand = [];
    this.selectedModel = '';
    this.selectedLength = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.selectedRentalType = null;
    this.minPrice = 0;
    this.maxPrice = 20000; // Reset to default max price
    this.vipNumberPlate = false;
    this.selectedSpecialNumber = '';
    this.sort = null;
    this.filteredModel = [];
    this.bodyTypeData = [];
    this.price_type = ''; // Reset price type

    // Reset pagination
    this.currentPage = 1;
    this.currentLimit = 12;
    this.itemsPerPage = 12;

    // Clear query params (but stay on same route)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}, // 👈 this clears all params
      replaceUrl: true, // avoid history clutter
    });
    // Reset any other relevant filters
    this.brandData = [];
    this.modelData = [];
    this.allBodyTypes = [];
    this.allBrands = [];
    this.selectedBodyTypeId = '';
    // Reset slider and fetch fresh data
    this.updateSlider();
    this.getCarData();
    this.getBrands();
    this.getBodyTypes();
    this.getModels();
    this.closeAllDropdowns();

  }
  setVehicleType() {
    if (this.vehicleType === 'Car') {
      // console.log('Cars selected');
      this.maxPrice = 10000;
      this.currentLimit = 12;
      this.currentPage = 1;
      this.itemsPerPage = 12;
      this.price_type = 'dailyRate';
    } else if (this.vehicleType === 'Yachts') {
      // console.log('Yachts selected');
      this.maxPrice = 20000;
      this.currentLimit = 12;
      this.currentPage = 1;
      this.itemsPerPage = 12;
      this.price_type = 'hourlyRate';
    }

    // Reset and filter body types
    this.selectedBodytype = ''; // Reset the selected body type
    this.filterBodyTypesByVehicleType();

    this.selectedBrand = '';
    this.selectedModel = '';
    this.selectedLength = '';
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.filteredModel = [];
    this.getCarData();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    // Check if click was inside any dropdown container
    const clickedInsideDateTime = this.startDateTimePicker?.nativeElement.contains(target);
    const clickedInsideEndDateTime = this.endDateTimePicker?.nativeElement.contains(target);
    const clickedInsideDropdown = target.closest('.cdrop') ||
      target.closest('.filter-section') ||
      target.closest('.sort-dropdown'); // Add other dropdown classes as needed

    // If clicked outside all dropdown containers, close all dropdowns
    if (!clickedInsideDateTime && !clickedInsideEndDateTime && !clickedInsideDropdown) {
      this.closeAllDropdowns();
    }
  }
  updateUrlParams() {
    const queryParams: any = {};

    // Only include these 3 params in the URL
    if (this.vehicleType) queryParams.type = this.vehicleType;
    if (this.selectedBrand) {
      queryParams.brand = Array.isArray(this.selectedBrand)
        ? this.selectedBrand[0]
        : this.selectedBrand;
    }
    if (this.selectedModel) {
      queryParams.model = Array.isArray(this.selectedModel)
        ? this.selectedModel[0]
        : this.selectedModel;
    }
    if (this.selectedBodytype) {
      queryParams.bodyType = Array.isArray(this.selectedBodytype)
        ? this.selectedBodytype[0]
        : this.selectedBodytype;
    }
    if (this.selectedLength) {
      queryParams.length = Array.isArray(this.selectedLength)
        ? this.selectedLength[0]
        : this.selectedLength;
    }
    if (this.selectedStartDate) {
      queryParams.startDate = this.formatDateForUrl(this.selectedStartDate);
    }
    if (this.selectedEndDate) {
      queryParams.endDate = this.formatDateForUrl(this.selectedEndDate);
    }
    if (this.vipNumberPlate) {
      queryParams.vip = 'true';
    }
    if(this.sort) queryParams.sort = this.sort;
    if (this.currentPage > 1) {
      queryParams.page = this.currentPage;
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      replaceUrl: true
    });
  }
  private processQueryParams(params: Params) {
    // Reset dependent state
    this.selectedBrand = [];
    this.selectedModel = [];
    this.selectedBodytype = [];
    this.selectedLength = '';
    this.vipNumberPlate = false;
    this.selectedSpecialNumber = null;
    this.sort = null;
    this.selectedStartDate = null;
    this.selectedEndDate = null;
    this.selectedRentalType = null;
    this.currentPage = params['page'] ? Number(params['page']) : 1;
    if (isNaN(this.currentPage) || this.currentPage < 1) {
      this.currentPage = 1;
    }
    // Restore from URL
    if (params['type']) this.vehicleType = params['type'];
    if (params['brand']) this.selectedBrand = [params['brand']];
    if (params['model']) this.selectedModel = [params['model']];
    if (params['bodyType']) this.selectedBodytype = [params['bodyType']];
    if (params['length']) this.selectedLength = params['length'];
    if (params['minPrice']) this.minPrice = Number(params['minPrice']);
    if (params['maxPrice']) this.maxPrice = Number(params['maxPrice']);
    if (params['sort']) this.sort = params['sort'];
    if (params['rentalType']) this.selectedRentalType = params['rentalType'];


    // ➕ Restore VIP
  if (params['vip'] === 'true') {
    this.vipNumberPlate = true;
    this.selectedSpecialNumber = 'Opt for Special Number Plate';
  } else {
    this.vipNumberPlate = false;
    this.selectedSpecialNumber = null;
  }


    if (params['startDate']) {
      const start = new Date(params['startDate']);
      if (!isNaN(start.getTime())) {
        this.selectedStartDate = start;
      }
    }
    if (params['endDate']) {
      const end = new Date(params['endDate']);
      if (!isNaN(end.getTime())) {
        this.selectedEndDate = end;
      }
    }
    // Set price_type & maxPrice based on vehicle/rental
    this.updatePriceSettings();
    this.updateFilteredModels();

    // Re-filter dependent lists
    this.filterBodyTypesByVehicleType();
    if (this.selectedBrand.length && this.modelData.length) {
      this.filteredModel = this.modelData.filter(m => m.brand === this.selectedBrand[0]);
    }

    // Fetch results
    this.getCarData();
  }
  private updatePriceSettings() {
    if (!this.vehicleType) return;

    if (this.vehicleType === 'Car') {
      this.maxPrice = this.selectedRentalType === 'Hourly' ? 20000 : 10000;
      this.price_type = this.selectedRentalType === 'Hourly' ? 'hourlyRate' :
        this.selectedRentalType === 'Weekly' ? 'weeklyRate' :
          this.selectedRentalType === 'Monthly' ? 'monthlyRate' : 'dailyRate';
    } else if (this.vehicleType === 'Yachts') {
      this.maxPrice = 20000;
      this.price_type = 'hourlyRate'; // Yachts are hourly by default
    }
  }
}
