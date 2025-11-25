import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { SearchComponent } from './search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { LucideAngularModule, ArrowLeft, ArrowRight, Minus, Plus, Star, CalendarDays, ChevronDown, Crown } from 'lucide-angular';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

@NgModule({
  declarations: [
    ListComponent,
    DetailComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxSliderModule,
    LucideAngularModule.pick({ Star, ArrowRight, ArrowLeft, Plus, Minus, CalendarDays, ChevronDown, Crown }),
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductModule { }
