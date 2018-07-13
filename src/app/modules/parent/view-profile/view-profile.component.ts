import { Component, Input, OnInit } from '@angular/core';

import { StudentService } from '../../students/student.service';
import {BusStopService} from '../../../services/bus-stop.service';

@Component({
  selector: 'view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.css'],
    providers: [ StudentService, BusStopService ],
})

export class ViewProfileComponent implements OnInit {

    @Input() user;

    selectedStudent: any;

    busStopList = [];

    isLoading = false;

    constructor (private studentService: StudentService,
                 private busStopService: BusStopService) { }

    ngOnInit(): void {
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
