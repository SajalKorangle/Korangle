import {Component, Input, OnInit} from '@angular/core';

import { VehicleOldService } from '../../../../services/modules/vehicle/vehicle-old.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'add-bus-stop',
  templateUrl: './add-bus-stop.component.html',
  styleUrls: ['./add-bus-stop.component.css'],
})

export class AddBusStopComponent implements OnInit {

    user;

    newBusStop: any;

    isLoading = false;

    constructor (private vehicleService: VehicleOldService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.newBusStop = {};
    }

    createNewBusStop(): void {

        if (this.newBusStop.stopName === undefined || this.newBusStop.stopName === '') {
            alert('Stop Name should be populated');
            return;
        }

        if (this.newBusStop.kmDistance === undefined || this.newBusStop.kmDistance === 0) {
            alert('Distance should be populated');
            return;
        }

        this.newBusStop.parentSchool = this.user.activeSchool.dbId;

        this.isLoading = true;

        this.vehicleService.createBusStop(this.newBusStop, this.user.jwt).then(data => {
                this.isLoading = false;
                alert(data.message);
                if (data.status === 'success') {
                    this.newBusStop = {};
                }
            }, error => {
                this.isLoading = false;
                alert('Server Error: Contact admin');
            }
        );
    }

}
