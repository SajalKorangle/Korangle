import { Component, Input, OnInit } from '@angular/core';

import { VehicleService } from '../../vehicle.service';

import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';

@Component({
  selector: 'update-bus-stop',
  templateUrl: './update-bus-stop.component.html',
  styleUrls: ['./update-bus-stop.component.css'],
})

export class UpdateBusStopComponent implements OnInit {

    @Input() user;

    busStopList: any;
    filteredBusStopList: any;

    selectedBusStop: any;

    currentBusStop: any;

    myControl = new FormControl();

    isLoading = false;

    constructor (private vehicleService: VehicleService) { }

    ngOnInit(): void {

        this.currentBusStop = {};

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

        Object.keys(this.selectedBusStop).forEach(key => {
            this.currentBusStop[key] = this.selectedBusStop[key];
        });

    }

    updateBusStop(): void {

        if (this.currentBusStop.stopName === undefined || this.currentBusStop.stopName === '') {
            alert('Stop Name should be populated');
            return;
        }

        if (this.currentBusStop.kmDistance === undefined || this.currentBusStop.kmDistance === 0) {
            alert('Distance should be populated');
            return;
        }

        let id = this.currentBusStop.id;

        this.isLoading = true;
        this.vehicleService.updateBusStop(this.currentBusStop, this.user.jwt).then(data => {
            this.isLoading = false;
            alert(data.message);
            if (data.status === 'success') {
                if (this.selectedBusStop.id === id) {
                    Object.keys(this.currentBusStop).forEach(key => {
                        this.selectedBusStop[key] = this.currentBusStop[key];
                    });
                }
            }
        }, error => {
            this.isLoading = false;
        });

    }

}
