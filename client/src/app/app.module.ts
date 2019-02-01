import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// Angular Material stuff
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatSnackBarModule} from '@angular/material/snack-bar';
// end Angular Material stuff

import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavFrameComponent } from './sidenav-frame/sidenav-frame.component';
import { SearchDashboardComponent } from './search-dashboard/search-dashboard.component';
import { AddDashboardComponent } from './add-dashboard/add-dashboard.component';
import { ResultDisplayComponent } from './result-display/result-display.component';
import { SearchCommunicationService } from './core/services/search-communication.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { SeatRoomService } from './core/services/seat-room.service';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { ReservationHistoryComponent } from './reservation-history/reservation-history.component';
import { AuthenticationService } from './core/services/authentication.service';
import { AuthorizationInterceptorService } from './core/services/authentication-interceptor.service';
import { UnauthorizedInterceptorService } from './core/services/unauthorized-interceptor.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    SidenavFrameComponent,
    SearchDashboardComponent,
    AddDashboardComponent,
    ResultDisplayComponent,
    LoginRegisterComponent,
    ReservationHistoryComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatDividerModule,
    MatExpansionModule,
    MatChipsModule,
    MatSortModule,
    MatButtonToggleModule,
    MatSnackBarModule
  ],
  providers: [
    SearchCommunicationService,
    SeatRoomService,
    AuthenticationService,
    [{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptorService,
      multi: true,
    }],
    [{
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptorService,
      multi: true,
    }],
    [{
      provide: LocationStrategy, 
      useClass: HashLocationStrategy
    }]
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
