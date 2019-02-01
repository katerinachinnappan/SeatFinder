import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Seat } from '../models/Seat';
import { ServiceResponse, Status } from '../models/ServiceResponse';
import { Filter, Resource } from '../models/Filter';
import { Room } from '../models/Room';
import { ItemType } from '../models/ItemType';
import { SeatRoomService } from './seat-room.service';
import { Reservation } from '../models/Reservation';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';


@Injectable()
export class SearchCommunicationService {

  seats: Seat[];
  rooms: Room[];
  items: ItemType[];
  reservations: Reservation;
  rcount: number;


  constructor(private seatRoomService: SeatRoomService,
    private router: Router, private snackBar: MatSnackBar) { }

  // Observable string sources
  private searchSubmittedStatusSource = new Subject<ServiceResponse>();
  private checkActiveReservationSource = new Subject<ServiceResponse>();

  // Observable string streams
  public searchStatus$ = this.searchSubmittedStatusSource.asObservable();
  public reserveButtonStatus$ = this.checkActiveReservationSource.asObservable();

  // Service message commands
  submitSearch(search: Filter) {
    // http stuff
    // tslint:disable-next-line:prefer-const
    if (search.resourse === Resource.ROOM) {
      console.log('search', search.itemList);
      this.getRoom(search.floor, search.buildingName, search.itemList);
    } else {
      this.getSeat(search.floor, search.buildingName);
    }
    console.log(search);
        //count how many total reservations there are
    this.countReservations(localStorage.getItem('currentUser'));
  }

  getSeat(floor: number, buildingName: string): void {
    this.seatRoomService.getSeats(floor, buildingName)
      .pipe()
      .subscribe(seats => {
        // tslint:disable-next-line:prefer-const
        let response: ServiceResponse = new ServiceResponse();
        response.status = Status.SHOW_SEATS;
        response.seats = seats;
        this.searchSubmittedStatusSource.next(response);
      });
  }

  getRoom(floor: number, buildingName: string, itemName: string[]): void {
    this.seatRoomService.getRooms(floor, buildingName, itemName).pipe()
      .subscribe(rooms => {
        // tslint:disable-next-line:prefer-const
        let response: ServiceResponse = new ServiceResponse();
        response.status = Status.SHOW_ROOMS;
        response.rooms = rooms;
        this.searchSubmittedStatusSource.next(response);
      });
  }

  createSeatReservation(reservation: Reservation, seatSelected: Seat[]): void {
    console.log('creating reservation');
    console.log('selected seat: ', seatSelected);

    this.seatRoomService.createReservation(reservation).subscribe(
      data => {
        reservation = data;
        (async () => {
          for (let i = 0; i < seatSelected.length; i++) {
            await delay(1500);
            this.seatRoomService.addSeatToReservation(reservation, seatSelected[i].id).subscribe();
          }
        })();
        this.snackBar.open('Reservation created succsessfully', null, { duration: 3000 });
        this.router.navigate(['/history']);
      }
    );
  }

  createRoomReservation(reservation: Reservation, roomSelected): void {
    this.seatRoomService.createReservation(reservation).subscribe(
      data => {
        reservation = data;
        this.seatRoomService.addRoomToReservation(reservation, roomSelected.id).subscribe();
        this.snackBar.open('Reservation created succsessfully', null, { duration: 3000 });
        this.router.navigate(['/history']);
      },
    );
  }

  reserveSeat(seat: Seat): void {
    console.log(seat);
    this.seatRoomService.reserveSeat(seat).pipe()
      .subscribe(seats => {
        // tslint:disable-next-line:prefer-const
        let response: ServiceResponse = new ServiceResponse();
        response.seats = seats;
        // this.searchSubmittedStatusSource.next(response);
      });
  }

  deleteSeat(seat: Seat): void {
    this.seatRoomService.deleteSeat(seat);
  }

  deleteRoom(room: Room): void {
    this.seatRoomService.deleteRoom(room);
  }
  countReservations(studentID: string): void{
    console.log('counting reservations');
    this.seatRoomService.countReservations(studentID).subscribe(
      data =>{
       let count = data.count;
       console.log("count: ", count);
       this.count(count);
      });
  }
  count(count: number){
    console.log("count:::::", count);
    this.rcount = count;
    if(this.rcount >= 1){
      console.log("1 or more active reservations");
        let response: ServiceResponse = new ServiceResponse();
        response.status = Status.HIDE_RESERVE_BUTTON;
        this.checkActiveReservationSource.next(response);
    } else {
      let response: ServiceResponse = new ServiceResponse();
        response.status = Status.SHOW_RESERVE_BUTTON;
        this.checkActiveReservationSource.next(response);
    }
  }
}

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
