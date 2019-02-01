import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthenticationService } from '../core/services/authentication.service';
import { UserType } from '../core/models/User';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-sidenav-frame',
  templateUrl: './sidenav-frame.component.html',
  styleUrls: ['./sidenav-frame.component.scss']
})
export class SidenavFrameComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('currentUser') != null &&
      localStorage.getItem('accessToken') != null &&
      localStorage.getItem('userType') != null;
  }

  getUserLoggedInType(): string {
    return localStorage.getItem('userType');
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logout(): void {
    console.log('sidenavbar logout button');
    this.authenticationService.logout();
    this.snackBar.open('User successfully logged out', null,
    { duration: 3000 });
  }

  toggleSideNav(navBarReference: any): void {
    navBarReference.toggle();
  }

}
