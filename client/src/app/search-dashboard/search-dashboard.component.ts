import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter } from 'events';
import { Building, buildings } from '../core/models/Building';
import { MatSelectChange, MatTabChangeEvent, MatCheckboxChange } from '@angular/material';
import { SearchCommunicationService } from '../core/services/search-communication.service';
import { items, ItemType } from '../core/models/ItemType';
import { Filter, Resource } from '../core/models/Filter';

@Component({
  selector: 'app-search-dashboard',
  templateUrl: './search-dashboard.component.html',
  styleUrls: ['./search-dashboard.component.scss'],
  providers: [SearchCommunicationService]
})
export class SearchDashboardComponent implements OnInit {

  public displayedFloorsSeat: String[];
  public selectedBuildingSeat: Building;
  public selectedFloorSeat: number;

  public displayedFloorsRoom: String[];
  public selectedBuildingRoom: Building;
  public selectedFloorRoom: number;
  public selectedItem: Array<ItemType>;

  private selectedTab = 0;
  public buildingList: Building[];
  public itemList: ItemType[];
  public tabList: string[] = ['Seats', 'Room'];

  constructor(private searchCommunicationService: SearchCommunicationService) {
  }

  ngOnInit() {
    this.buildingList = Array<Building>();
    buildings.forEach((building) => {
      this.buildingList.push(building);
    });
    this.buildingList.push(null);
    this.itemList = items;
    this.selectedItem = new Array();
  }

  onBuildingSelectionChangedSeat(inputdBuilding: MatSelectChange) {
    this.selectedBuildingSeat = inputdBuilding.value as Building;
    console.log('Building selected: ' + this.selectedBuildingSeat);
    this.displayedFloorsSeat = null;
    if (this.selectedBuildingSeat) {
      this.displayedFloorsSeat = Array.from(new Array(this.selectedBuildingSeat.floors), (val, index) => index).map(String);
      this.displayedFloorsSeat.push(null);
    }
  }

  onFloorSelectionChangedSeat(inputdFloor: MatSelectChange, floorDisplayerReference: any) {
    this.selectedFloorSeat = inputdFloor.value as number;
    console.log('Floor selected: ' + this.selectedFloorSeat);
  }

  getFloorFileldAvailabilitySeat(): boolean {
    return this.selectedBuildingSeat == null;
  }

  setTabActive(event: MatTabChangeEvent): void {
    this.selectedTab = event.index;
  }

  search(): void {
    // tslint:disable-next-line:prefer-const
    let filter: Filter = new Filter();
    if (this.selectedTab === 0) {
      filter.resourse = Resource.SEAT;
      if (this.selectedBuildingSeat) {
        filter.buildingName = this.selectedBuildingSeat.name;
      }
      if (this.selectedFloorSeat !== null) {
        filter.floor = this.selectedFloorSeat;
      }
    } else {
      filter.resourse = Resource.ROOM;
      if (this.selectedBuildingRoom) {
        filter.buildingName = this.selectedBuildingRoom.name;
      }
      if (this.selectedFloorRoom !== null) {
        filter.floor = this.selectedFloorRoom;
      }
      if (this.selectedItem.length > 0) {
        filter.itemList = [];
        for (const item of this.selectedItem) {
          filter.itemList.push(item.name);
        }
      }
    }
    console.log(filter);
    this.searchCommunicationService.submitSearch(filter);
  }

  onBuildingSelectionChangedRoom(inputdBuilding: MatSelectChange) {
    this.selectedBuildingRoom = inputdBuilding.value as Building;
    console.log('Building selected: ' + this.selectedBuildingRoom);
    this.displayedFloorsRoom = null;
    if (this.selectedBuildingRoom) {
      this.displayedFloorsRoom = Array.from(new Array(this.selectedBuildingRoom.floors), (val, index) => index).map(String);
      this.displayedFloorsRoom.push(null);
    }
  }

  onFloorSelectionChangedRoom(inputdFloor: MatSelectChange) {
    this.selectedFloorRoom = inputdFloor.value as number;
    console.log('Floor selected: ' + this.selectedFloorRoom);
  }

  getFloorFileldAvailabilityRoom(): boolean {
    return this.selectedBuildingRoom == null;
  }

  updateItemSelection($event: MatCheckboxChange, item: ItemType) {
    if (this.selectedItem.includes(item)) {
      console.log('uncheck');
      this.selectedItem.splice(this.selectedItem.indexOf(item), 1);
    } else {
      this.selectedItem.push(item);
    }
    console.log('selected item', this.selectedItem);
    console.log(item.name);
  }

}
