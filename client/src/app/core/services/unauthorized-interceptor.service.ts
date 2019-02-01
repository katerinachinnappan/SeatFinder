import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

@Injectable()

export class UnauthorizedInterceptorService {

    constructor(private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return <any>next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // if you want to do anything with a succesful response...
                    return event;
                }
            }),
            catchError(this.handleError('UnauthorizedInterceptorService', [])
            ));
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                    // redirect to login
                    this.router.navigate(['/login']);
                }
            } // return the empty result so the application keeps running
            return of(result as T);
        };
    }
}
