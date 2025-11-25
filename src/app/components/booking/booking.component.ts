import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.scss'
})
export class BookingComponent {
// Make Math available in template
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
  url_key:any;
  carTypes: any = [];
  vehicle_type:any;
  selectedbannerpage = 'product';
  selectedBodytype:any;
  selectedBrand:any;
  selectedModel:any;
  pickuplocation:any;
  droplocation:any;
  availableStartDate:any;
  availableendDate:any;
  listBodytype: any = [];
  filteredBodytype: any = [];
  listModels: any = [];
  filteredModels: any = [];
  listBrands: any = [];
  filteredBrands: any = [];
  locationData: any = [];
  filterPickupLocation: any = [];
  filterDropLocation: any = [];
  sort:any;
  constructor(
    private dataservice: DataService,
    public route: ActivatedRoute,
    public router: Router,
  ) {
    this.url_key = this.route.snapshot.paramMap.get('car_type');
  }
  // ngOnInit() {
  //   this.route.queryParams.subscribe(params => {
  //     this.vehicle_type = params['vehicle'];
  //     this.selectedBodytype = params['body_type'];
  //     this.selectedBrand = params['brand'];
  //     this.selectedModel = params['model'];
  //     this.pickuplocation = params['pick_address'];
  //     this.droplocation = params['drop_address'];
  //     this.availableStartDate = params['startDate'];
  //     this.availableendDate = params['endDate'];
  //   });

  //   // Read from route data (cars / yachts from route config)
  // const routeVehicleType = this.route.snapshot.data['vehicleType'];
  // if (routeVehicleType) {
  //   this.vehicle_type = routeVehicleType;   // override from route
  // }

