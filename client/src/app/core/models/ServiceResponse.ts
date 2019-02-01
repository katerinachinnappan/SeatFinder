import { Seat } from './Seat';
import { Room } from './Room';
import { Reservation } from './Reservation';

export class ServiceResponse {
    status: string;
    seats?: Seat[];
    rooms?: Room[];
    reservations?: Reservation[];
}

export enum Status {
    ERROR = 'ERROR',
    LOADING = 'LOADING',
    EMPTY = 'EMPTY',
    IDLE = 'IDLE',
    SHOW_SEATS = 'SHOW_SEATS',
    SHOW_ROOMS = 'SHOW_ROOMS',
    SHOW_RESERVATIONS = 'SHOW_RESERVATIONS',
    HIDE_RESERVE_BUTTON = 'HIDE_RESERVE_BUTTON',
    SHOW_RESERVE_BUTTON = 'SHOW_RESERVE_BUTTON'
}
