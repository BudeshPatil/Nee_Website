import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private http: HttpClient, private router: Router) { }

  //****************** Wishlist Start API's ***************//
  
    addWishlistItem = (moreData: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/wishlist/addNewWishlist';
      return this.http
        .post(endpoint, moreData)
        .pipe(
          catchError((err) => {
            return throwError(err);
          })
        );
    };
  
    RemoveWishlistItem = (moreData: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/wishlist/RemoveWishlistItem';
      return this.http
        .post(endpoint, moreData)
        .pipe(
          catchError((err) => {
            return throwError(err);
          })
        );
    };
  
    get_WishlistProductData = (data: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/wishlist/getProductWishlistbyUser';
      return this.http.post(endpoint, data).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    };
  
    //******************** Wishlist API's Ends ******************//
}
