import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Seat } from '../models/Seat';
import { ServiceResponse, Status } from '../models/ServiceResponse';
import { Filter, Resource } from '../models/Filter';
import { Room } from '../models/Room';
import { SeatRoomService } from './seat-room.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, UserType } from '../models/User';
import { environment } from 'src/environments/environment.prod';
import { map, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-type': 'application/json' })
};

interface LoginOutput {
    id: string;
    ttl: number;
    created: string;
    userId: string;
}

interface RegisterOutput {
    username: string;
    email: string;
    id: string;
    _rev: string;
}

@Injectable()
export class AuthenticationService {

    private studentEndpoint = environment.local_apiBaseUrl + '/api/Students';
    private studentLoginUrl = this.studentEndpoint + '/login';
    private studentLogoutUrl = this.studentEndpoint + '/logout';
    private studentRegisterUrl = this.studentEndpoint + '/register';

    private schoolStaffEndpoint = environment.local_apiBaseUrl + '/api/SchoolStaffs';
    private schoolStaffLoginUrl = this.schoolStaffEndpoint + '/login';
    private schoolStaffLogoutUrl = this.schoolStaffEndpoint + '/logout';

    constructor(private http: HttpClient) { }

    register(user: User): Observable<any> { // add the current user and the access toke to the local storage
        console.log('inside register');
        console.log(user);
        return this.http.post<any>(this.studentRegisterUrl, user, httpOptions).pipe(
            map(any => {
                // login succesful
                /* if (registerOutput.id && registerOutput.username) {
                    console.log('Registred successfully');
                }
                return registerOutput; */
            }),
            catchError(this.handleError<User>('loginCustomer'))
        );
    }

    loginStudent(user: User): Observable<any> { // add the current user and the access toke to the local storage
        console.log('inside login');
        console.log(user);
        return this.http.post<LoginOutput>(this.studentLoginUrl, user, httpOptions).pipe(
            map(loginOutput => {
                // login succesful
                if (loginOutput.id && loginOutput.userId) {
                    console.log(loginOutput);
                    localStorage.setItem('currentUser', loginOutput.userId);
                    localStorage.setItem('accessToken', loginOutput.id);
                    localStorage.setItem('userType', UserType.STUDENT);
                }
                return loginOutput;
            }),
            catchError(this.handleError<User>('loginCustomer'))
        );
    }

    loginSchoolStaff(user: User): Observable<any> { // add the current user and the access toke to the local storage
        console.log('inside login');
        console.log(user);
        return this.http.post<LoginOutput>(this.schoolStaffLoginUrl, user, httpOptions).pipe(
            map(loginOutput => {
                // login succesful
                if (loginOutput.id && loginOutput.userId) {
                    console.log(loginOutput);
                    localStorage.setItem('currentUser', loginOutput.userId);
                    localStorage.setItem('accessToken', loginOutput.id);
                    localStorage.setItem('userType', UserType.SCHOOL_STAFF);
                }
                return loginOutput;
            }),
            catchError(this.handleError<User>('loginCustomer'))
        );
    }

    logout(): void { // remove the current user and the access token from the local storage
        const accessToken = localStorage.getItem('accessToken');
        console.log(accessToken);
        console.log('inside AuthenticationService logout');
        console.log(this.studentLogoutUrl);
        const observable = this.http.post(this.studentLogoutUrl, httpOptions);
        observable.subscribe(() => {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('userType');
            console.log('successfully logged out user');
            // redirect to login
        });
    }

    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.log(error);
            // return the empty result so the application keeps running
            return of(result as T);
        };
    }
}

