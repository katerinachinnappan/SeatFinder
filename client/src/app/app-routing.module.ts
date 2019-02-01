import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { SearchDashboardComponent } from './search-dashboard/search-dashboard.component';
import { AddDashboardComponent } from './add-dashboard/add-dashboard.component';
import { LoginRegisterComponent } from './login-register/login-register.component';
import { ReservationHistoryComponent } from './reservation-history/reservation-history.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'search', component: SearchDashboardComponent },
  { path: 'add', component: AddDashboardComponent },
  { path: 'login', component: LoginRegisterComponent },
  { path: 'history', component: ReservationHistoryComponent},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
