import { Component, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DataService } from '../../providers/data/data.service';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {
  @Input() h2: string = 'explore our premium brands';
  @Input() titleClass: string = 'text-center size22 performa-light text-capitalize mb-5';
  @Input() buttonTitle: string = 'show all';
  imageURL: string = `${environment.url}/assets/brands`;
  backendURl = `${environment.baseUrl}/public`;
  brandsData: any = [];
  brands = [
    { name: 'Bentley', imageUrl: `${this.imageURL}/bentley.png` },
    { name: 'BMW', imageUrl: `${this.imageURL}/bmw.png` },
    { name: 'Ferrari', imageUrl: `${this.imageURL}/ferrari.png` },
    { name: 'Land Rover', imageUrl: `${this.imageURL}/landrover.png` },
    { name: 'McLaren', imageUrl: `${this.imageURL}/mclaren.png` },
    { name: 'Mercedes', imageUrl: `${this.imageURL}/Mercedes.png` },
    { name: 'Porsche', imageUrl: `${this.imageURL}/porche.png` },
    { name: 'Rolls Royce', imageUrl: `${this.imageURL}/rolls_royce.png` }
  ];

  constructor(public dataservice: DataService) {

  }

  ngOnInit() {
    this.getBrands();
  }

  getBrands() {
    let obj = {
      type: 'car'
    };
    this.dataservice.getBrands(obj).subscribe((response) => {
      if (response.code == 200) {
        if (response.result && response.result.length > 0) {
          response.result.forEach((brand, index) => {
            // if(brand && brand.type =='Car' && brand.image && brand.image.length > 0 && this.brandsData.length < 8 ){
            if (brand && brand.type === 'Car' && brand.image && brand.image.length > 0) {
              this.brandsData.push(brand);
            }
          });
        }
      }
    });
  }
}
