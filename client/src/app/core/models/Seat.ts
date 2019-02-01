export class Seat {
    id?: string;
    buildingName: string;
    floor: number;
    availability?: boolean;
    roomNumber?: number;

    constructor(
        availability: boolean,
        floor: number,
        buildingName: string,
        roomNumber?: number,
        // to make the id optional, it must be the last parameter of the list
        id?: string
    ) {
        this.id = id;
        this.availability = availability;
        this.floor = floor;
        this.buildingName = buildingName;
        this.roomNumber = roomNumber;
    }
}
