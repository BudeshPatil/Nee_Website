import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }

  validateLogin = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/login';
    return this.http
      .post(endpoint, moreData, { observe: 'response' as 'body' })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  customerRegistration = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/registerCustomer';
    return this.http
      .post(endpoint, moreData, { observe: 'response' as 'body' })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  getLogincustomer = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/checklogincustomer';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getLoginCustomerData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/getfrontCustomerData';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  editProfiledata = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/editProfiledata';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  ResetPasswordLink = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/resetcustomerpasswordlink';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  SendEmailVerification = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/SendEmailVerification';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  update_mailVeryfication = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/updateMailVeryfication';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updatecustomerData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/activeaccount';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateNewPassword = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/updateNewPassword';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  activateCustomerData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/activeaccount';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  ForgotPasswordLink = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/forgotcustomerpasswordlink';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  updateForgotPassword = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/updateforgotpassword';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  checkCustomerSession = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/checkcustomersessions';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  guestLogin = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/guestlogin';
    return this.http
      .post(endpoint, moreData, { observe: 'response' as 'body' })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  socialLoginUseRegistration = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/socailloginregister';
    return this.http
      .post(endpoint, moreData, { observe: 'response' as 'body' })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  addNewAddress = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/addNewAddress';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  checkIsvalidWalletBalance = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/customer/checkValidWallet';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
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

  // private setSession(authResult:any) {
  //   const expiresAt = moment().add(authResult.expiresIn,'second');

  //   localStorage.setItem('id_token', authResult.idToken);
  //   localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
  // } 

}
