import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private router: Router) { }

  addNewOrder = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/order/addNewOrder';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getOrderData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/order/getOrderData';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getCurrentOrderData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/order/getCurrentOrderData';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getPastOrderData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/order/getPastOrderData';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };


  getOrderDataById = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/order/getOrderDataByOrderId';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getOrderHistory = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/order/getOrderHistoryData';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  cancelOrder = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/order/cancelOrder';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //************************** Return API's *******************************//

  getReturnDetails = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/return/getRmaByCustomer';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getRMADetailsByKey = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/return/getRmaBykey';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getReasonsData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/return/getallreason';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  addReturn = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/return/returnadd';
    return this.http.post(endpoint, moreData, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  editReturndata = (moreData: any, Id: any): Observable<any> => {
    let endpoint = environment.baseUrl + '/api/return/returnedit';
    if (Id) {
      endpoint += `?id=${Id}`;
    }
    return this.http.post(endpoint, moreData, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

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