  //   this.getBodyTypes();
  //   this.getModels();
  //   this.getBrands();
  //   this.getLocations();
  //   if(this.url_key){
  //     this.getCarTypes();
  //   } else {
  //     this.getCarData();
  //   }    
  //   if(this.vehicle_type){
  //     this.selectedbannerpage = this.vehicle_type;
  //   }
  //   this.getBannerData();
  // }

  
  ngOnInit() {
    this.route.data.subscribe(data => {
      if (data['vehicleType']) {
        this.vehicle_type = data['vehicleType'];
        this.selectedbannerpage = this.vehicle_type;
        if(this.vehicle_type == 'Car'){
          this.getAllCars();
        }
        else if(this.vehicle_type == 'Yachts'){
          this.getAllYachts();
        }
        this.getBannerData();
      }
    });
  
    // ✅ Query params
    this.route.queryParams.subscribe(params => {
      this.selectedBodytype = params['body_type'];
      this.selectedBrand = params['brand'];
      this.selectedModel = params['model'];
      this.pickuplocation = params['pick_address'];
      this.droplocation = params['drop_address'];
      this.availableStartDate = params['startDate'];
      this.availableendDate = params['endDate'];

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
    this.getBodyTypes();
    this.getModels();
    this.getBrands();
    this.getLocations();
  
    if (this.url_key) {
      this.getCarTypes();
    } else {
      this.getAllCars();
      this.getAllYachts();
    }
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
      // this.getCarData();
      this.getAllCars();
      this.getAllYachts();
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

  getBodyTypes() {
    let obj = {};
    this.dataservice.getAllBodyTypes(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          this.listBodytype = response.result;
          if (this.listBodytype && this.listBodytype.length > 0) {
            let temp = this.listBodytype.filter((bodytype) => bodytype.url_key == this.selectedBodytype);
            if(temp && temp.length > 0 && temp[0]){
              this.filteredBodytype.push(temp[0]._id);
            }
            // this.getCarData();
            this.getAllCars();
            this.getAllYachts();
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
            let temp = this.listModels.filter((bodytype) => bodytype.url_key == this.selectedModel);
            if(temp && temp.length > 0 && temp[0]){
              this.filteredModels.push(temp[0]._id);
            }
            // this.getCarData();
            this.getAllCars();
            this.getAllYachts();
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
            let temp = this.listBrands.filter((bodytype) => bodytype.url_key == this.selectedBrand);
            if(temp && temp.length > 0 && temp[0]){
              this.filteredBrands.push(temp[0]._id);
            }
            // this.getCarData();
            this.getAllCars();
            this.getAllYachts();
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
          if (this.locationData && this.locationData.length > 0) {
            let temp = this.locationData.filter((location) => location.name == this.pickuplocation);
            if(temp && temp.length > 0 && temp[0] && this.pickuplocation){
              this.filterPickupLocation.push({ _id:temp[0]._id,name: temp[0].name});
            }
            temp = this.locationData.filter((location) => location.name == this.droplocation);
            if(temp && temp.length > 0 && temp[0] && this.droplocation){
              this.filterDropLocation.push({ _id:temp[0]._id,name: temp[0].name});
            }
            // this.getCarData();
            this.getAllCars();
            this.getAllYachts();
          }
        }
      }
    });
  }
  

  // getCarData() {

  //   let obj = {
  //     limit: this.currentLimit,
  //     page: this.currentPage,
  //     availabilityStatus: 'available',
  //     vehicle_type: this.vehicle_type,
  //     car_type : this.carTypes,
  //     bodyTypeId: this.filteredBodytype,
  //     brandId: this.filteredBrands,
  //     modelId:this.filteredModels,
  //     startDate: this.availableStartDate,
  //     endDate: this.availableendDate,
  //     sort: this.sort,
  //     pickuplocation: this.filterPickupLocation,
  //     droplocation: this.filterDropLocation
  //   };
  //   this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
  //     if (response.code == 200) {
  //       this.totolvehicle = response.count;          
  //       this.totalItems = response.count;
  //       if (response.result && response.result.length > 0) {
  //         this.vehicleData = response.result;
  //         this.updatePagedCars();
  //       } else{
  //         this.totolvehicle = 0;
  //         this.vehicleData = [];
  //         this.totalItems = 0;
  //       }
  //     }
  //   });
  // }

  getAllCars() {
    const obj = {
      limit: 1000, // or a very high number to get all cars
      page: 1,
      availabilityStatus: 'available',
      vehicle_type: this.vehicle_type, // optional, or leave undefined to get all types
      car_type: [],  // empty = no filter
      bodyTypeId: [], 
      brandId: [],
      modelId: [],
      startDate: null,
      endDate: null,
      sort: null,
      pickuplocation: [],
      droplocation: []
    };
  
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code === 200) {
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result;
          this.totalItems = response.count;
          this.totolvehicle = response.count;
          this.updatePagedCars();
        } else {
          this.vehicleData = [];
          this.totalItems = 0;
          this.totolvehicle = 0;
        }
      }
    });
  }
  getAllYachts() {
    const obj = {
      limit: 1000, // or a very high number to get all cars
      page: 1,
      availabilityStatus: 'available',
      vehicle_type: this.vehicle_type, // optional, or leave undefined to get all types
      car_type: [],  // empty = no filter
      bodyTypeId: [], 
      brandId: [],
      modelId: [],
      startDate: null,
      endDate: null,
      sort: null,
      pickuplocation: [],
      droplocation: []
    };
  
    this.dataservice.getFilterdVehicles(obj).subscribe((response) => {
      if (response.code === 200) {
        if (response.result && response.result.length > 0) {
          this.vehicleData = response.result;
          this.totalItems = response.count;
          this.totolvehicle = response.count;
          this.updatePagedCars();
        } else {
          this.vehicleData = [];
          this.totalItems = 0;
          this.totolvehicle = 0;
        }
      }
    });
  }
  

  onChangeSort(data) {
     if (data?.target?.value) {
      this.sort = data.target.value;
      // this.getCarData(); 
      this.getAllCars();
      this.getAllYachts();
     }
  }

  getBannerData(){
    let obj = {};
    this.dataservice.getAllBanner(obj).subscribe((response) => {
      if (response.code == 200) {
        if(response.result && response.result.length > 0){
          response.result.forEach(banner => {
            if(banner && banner.status && banner.page == this.selectedbannerpage){
              this.bannerData = banner;
            }
          });        
        }
      }
    });
  }

  getCarTypes(){
    let obj = {
      url_key : this.url_key
    };
    this.dataservice.getCarTypeByURL(obj).subscribe((response) => {
      if (response.code == 200) {
        if(response.result && response.result.length > 0){
          this.cartypeData = response.result[0];
          if(this.cartypeData){
            this.carTypes.push(this.cartypeData._id);
            this.selectedbannerpage = this.cartypeData.name;
            // this.getCarData();
            this.getAllCars();
            this.getAllYachts();
            this.getBannerData();
          }          
        }
      }
    });
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
    this.dropdownOpen = !this.dropdownOpen;
  }

  selectSort(option: { value: string; label: string }) {
    this.selectedSortLabel = option.label;
    this.sort = option.value;
    this.dropdownOpen = false;
    this.currentPage = 1; 
    // this.getCarData();
    this.getAllCars();
    this.getAllYachts();
    this.updateUrlParams();
  }

  async resetFilter() {
    this.sort = null;
    this.selectedSortLabel = null;
    this.currentPage = 1;
    this.getAllCars();
    this.getAllYachts();
    this.updateUrlParams();
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
