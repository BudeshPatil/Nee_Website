import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ProjectService {

	constructor(private http: HttpClient) { }

	// getAllProjects = (data:any): Observable<any> => {
	//   const endpoint = environment.backendUrl+'/api/project/listprojects';
	//   return this.http.post(endpoint, data).pipe(
	//     catchError((err) => {
	//       return throwError(err);
	//     })
	//   );
	// };

	getAllProjects(page: number, limit: number): Observable<any> {
		const data = { page, limit };
		return this.http.post<any>(environment.baseUrl + '/api/project/listprojects', data).pipe(
			catchError(err => throwError(err))
		);
	}


	sendContactForm(data: any): Observable<any> {
		return this.http.post(`${environment.baseUrl}/api/project/referralmail`, data);
	}

	getProjectsByURL = (data:any): Observable<any> => {
	  const endpoint = environment.baseUrl+'/api/project/projectbyurlKey';
	  return this.http.post(endpoint, data).pipe(
	    catchError((err) => {
	      return throwError(err);
	    })
	  );
	};

}
