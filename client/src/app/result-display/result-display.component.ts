import { Component, OnInit, Input } from '@angular/core';
import { SearchCommunicationService } from '../core/services/search-communication.service';
import { Subscription } from 'rxjs';
import { Seat } from '../core/models/Seat';
import { maximumBookableSeats, reservationUpdateDuration } from '../core/config-params';
import { Room } from '../core/models/Room';
import { Status } from '../core/models/ServiceResponse';
import { User, UserType } from '../core/models/User';
import { Reservation } from '../core/models/Reservation';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { SeatRoomService } from '../core/services/seat-room.service';
import { MatSnackBar } from '@angular/material';


@Component({
  selector: 'app-result-display',
  templateUrl: './result-display.component.html',
  styleUrls: ['./result-display.component.scss']
})
export class ResultDisplayComponent implements OnInit {

  user: User;
  status: string;
  displayStatusSubscription: Subscription;
  displayButtonSubscription: Subscription;

  isReserveButtonVisible: boolean;

  seats: Array<Seat>;
  selectedSeats: Array<Seat>;
  selectedRoom: Room;


  rooms: Room[];
  roomSelected: Room;

  constructor(private searchCommunicationService: SearchCommunicationService,
    private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    // setup
    status = Status.IDLE;
    this.seats = new Array();
    this.selectedSeats = new Array();
    this.user = new User();
    this.isReserveButtonVisible = true;

    this.user.userType = localStorage.getItem('userType');

    this.displayStatusSubscription = this.searchCommunicationService.searchStatus$.subscribe(
      response => {
        console.log(response);
        this.status = response.status;
        switch (this.status) {
          case Status.SHOW_SEATS: {
            this.seats = response.seats;
            console.log(response.seats);
            break;
          }
          case Status.SHOW_ROOMS: {
            this.rooms = response.rooms;
            console.log(response.rooms);
            break;
          }
        }
      }
    );
    this.displayButtonSubscription = this.searchCommunicationService.reserveButtonStatus$.subscribe(
      response => {
        if (response.status === Status.HIDE_RESERVE_BUTTON) {
          this.isReserveButtonVisible = false;
          this.snackBar.open('Only one active reservation at a time is allowed', null, { duration: 3000 });
        }
        if (response.status === Status.SHOW_RESERVE_BUTTON) {
          this.isReserveButtonVisible = true;
        }
      });
  }

  selectSeat($event, selectedSeat: Seat) {
    if (this.selectedSeats.includes(selectedSeat)) {
      console.log('uncheck');
      this.selectedSeats.splice(this.selectedSeats.indexOf(selectedSeat), 1);
    } else {
      if (this.selectedSeats.length < maximumBookableSeats) {
        this.selectedSeats.push(selectedSeat);
        console.log(this.selectedSeats);
      }
    }

    if (this.selectedSeats.length === maximumBookableSeats) {
      this.disableSelection();
    }
  }

  isCheckboxDisabled(seat: Seat): boolean {
    if ((this.selectedSeats.length >= maximumBookableSeats) && (this.selectedSeats.includes(seat) === false)) {
      return true;
    }
    return false;
  }

  disableSelection(): void {
    console.log('reached maximunm selected seat');
  }

  reserveRoom(roomSelected: Room) {
    // http service call reserve
    let reservation: Reservation;
    const expirationTime = Date.now() + reservationUpdateDuration;
    reservation = new Reservation(roomSelected.buildingName, roomSelected.floor, localStorage.getItem('currentUser'), expirationTime);
    this.searchCommunicationService.createRoomReservation(reservation, roomSelected);
  }

  reserveSeats() {
    // create a reservation
    let reservation: Reservation;
    console.log(this.selectedSeats.length);
    if (this.selectedSeats.length !== 0) {

      const expirationTime = Date.now() + reservationUpdateDuration; // Current datetime + 4 hours
      reservation = new Reservation(this.selectedSeats[0].buildingName, this.selectedSeats[0].floor,
        localStorage.getItem('currentUser'), expirationTime);
      this.searchCommunicationService.createSeatReservation(reservation, this.selectedSeats);
        this.selectedSeats = [];
        console.log('reservation happend');
    } else {
      this.snackBar.open('Select one or more seats to reserve.', null,
        { duration: 3000 });
    }
  }

  isUserAStudent(): boolean {
    return this.user.userType === UserType.STUDENT;
  }

  isUserASchoolStaff(): boolean {
    return this.user.userType === UserType.SCHOOL_STAFF;
  }

  deleteRoom(room: Room) {
    this.searchCommunicationService.deleteRoom(room);
    this.rooms.splice(this.rooms.indexOf(room), 1);
  }

  deleteSeat(seat: Seat) {
    this.searchCommunicationService.deleteSeat(seat);
    this.seats.splice(this.seats.indexOf(seat), 1);
  }

  isSeatVisible(seat: Seat) {
    return this.seats.includes(seat);
  }

  isRoomVisible(room: Room) {
    return this.rooms.includes(room);
  }

  isreservationPossible(): boolean {
    console.log(this.isReserveButtonVisible);
    return !this.isReserveButtonVisible;
  }

}
