import { Component, OnInit } from '@angular/core';
import { EventEmitter } from 'events';
import { Building, buildings } from '../core/models/Building';
import { MatSelectChange, MatTabChangeEvent, MatCheckboxChange, MatInputModule } from '@angular/material';
import { items, ItemType } from '../core/models/ItemType';
import { Room } from '../core/models/Room';
import { Seat } from '../core/models/Seat';
import { SeatRoomService } from '../core/services/seat-room.service';

@Component({
  selector: 'app-add-dashboard',
  templateUrl: './add-dashboard.component.html',
  styleUrls: ['./add-dashboard.component.scss']
})
export class AddDashboardComponent implements OnInit {

  public displayedFloorsSeat: number[];
  public selectedBuildingSeat: Building;
  public selectedFloorSeat: number;

  public displayedFloorsRoom: number[];
  public selectedBuildingRoom: Building;
  public selectedFloorRoom: number;
  public selectedItem: Array<ItemType>;
  public roomCapacity: number;
  public roomName: string;

  private selectedTab = 0;
  public buildingList: Building[];
  public itemList: ItemType[];
  public item: ItemType;
  public tabList: string[] = ['Seat', 'Room'];

  constructor(private seatRoomService: SeatRoomService) {
    this.buildingList = new Array<Building>();
  }

  ngOnInit() {
    this.buildingList = buildings;
    console.log(this.buildingList);
    this.itemList = items;
    this.selectedItem = new Array();
  }

  onBuildingSelectionChangedSeat(inputdBuilding: MatSelectChange) {
    this.selectedBuildingSeat = inputdBuilding.value as Building;
    console.log('Building selected: ' + this.selectedBuildingSeat.name);
    this.displayedFloorsSeat = Array.from(new Array(this.selectedBuildingSeat.floors), (val, index) => index);
  }

  onFloorSelectionChangedSeat(inputdFloor: MatSelectChange) {
    this.selectedFloorSeat = inputdFloor.value as number;
    console.log(this.selectedFloorSeat);
    console.log('Floor selected: ' + this.selectedFloorSeat);
  }

  getFloorFileldAvailabilitySeat(): boolean {
    return this.selectedBuildingSeat == null;
  }

  setTabActive(event: MatTabChangeEvent): void {
    this.selectedTab = event.index;
  }

  onBuildingSelectionChangedRoom(inputdBuilding: MatSelectChange) {
    this.selectedBuildingRoom = inputdBuilding.value as Building;
    console.log('Building selected: ' + this.selectedBuildingRoom.name);
    this.displayedFloorsRoom = Array.from(new Array(this.selectedBuildingRoom.floors), (val, index) => index);
  }

  onFloorSelectionChangedRoom(inputdFloor: MatSelectChange) {
    this.selectedFloorRoom = inputdFloor.value as number;
    console.log('Floor selected: ' + this.selectedFloorRoom);
  }

  onNameChange($event) {
    this.roomName = $event.target.value;
  }

  getFloorFileldAvailabilityRoom(): boolean {
    return this.selectedBuildingRoom == null;
  }

  updateItemSelection($event: MatCheckboxChange, item: ItemType) {
    this.item = item;
    if (this.selectedItem.includes(item)) {
      console.log('uncheck');
      this.selectedItem.splice(this.selectedItem.indexOf(item), 1);
    } else {
      this.selectedItem.push(item);
    }
    console.log(this.selectedItem);
    console.log('items', this.item.name);
  }

  add(): void {
    // tslint:disable-next-line:prefer-const
    let room: Room;
    let seat: Seat;
    let itemz: ItemType;
    // let totalItem: ItemType;
    // Seat
    if (this.selectedTab === 0) {
      console.log('adding seat');
      seat = new Seat(true, this.selectedFloorSeat, this.selectedBuildingSeat.name);
      console.log('adding this seat: ', seat);
      this.seatRoomService.createSeat(seat).subscribe();
      console.log('seat added');
    } else { // Room
      // Add item types to room
      console.log('adding room');
      room = new Room(this.selectedBuildingRoom.name, this.selectedFloorRoom, this.roomName, true);
      console.log('adding this room: ', room);
      this.seatRoomService.createRoom(room).subscribe(
        data => {
          room = data;
        }
      );
      console.log('room added', room);

      // create the selected items
      if (this.selectedItem.length < 1) {
        console.log('no items selected');
      } else if (this.selectedItem.length === 1) {
        console.log('adding items', this.item.name);
        itemz = new ItemType(this.item.name, this.item.description);
        this.seatRoomService.createItems(itemz).subscribe(

          data => {
            this.selectedItem[0] = data;

            console.log('adding created items to created room');
            console.log('itemID: ', this.selectedItem[0].id);
            console.log('roomID: ', room.id);

            this.seatRoomService.addItemsToRoom(room, this.selectedItem[0].id).subscribe();

          });
      } else if (this.selectedItem.length > 1) {
        let i = 0;
        for (i = 0; i < this.selectedItem.length; i++) {
          console.log('item name: ', this.selectedItem[i].name);
          itemz = new ItemType(this.selectedItem[i].name, this.selectedItem[i].description);

          this.seatRoomService.createItems(itemz).subscribe(
            data => {
              this.selectedItem[i] = data;
              console.log(data);

              console.log('adding created items to created room');
              console.log(this.selectedItem[i].id);

              this.seatRoomService.addItemsToRoom(room, this.selectedItem[i].id).subscribe();

            });
        }
      }
      console.log('room & items created');
      console.log('adding created items to created room');

    }
  }


}

