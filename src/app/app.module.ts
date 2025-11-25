import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { Error404Component } from './error404/error404.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrandsComponent } from './shared/brands/brands.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { ServicesComponent } from './components/services/services.component';

import { LucideAngularModule, Fuel, CalendarDays, RockingChair, Gauge, Star, ArrowRight, ArrowLeft, Minus, Plus, ChevronLeft, ChevronRight, X, Home, Users, Settings, Car, Phone, Facebook, Instagram, Twitter, Clock    } from 'lucide-angular';
import { BookingComponent } from './components/booking/booking.component';
import { SharedModule } from './shared/shared.module';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { LocationComponent } from './location/location.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ContactComponent } from './components/contact/contact.component';
// import { SchemaService } from './providers/schema/schema.service';
// import { DemoComponent } from './components/demo/demo.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    HeaderComponent,
    FooterComponent,
    Error404Component,
    BrandsComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    ServicesComponent,
    LocationComponent,
    LoadingComponent,
    // DemoComponent,
    BookingComponent,
		ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    NgxSliderModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    LucideAngularModule.pick({ Fuel, CalendarDays, RockingChair, Gauge, Star, ArrowRight, ArrowLeft, Plus, Minus, ChevronLeft, ChevronRight, X, Home, Users, Settings, Car, Phone, Facebook, Instagram, Twitter, Clock }),
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    provideAnimations(),
		// SchemaService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
