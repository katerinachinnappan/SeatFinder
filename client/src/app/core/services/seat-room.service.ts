import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { catchError, map, tap, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { Seat } from '../models/Seat';
import { Room } from '../models/Room';
import { ItemType } from '../models/ItemType';
import { Reservation } from '../models/Reservation';
import { MatSnackBar } from '@angular/material';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-type': 'application/json'
  })
};

interface ReservationSeat {
  id: string;
  reservationId: string;
  seatId: string;
}

interface ReservationRoom {
  id: string;
  reservationId: string;
  seatId: string;
}

interface RoomItemType {
  id: string;
  roomId: string;
  itemTypeId: string;
}

interface ReservationCount{
  count: number;
}

@Injectable()
export class SeatRoomService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  private seatUrl = environment.local_apiBaseUrl + '/api/Seats/'; // seat URL
  private getSeatUrl = environment.local_apiBaseUrl + '/api/Seats/getSeats'; // getSeat URL GET
  private roomUrl = environment.local_apiBaseUrl + '/api/Rooms'; // room URL GET
  private getRoomUrl = environment.local_apiBaseUrl + '/api/Rooms/getRooms'; // getRoom URL GET
  private updateSeatUrl = environment.local_apiBaseUrl + '/api/Seats'; // seat URL PUT
  private reservationUrl = environment.local_apiBaseUrl + '/api/Reservations'; // reservation URL
  private itemUrl = environment.local_apiBaseUrl + '/api/ItemTypes'; // itemTypes URL
  private roomUrl1 = environment.local_apiBaseUrl + '/api/Rooms/'; // itemTypes URL
  reservationID: String;

  getReservations(studentID: String): Observable<Reservation[]> {
    const filter: any = {};
    filter.where = {};
    filter.where["studentID"] = studentID;
    filter.include = [];
    filter.include.push("rooms");
    filter.include.push("seats");
    console.log(filter);
    return this.http.post<Reservation[]>(this.reservationUrl + '/getReservations', JSON.stringify(filter), httpOptions).pipe(
      tap(reservations => {
        console.log('get api/reservations');
        console.log(reservations);
      }),
      catchError(this.handleError('getreservations', []))
    );
  }

  updateReservation(reservation: Reservation, time: number): Observable<Reservation[]> {
    reservation.expirationTime = time;
    // return
    return this.http.put<Reservation[]>(this.reservationUrl + '/' + reservation.id, reservation).pipe(
      tap(reservations => {
        console.log('get api/reservations');
        console.log(reservations);
        this.snackBar.open('Reservation updated', null, { duration: 3000 });
      }),
      catchError(this.handleError('getreservations', []))
    );
  }

  getSeats(floor: number, buildingName: string): Observable<Seat[]> {
    // Begin cosntructing filter object
    const filter: any = {};
    filter.where = {};

    // Add room filters to object if present
    if (buildingName) {
      filter.where['buildingName'] = buildingName;
    }
    if (floor !== undefined) {
      filter.where['floor'] = floor;
    }

    const seatsFilter = JSON.stringify(filter);

    return this.http.post<Seat[]>(this.getSeatUrl, seatsFilter, httpOptions).pipe(
      // filter(products => product.floor == 0),
      tap(seats => {
        console.log('get api/seats');
        console.log(seats);
      }),
      catchError(this.handleError('getseats', []))
    );
  }

  getRooms(floor: number, buildingName: string, itemName: string[]): Observable<Room[]> {
    // Begin cosntructing filter object
    const filter: any = {};
    filter.where = {};

    // Add room filters to object if present
    if (buildingName) {
      filter.where['buildingName'] = buildingName;
    }
    if (floor !== undefined) {
      filter.where['floor'] = floor;
    }
    // Add item filters to object if present
    if (!itemName) {
      filter['include'] = 'itemTypes';
    } else if (itemName.length === 1) {
      filter.include = {};
      filter.include['relation'] = 'itemTypes';
      filter.include.scope = {};
      filter.include.scope.where = {};
      filter.include.scope.where['name'] = itemName[0];
    } else if (itemName.length > 1) {
      filter.include = {};
      filter.include['relation'] = 'itemTypes';
      filter.include.scope = {};
      filter.include.scope.where = {};
      filter.include.scope.where.or = [];

      itemName.forEach(i => {
        const nameFilter = {};
        nameFilter['name'] = i;
        filter.include.scope.where.or.push(nameFilter);
      });
    }

    // Convert to JSON string
    const roomsFilter = JSON.stringify(filter);

    return this.http.post<Room[]>(this.getRoomUrl, roomsFilter, httpOptions).pipe(
      tap(rooms => {
        console.log('get api/rooms');
        console.log(rooms);
      }),
      catchError(this.handleError('getrooms', []))
    );
  }
  reserveSeat(seat: Seat): Observable<Seat[]> {
    return this.http.put<Seat[]>(this.updateSeatUrl + '/' + seat.id, seat).pipe(
      tap(seats => {
        console.log('get api/seats');
        console.log(seats);
      }),
      catchError(this.handleError('reserveseats', []))
    );

  }
  createReservation(reservation: Reservation): Observable<Reservation> {
    return this.http.post<Reservation>(this.reservationUrl, reservation, httpOptions).pipe(
      tap(reservations => {
        console.log('get api/reservations');
        console.log(reservations);
        this.reservationID = reservations.id;
        console.log('reservation ID:', this.reservationID);
      }),
      catchError(this.handleError<Reservation>('createreservations'))
    );
  }
  createItems(items: ItemType): Observable<ItemType> {
    return this.http.post<ItemType>(this.itemUrl, items, httpOptions).pipe(
      tap(items => {
        console.log('get api/items');
        console.log(items);
      }),
      catchError(this.handleError<ItemType>('createitems'))
    );
  }
  addSeatToReservation(reservation: Reservation, seatID: String): Observable<ReservationSeat> {
    const body = '{"reservationId":' + '"' + reservation.id + '","seatId":' + '"' + seatID + '"}';
    console.log(body);
    console.log(this.reservationUrl + reservation.id + '/seats/rel/' + seatID);
    return this.http.put<ReservationSeat>(this.reservationUrl + '/' + reservation.id + '/seats/rel/' + seatID, httpOptions).pipe(
      tap((reservationSeat: ReservationSeat) => console.log('get api/reservationsSeat', reservationSeat)),
      catchError(this.handleError<ReservationSeat>('add seat to reservation'))
    );
  }
  addRoomToReservation(reservation: Reservation, roomID: String): Observable<ReservationRoom> {
    let body = '{reservationId:' + '"' + reservation.id + '","roomId":' + '"' + roomID + '"}';

    return this.http.put<ReservationRoom>(this.reservationUrl + '/' + reservation.id + '/rooms/rel/' + roomID, httpOptions).pipe(
      tap((reservationRoom: ReservationRoom) => console.log()),
      catchError(this.handleError<ReservationRoom>('add room to reservation'))
    );
  }

  addItemsToRoom(room: Room, itemID: String): Observable<RoomItemType> {
    let body = '{"roomId":' + '"' + room.id + '","itemTypeId":' + '"' + itemID + '"}';
    console.log(body);
    console.log(this.roomUrl1 + room.id + '/itemTypes/rel/' + itemID);
    console.log(itemID);
    return this.http.put<RoomItemType>(this.roomUrl1 + room.id + '/itemTypes/rel/' + itemID, httpOptions).pipe(
      tap((roomItems: RoomItemType) => console.log('get api/roomItemtype', roomItems)),
      catchError(this.handleError<RoomItemType>('add item to room'))
    );
  }
  createSeat(seat: Seat): Observable<Seat[]> {
    return this.http.post<Seat[]>(this.seatUrl, seat, httpOptions).pipe(
      tap(seats => {
        console.log('get api/seats');
        console.log(seats);
        this.snackBar.open('Seat added succsessfully', null, { duration: 3000 });
      }),
      catchError(this.handleError('createseats', []))
    );
  }
  createRoom(room: Room): Observable<Room> {
    return this.http.post<Room>(this.roomUrl, room, httpOptions).pipe(
      tap(rooms => {
        console.log('get api/rooms');
        console.log(rooms);
        this.snackBar.open('Room added succsessfully', null, { duration: 3000 });
      }),
      catchError(this.handleError<Room>('createrooms'))
    );
  }

  getSelectedItem(item: ItemType): void {
    console.log('hi');
    console.log(item);
    // return item;
  }
  deleteSeat(seat: Seat): void {
    this.http.delete(this.seatUrl + seat.id, httpOptions).subscribe(result => {
      console.log('Deleted ' + result + ' seat');
    });
  }

  deleteRoom(room: Room): void {
    this.http.delete(this.roomUrl1 + room.id, httpOptions).subscribe(result => {
      console.log('Deleted ' + result + ' room');
    });
  }

  deleteReservation(reservation: Reservation): void {
    this.http.delete(this.reservationUrl + '/'+ reservation.id, httpOptions).subscribe(result => {
      console.log('Deleted ' + result + ' reservations');
    });
  }

  countReservations(studentID: string): Observable<ReservationCount>{
    console.log("yo:", studentID);
    let date = Date.now();
    console.log(date);
    return this.http.get<ReservationCount>(this.reservationUrl+'/count?where[studentID]='+studentID+'&where[expirationTime][gt]='+date).pipe(
      tap((reservationCount: ReservationCount) => console.log('get api/reservations/count', reservationCount.count)),
      catchError(this.handleError<ReservationCount>('add room to reservation'))
      );
  }


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      // return the empty result so the application keeps running
      return of(result as T);
    };
  }
}
