import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient, private router: Router) { }

  //****************** Download API's Starts **************************/
  getDownloadLink = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/home/download';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //****************** Download API's Ends **************************/

  //****************** Banner Data API's Starts **************************/
  getAllBanner = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/banner/getAllBanner';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  /* ********************** get all about********************************** */
  getAllAbout = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/about/getAllAbout';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  /* ********************** get all about********************************** */

  /* ********************** get all services********************************** */
  getAllService = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/service/allservices';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  /* ********************** get all services********************************** */
  getAllShopBy = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/shopby/getAllShopby';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //****************** Banner Data API's Ends**************************/

  //****************** Address Data API's **************************/

  getshippingMethods = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/shipping/getfrontShipping';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getshippingMethodsByType = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/shipping/getShippingbytype';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  //****************** Address Data API's Ends**************************/

  //****************** Configtata Data API's Starts**************************//

  getTaxData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/config/getTax';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getAllConfig = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/config/getAllConfig';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //****************** Configtata Data API's Ends**************************//

  //****************** Events Data API's Starts**************************//

  getAllEvents = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/event/getfrontevent';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getEventsByURLKey = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/event/geteventapply';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //****************** Events Data API's Ends**************************//


  //************************ Size and Colour API's **************/
  getAllColours = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/colour/getfrontColour';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getAllSizes = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/size/getfrontSize';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };



  addEmailSubscribe = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/user/addEmailSubscribe';
    return this.http
      .post(endpoint, moreData)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  //****************** Walltet Transaction Data API's Ends**************************//

  getWalletTransactions = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/wallet/getwallettransaction';
    return this.http.post(endpoint, data, this.getRequestHeaders()).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //**************************** Cart API's *****************************************//

  getAllPromocode = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/promocode/getfrontpromocode';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  getPromocodeApply = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/promocode/getpromocodeapply';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //*********************** Best Selling API's ************************//

  getAllBestSelling = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/bestselling/getAllBestselling';
    return this.http.post(endpoint, data).pipe(
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
    const token = localStorage.getItem('neelgund-web-token');
    headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return { headers: headers };

  }
  // getAllClients = (data: any): Observable<any> => {
  //   const endpoint = environment.baseUrl + '/api/client/getallClients';
  //   return this.http.post(endpoint, data).pipe(
  //     catchError((err) => {
  //       return throwError(err);
  //     })
  //   );
  // }
  getAllClients = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/tvshow/getAllTvshow';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  getcounterData = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/counter/getAllcounter';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };
  getAllProjects(data: any): Observable<any> {
    const endpoint = environment.baseUrl + '/api/project/listprojects';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
getAllServiceProjects(data: any): Observable<any> {
    const endpoint = environment.baseUrl + '/api/project/projects-dos';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }
  
  getAllHomeProjects(data: any): Observable<any> {
    const endpoint = environment.baseUrl + '/api/project/projects-doh';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  }

getAlltestimonial = (data:any): Observable<any> => {
    const endpoint = environment.baseUrl+'/api/home/alltestimonial';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    ); 
  };


}


