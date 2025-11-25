import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient, private router: Router) { }

  getAllProduct = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getAllProduct';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getDisplayonProduct = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getfrountproduct';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getHomeProductData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getfrounthomepageproduct';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  // Single product Api

  getProductWithId = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getsingleproduct';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getProductWithUrlKey = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getsingleproductwithurlkey';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //Not Using
  getProductByartCreated = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getProductByartCreated';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getProductall = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getProductall';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getSearchedProduct = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getfilteredproduct';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  getProductsWithProdIds = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/getProductsWithProdIds';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getDisplayonHomeProductDetails = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/displayonhomeproducts';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateProductCount = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/product/updateProductCount';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //*********************** Review Starts API's  *************/

  addProductReview = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/review/addProductReview';
    return this.http
      .post(endpoint, moreData)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  getProductApprovedReview = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/review/getProductApprovedReview';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  //*********************** Review End API's ********************/

  //********************* APM Starts API's******************** */

  addAPMrecords = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/apm/addapm';
    return this.http
      .post(endpoint, moreData)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  //********************* APM End API's******************** */

  logout() {
    localStorage.clear();
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  protected getRequestHeaders(): {
    headers: HttpHeaders | { [header: string]: string | string[] };
  } {
    let headers;
    const token = localStorage.getItem('ghost-rental-web-token');
    headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return { headers: headers };
  }

}
