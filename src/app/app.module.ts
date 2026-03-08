import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { Error404Component } from './error404/error404.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { register } from 'swiper/element/bundle';

// Register Swiper components
register();

import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { ServicesComponent } from './components/services/services.component';
// ✅ Correct Lucide import
import { LucideAngularModule, Pencil, Search, Home, Minus, Plus, X } from 'lucide-angular';
import { AboutComponent } from './components/about/about.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPayPalModule } from 'ngx-paypal';
import {SwiperSliderComponent} from './components/swiper-slider/swiper-slider.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { JournalComponent } from './components/journal/journal.component';
import { JournalDetailComponent } from './components/journal-detail/journal-detail.component';
import { CommonModule } from '@angular/common';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { FilterByCategoryPipe } from './pipe/filter-by-category.pipe';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ServiceDetailsComponent } from './components/services/service-details/service-details.component';
import { ProjectDetailsComponent } from './components/portfolio/project-details/project-details.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    Error404Component,
    TestimonialsComponent,
    ServicesComponent,
    AboutComponent,
    SwiperSliderComponent,
    PortfolioComponent,
    JournalComponent,
    JournalDetailComponent,
		FilterByCategoryPipe,
  ServiceDetailsComponent,
  ProjectDetailsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgbModule,
    NgxSpinnerModule,
    NgxPayPalModule,
    ReactiveFormsModule,
    CommonModule,
    NgxIntlTelInputModule,
    LucideAngularModule.pick({
      Pencil,
      Search,
      Home,
      Minus,
      Plus,
      X,
    })
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
