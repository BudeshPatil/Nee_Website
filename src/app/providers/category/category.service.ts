import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
@Injectable({
	providedIn: 'root'
})
export class CategoryService {
	private categoriesSubject = new BehaviorSubject<any[]>([]);
	categories$ = this.categoriesSubject.asObservable();
	private loaded = false;
	constructor(
		private http: HttpClient,
		private router: Router
	) { }

	getAllCategory = (data: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/category/getAllCategory';
		return this.http.post(endpoint, data).pipe(
			catchError((err) => {
				return throwError(err);
			})
		);
	};

	getCollectionTypekey = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/collection/getCollectionWithURLKey';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

	getCategoryurlkey = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/category/categorybyUrlKey';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

	getSubCategoryurlkey = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/subcategory/subcategorybyUrlKey';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

	getSubCategory = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/subcategory/getallsubcategory';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

	getAllCollections = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/collection/getAllCollection';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

	getAllCategorycollections = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/collectioncategory/getAllCollectionCategory';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			)
	}

	getCategoryCollectionByURL = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/collectioncategory/getCollectionCategoryWithURLKey';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			)
	}

	getCollectionswithCategory = (moreData: any): Observable<any> => {
		const endpoint = environment.baseUrl + '/api/collection/getcollectionwithcategory';
		return this.http
			.post(endpoint, moreData)
			.pipe(
				catchError((err) => {
					return throwError(err);
				})
			);
	};

}
