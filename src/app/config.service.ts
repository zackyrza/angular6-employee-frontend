import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

export interface Employee {
  createdDate: string;
  divisionId: number;
  id: number;
  lastPosition: string;
  name: string;
  nik: string;
  positionId: number;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  // apiUrl = 'https://spring-boot-angular6.herokuapp.com';
  apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  async getData() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/employees`, {headers: {Accept: '*/*'}})
        .pipe(
          catchError(this.handleError)
        )
        .subscribe((data) => {
          console.log(data, '=========== res');
          resolve(data);
        });
    });
  }

  getDataDetail(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/employees/${id}`, {headers: {Accept: '*/*'}})
        .pipe(
          catchError(this.handleError)
        )
        .subscribe((data) => {
          console.log(data, '=========== res');
          resolve(data);
        });
    });
  }

  async createOrUpdateData(body: Employee) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.apiUrl}/employees`, body, {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        }
      })
        .pipe(
          catchError(this.handleError)
        )
        .subscribe((data) => {
          console.log(data, '=========== res');
          resolve(data);
        });
    });
  }

  deleteData(id: number) {
    return new Promise((resolve, reject) => {
      this.http.delete(`${this.apiUrl}/employees/${id}`, {headers: {Accept: '*/*'}})
        .pipe(
          catchError(this.handleError)
        )
        .subscribe((data) => {
          console.log(data, '=========== res');
          resolve(data);
        });
    });
  }

  getDivisions() {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/division`, {headers: {Accept: '*/*'}})
        .pipe(
          catchError(this.handleError)
        )
        .subscribe((data) => {
          console.log(data, '=========== res');
          resolve(data);
        });
    });
  }

  getDivisionDetail(id: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.apiUrl}/division/${id}`, {headers: {Accept: '*/*'}})
        .pipe(
          catchError(this.handleError)
        )
        .subscribe((data) => {
          console.log(data, '=========== res');
          resolve(data);
        });
    });
  }

  getPositions() {
    return new Promise(resolve => {
      this.http.get(`${this.apiUrl}/position`, {headers: {Accept: '*/*'}})
        .pipe(
          catchError(this.handleError)
        )
        .subscribe((data) => {
          console.log(data, '=========== res');
          resolve(data);
        });
    });
  }

  getPositionDetail(id: string) {
    return new Promise(resolve => {
      this.http.get(`${this.apiUrl}/position/${id}`, {headers: {Accept: '*/*'}})
        .pipe(
          catchError(this.handleError)
        )
        .subscribe((data) => {
          console.log(data, '=========== res');
          resolve(data);
        });
    });
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

}
