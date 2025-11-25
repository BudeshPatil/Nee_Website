import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private http: HttpClient, private router: Router) { }

  //****************** Blog Data API's Starts**************************//
    getblogDetails = (data: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/blog/blogdetail';
      return this.http.post(endpoint, data).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    };
  
    getAllblog = (data: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/blog/allblog';
      return this.http.post(endpoint, data).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    };
  
    getblogWithId = (moreData: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/blog/getblogWithId';
      return this.http
        .post(endpoint, moreData, { observe: 'response' as 'body' })
        .pipe(
          catchError((err) => {
            return throwError(err);
          })
        );
    };
  
    getNextblogWithId = (moreData: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/blog/nextblogdetail';
      return this.http
        .post(endpoint, moreData, { observe: 'response' as 'body' })
        .pipe(
          catchError((err) => {
            return throwError(err);
          })
        );
    };
  
    getBlogWithString = (moreData: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/blog/searchblog';
      return this.http
        .post(endpoint, moreData, { observe: 'response' as 'body' })
        .pipe(
          catchError((err) => {
            return throwError(err);
          })
        );
    };
  
    getAllvideoBlog = (data: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/blog/allvideoblog';
      return this.http.post(endpoint, data).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    };
  
    getTagDetails = (data: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/blog/viewtag';
      return this.http.post(endpoint, data).pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
    };
  
    getTagBlogWithId = (moreData: any): Observable<any> => {
      const endpoint = environment.baseUrl + '/api/blog/taglisting';
      return this.http
        .post(endpoint, moreData, { observe: 'response' as 'body' })
        .pipe(
          catchError((err) => {
            return throwError(err);
          })
        );
    };
  
    //****************** Blog Data API's Ends**************************//

    //****************** Author Data API's Starts**************************/
  getauthorWithId = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/blog/authordetails';
    return this.http
      .post(endpoint, moreData, { observe: 'response' as 'body' })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };
  //****************** Author Data API's Ends**************************//

  //****************** Comments Data API's Starts**************************//
  addComment = (moreData: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/comment/add';
    return this.http
      .post(endpoint, moreData, { observe: 'response' as 'body' })
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  };

  getCommentDetails = (data: any): Observable<any> => {
    const endpoint = environment.baseUrl + '/api/comment/viewcomment';
    return this.http.post(endpoint, data).pipe(
      catchError((err) => {
        return throwError(err);
      })
    );
  };

  //****************** Comments Data API's Ends**************************//
}
