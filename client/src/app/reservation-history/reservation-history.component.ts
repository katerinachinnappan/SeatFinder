import { Component, OnInit } from '@angular/core';
import { Status, ServiceResponse, } from '../core/models/ServiceResponse';
import { Reservation } from '../core/models/Reservation';
import { SeatRoomService } from '../core/services/seat-room.service';
import { User, UserType } from '../core/models/User';

interface String {
  format(...replacements: string[]): string;
}

@Component({
  selector: 'app-reservation-history',
  templateUrl: './reservation-history.component.html',
  styleUrls: ['./reservation-history.component.scss']
})
export class ReservationHistoryComponent implements OnInit {

  status: string;
  user: User;
  reservations: Reservation[];

  constructor(private seatRoomService: SeatRoomService) {
    this.status = Status.SHOW_RESERVATIONS;
  }

  ngOnInit() {
    this.user = new User();

    this.user.userType = localStorage.getItem('userType');
    console.log(this.user.userType);
    console.log(localStorage.getItem('currentUser'));
    this.getReservation();
  }

  getReservation() {
    console.log('getting reservations for user: ', localStorage.getItem('currentUser'));

    this.seatRoomService.getReservations(localStorage.getItem('currentUser')).subscribe(
      reservations => {
        // tslint:disable-next-line:prefer-const
        this.reservations = reservations.sort((x,y) => {
          if (x.expirationTime < y.expirationTime) return 1;
          else if (x.expirationTime > y.expirationTime) return -1;
          else return 0;
        });
        this.convertDateTime();
      }
    );
  }
  deleteReservation(reservation: Reservation){
    console.log("deleting reservation");
    this.seatRoomService.deleteReservation(reservation);
    this.reservations.splice(this.reservations.indexOf(reservation), 1);
  }

  isReservationActive(reservation: Reservation): boolean {

    if(reservation.expirationTime < Date.now()){
      return false;
    }
    else{
      return true;
    }
  }

  updateReservation(reservation: Reservation) {
    if(!this.isReservationActive(reservation)){
      // toast: is not active
    }
    else {
      const temp = reservation.expirationTime + 4 * 60 * 60 * 1000;
      this.seatRoomService.updateReservation(reservation, temp).subscribe();
      this.convertDateTime();
    }
  }

  float2int(value) {
    return value | 0;
  }

  convertDateTime() {
    this.reservations.forEach(reservation => {
      const millis: number = Number(reservation.expirationTime);
      const date: Date = new Date(millis);
      reservation.date = date.toDateString();
      reservation.time = date.toLocaleTimeString();
    });
  }
}




