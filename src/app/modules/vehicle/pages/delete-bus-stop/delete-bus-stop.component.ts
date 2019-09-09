import { Component, Input, OnInit } from '@angular/core';

import { VehicleOldService } from '../../../../services/modules/vehicle/vehicle-old.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'delete-bus-stop',
  templateUrl: './delete-bus-stop.component.html',
  styleUrls: ['./delete-bus-stop.component.css'],
})

export class DeleteBusStopComponent implements OnInit {

    user;

    busStopList: any;
    filteredBusStopList: any;

    selectedBusStop: any;

    currentBusStop: any;

    myControl = new FormControl();

    isLoading = false;

    constructor (private vehicleService: VehicleOldService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        const data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        this.vehicleService.getBusStopList(data, this.user.jwt).then( busStopList => {
            this.busStopList = busStopList;
            this.filteredBusStopList = this.myControl.valueChanges.pipe(
                map(value => typeof value === 'string' ? value: (value as any).stopName),
                map(value => this.filter(value))
            );
        });

    }

    filter(value: any): any {
        if (value === '') {
            return [];
        }
        return this.busStopList.filter( busStop => busStop.stopName.toLowerCase().indexOf(value.toLowerCase()) === 0 );
    }

    displayFn(busStop?: any) {
        if (busStop) {
            return busStop.stopName;
        } else {
            return '';
        }
    }

    getBusStop(busStop: any): void {

        this.selectedBusStop = busStop;

    }

    deleteBusStop(): void {

        let id = this.selectedBusStop.id;

        this.isLoading = true;
        this.vehicleService.deleteBusStop(this.selectedBusStop, this.user.jwt).then(data => {
            this.isLoading = false;
            alert(data.message);
            if (data.status === 'success') {
                if (this.selectedBusStop.id === id) {
                    this.selectedBusStop = null;
                }
                let index = 0;
                this.busStopList.every(busStop => {
                    if (busStop.id === id) {
                        return false;
                    }
                    ++index;
                    return true;
                });
                this.busStopList.splice(index, 1);
            }
        }, error => {
            this.isLoading = false;
        });

    }

}
