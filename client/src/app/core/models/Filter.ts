export class Filter {
    resourse: string; // seat or room
    buildingName?: string;
    floor?: number;
    itemList?: string[];
}

export enum Resource {
    ROOM = 'ROOM',
    SEAT = 'SEAT',
}

