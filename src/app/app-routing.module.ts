import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Error404Component } from './error404/error404.component';
import { AboutComponent } from './components/about/about.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { ServicesComponent } from './components/services/services.component';
import { BookingComponent } from './components/booking/booking.component';
import { LocationComponent } from './location/location.component';
import { ContactComponent } from './components/contact/contact.component';
// import { DemoComponent } from './components/demo/demo.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  // {
  //   path: 'demo',
  //   component: DemoComponent
  // },
  {
    path: 'Locations',
    component: LocationComponent
  },
  {
    path: 'Reviews',
    component: LocationComponent
  },
  {
    path: 'Instagrams',
    component: LocationComponent
  },
  {
    path: 'Facebooks',
    component: LocationComponent
  },
  {
    path: 'Linkedins',
    component: LocationComponent
  },
  {
    path: 'ContactUs',
    component: LocationComponent
  },
  {
    path: 'TikToks',
    component: LocationComponent
  },
  {
    path: 'YouTubes',
    component: LocationComponent
  },
  {
    path: 'ViewYachts',
    component: LocationComponent
  },
  {
    path: 'ViewCars',
    component: LocationComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  // {
  //   path: 'booking',
  //   component: Error404Component,
  // },
  // {
  //   path: 'booking/cars',
  //   component: BookingComponent,
  //   data: { vehicleType: 'Car' }
  // },
  // {
  //   path: 'booking/yachts',
  //   component: BookingComponent,
  //   data: { vehicleType: 'Yachts' }
  // },
  // {
  //   path: 'booking/:type',
  //   component: BookingComponent
  // },
  {
    path: 'services',
    component: ServicesComponent
  },
  {
    path: 'product',
    loadChildren: () => import('./components/product/product.module').then(m => m.ProductModule)
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'privacy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms',
    component: TermsAndConditionsComponent
  },
  {
    path: '**',
    component: Error404Component
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
