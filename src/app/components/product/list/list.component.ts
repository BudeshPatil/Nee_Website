import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject, HostListener } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DataService } from '../../../providers/data/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  Math = Math;
  imageURL: string = `${environment.url}/assets`;
  backendURl = `${environment.baseUrl}/public`;

  // Pagination properties
  currentLimit = 8;
  currentPage = 1;
  itemsPerPage = 8;
  totalItems = 0;
  totolvehicle = 0;
  pagedCars: any = [];
  vehicleData: any = [];
  ourCarCollections: any = [];
  trendingRentalCars: any = [];
  bannerData: any;
  cartypeData: any;
  cartypeDataList: any;
  url_key: any;
  carTypes: any = [];
  selectedbannerpage = 'product';
  sort: any;
  activeCategoryId: string = '';  // Add this line to track active category


  constructor(
    private dataservice: DataService,
    public route: ActivatedRoute,
    public router: Router,
    
    @Inject(PLATFORM_ID) private platformId: Object

  ) {
    this.url_key = this.route.snapshot.paramMap.get('car_type');
    if(this.url_key){
      this.selectedbannerpage = this.url_key;
    }
  }
  ngOnInit() {
    // ✅ Query params
    this.route.queryParams.subscribe(params => {
      if (params['sort']) {
        this.sort = params['sort'];
        // Set dropdown label for the UI
        const selectedOption = this.sortOptions.find(opt => opt.value === this.sort);
        if(selectedOption) this.selectedSortLabel = selectedOption.label;
      }
      if (params['page']) {
        this.currentPage = +params['page'];
      }
  
    });
    if (this.url_key) {
      this.getCarTypes();
      this.getAllCarTypes();
    } else {
      this.getAllCarTypes();
      this.getCarData();
    }
    this.getBannerData();
  }


  ngAfterViewInit() {
    // if (isPlatformBrowser(this.platformId)) {
    //   AOS.init({
    //     once: true,
    //     mirror: true,
    //     easing: 'ease',
    //   });
    // }
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
      window.scrollTo(0, 0);
    }
  }

  getPages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  getCarData() {
    let obj = {
      limit: this.currentLimit,
      page: this.currentPage,
      availabilityStatus: 'available',
      vehicle_type: "Car",
      car_type: this.carTypes,
      sort: this.sort
    };
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code == 200) {
        this.totolvehicle = response.count;
        this.totalItems = response.count;
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result;
          // console.log(this.vehicleData);
          this.updatePagedCars();
        }
      }
    });
  }


  getBannerData() {
    let obj = {};
    this.dataservice.getAllBanner(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          response.result.forEach(banner => {
            if (banner && banner.status && banner.page == this.selectedbannerpage) {
              this.bannerData = banner;
            }
          });
        }
      }
    });
  }

  getCarTypes() {
    let obj = {
      url_key: this.url_key
    };
    this.dataservice.getCarTypeByURL(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.cartypeData = response.result[0];
          if (this.cartypeData) {
            this.carTypes = [this.cartypeData._id];
            this.activeCategoryId = this.cartypeData._id;  // Set active category when loading specific category
            this.selectedbannerpage = this.cartypeData.name;
            this.getCarData();
            this.getBannerData();
          }
        }
      }
    });
  }
  activeCategory(id: string) {
    this.activeCategoryId = id; 
    this.carTypes = [id];
    this.getCarData();
  }

  getAllCarTypes() {
    this.dataservice.getCarTypes({}).subscribe((response) => {
      if (response.code == 200) {
        this.cartypeDataList = response.result;
        // console.log(this.cartypeDataList);
      }
    });
  }
 
  
  onChangeSort(data) {
    if (data) {
      this.sort = data.target.value;
      this.getCarData();
    }
  }


 
  // sort dropdown
  dropdownOpen = false;
selectedSortLabel: string | null = null;

sortOptions = [
	{ value: 'H-L', label: 'Price: High to Low' },
	{ value: 'L-H', label: 'Price: Low to High' },
	{ value: '', label: 'Reset' }
];

toggleDropdown() {
	this.dropdownOpen = !this.dropdownOpen;
}

selectSort(option: { value: string; label: string }) {
	this.selectedSortLabel = option.label;
	this.sort = option.value; 
	this.dropdownOpen = false;
  this.currentPage = 1;
	this.getCarData(); 
  this.updateUrlParams();
}

@HostListener('document:click', ['$event'])
onClickOutside(event: Event) {
	const target = event.target as HTMLElement;
	if (!target.closest('.cdrop')) {
		this.dropdownOpen = false;
	}
}
updateUrlParams() {
  const queryParams: any = {};

  // if(this.selectedBodytype) queryParams.body_type = this.selectedBodytype;
  // if(this.selectedBrand) queryParams.brand = this.selectedBrand;
  // if(this.selectedModel) queryParams.model = this.selectedModel;
  // if(this.pickuplocation) queryParams.pick_address = this.pickuplocation;
  // if(this.droplocation) queryParams.drop_address = this.droplocation;
  // if(this.availableStartDate) queryParams.startDate = this.availableStartDate;
  // if(this.availableendDate) queryParams.endDate = this.availableendDate;
  if(this.sort) queryParams.sort = this.sort;
  if(this.currentPage && this.currentPage > 1) queryParams.page = this.currentPage;

  this.router.navigate([], {
    relativeTo: this.route,
    queryParams,
    replaceUrl: true
  });
}
}
