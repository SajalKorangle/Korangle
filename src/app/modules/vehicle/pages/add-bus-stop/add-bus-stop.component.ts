import {Component, Input, OnInit} from '@angular/core';

import { VehicleService } from '../../vehicle.service';

@Component({
  selector: 'add-bus-stop',
  templateUrl: './add-bus-stop.component.html',
  styleUrls: ['./add-bus-stop.component.css'],
})

export class AddBusStopComponent implements OnInit {

    @Input() user;

    newBusStop: any;

    isLoading = false;

    constructor (private vehicleService: VehicleService) { }

    ngOnInit(): void {
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
