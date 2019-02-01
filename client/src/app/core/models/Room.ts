import { ItemType } from './ItemType';

export class Room {
    buildingName: string;
    floor: number;
    name: string;
    availability: boolean;
    id?: string;
    itemTypes?: ItemType[];

    constructor(
        buildingName: string,
        floor: number,
        name: string,
        availabiity: boolean,
        id?: string,
        itemTypes?: ItemType[]
    ) {
        this.buildingName = buildingName;
        this.floor = floor;
        this.name = name;
        this.availability = availabiity;
        this.id = id;
        this.itemTypes = itemTypes;
    }
}

