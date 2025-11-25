import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private router: Router) { }

  addCartItem = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/cart/addCartItemWithCustomer';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  addCartLoginItem = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/cart/addCartCustomerLoginItem';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getCartWithId = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/cart/getCartWithcustomerId';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getCartWithLogin = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/cart/getCustomerCartWithLogin';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  UpdateCartQty = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/cart/UpdatecustomerCartQty';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  removeCart = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/cart/removecustomerCart';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  logout()
  {
    localStorage.clear();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    }); 
  }

}
