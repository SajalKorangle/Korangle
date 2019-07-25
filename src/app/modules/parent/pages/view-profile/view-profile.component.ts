import { Component, Input, OnInit, OnChanges } from '@angular/core';

import { StudentOldService } from '../../../students/student-old.service';
import {BusStopService} from '../../../../services/bus-stop.service';
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
    providers: [ StudentOldService, BusStopService ],
})

export class ViewProfileComponent implements OnInit, OnChanges {

     user;

    @Input() studentId;

    selectedStudent: any;

    busStopList = [];

    isLoading = false;

    constructor (private studentService: StudentOldService,
                 private busStopService: BusStopService) { }

    ngOnChanges(): void {
        this.ngOnInit();
    }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.selectedStudent = null;

        this.busStopList = [];

        this.isLoading = false;

        this.getStudentProfile();

        const dataForBusStop = {
            schoolDbId: this.user.activeSchool.dbId,
        };

        this.busStopService.getBusStopList(dataForBusStop, this.user.jwt).then( busStopList => {
            this.busStopList = busStopList;
        });
    }

    getStudentProfile(): void {
        this.isLoading = true;
        const data = {
            studentDbId: this.user.section.student.id,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        this.studentService.getStudentFullProfile(data, this.user.jwt).then(
            student => {
                this.isLoading = false;
                console.log(student);
                this.selectedStudent = student;
            }, error => {
                this.isLoading = false;
            }
        );
    }

    getBusStopName(busStopDbId: any) {
        let stopName = 'None';
        if (busStopDbId !== null) {
            this.busStopList.forEach(busStop => {
                if (busStop.dbId == busStopDbId) {
                    stopName = busStop.stopName;
                    return;
                }
            });
        }
        return stopName;
    }

}
