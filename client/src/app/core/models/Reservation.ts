export class Reservation {

    buildingName: string;
    floorNumber: number;
    studentID?: string;
    expirationTime?: number;
    time?: string;
    date?: string;
    count?: number;
    id?: string;

    constructor(
        buildingName: string,
        floorNumber: number,
        studentID?: string,
        expirationTime?: number,
        time?: string,
        date?: string,
        count?: number,
        id?: string
    ) {
        this.buildingName = buildingName;
        this.floorNumber = floorNumber;
        this.studentID = studentID;
        this.expirationTime = expirationTime;
        this.time = time;
        this.date = date;
        this.count = count;
        this.id = id;
    }
}
