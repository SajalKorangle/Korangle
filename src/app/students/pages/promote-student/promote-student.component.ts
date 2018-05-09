import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../../classes/student';
import { Classs } from '../../../classes/classs';
import { Section } from '../../../classes/section';

import { StudentService } from '../../student.service';
import {BusStopService} from '../../../services/bus-stop.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
    providers: [ StudentService, BusStopService ],
})

export class PromoteStudentComponent implements OnInit {

    @Input() user;

    fromSelectedClass: Classs;
    fromSelectedSection: Section;
    fromClassSectionStudentList: Classs[] = [];

    toSelectedClass: Classs;
    toSelectedSection: Section;
    toClassSectionStudentList: Classs[] = [];

    isLoading = false;

    constructor (private studentService: StudentService) { }

    changeSelectedSectionToFirst(): void {
        // this.selectedSection = this.selectedClass.sectionList[0];
        // this.changeSelectedStudentToFirst();
    }

    /*changeSelectedStudentToFirst(): void {
        this.selectedStudent = this.selectedSection.studentList[0];
        this.currentStudent.copy(this.selectedStudent);
    }*/

    ngOnInit(): void {
        const data = {
            sessionDbId: 1,
        };
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(classSectionStudentList => {
            classSectionStudentList.forEach( classs => {
                const tempClass = new Classs();
                tempClass.name = classs.name;
                tempClass.dbId = classs.dbId;
                classs.sectionList.forEach( section => {
                    const tempSection = new Section();
                    tempSection.name = section.name;
                    tempSection.dbId = section.dbId;
                    section.studentList.forEach( student => {
                        const tempStudent = new Student();
                        tempStudent.name = student.name;
                        tempStudent.dbId = student.dbId;
                        tempSection.studentList.push(tempStudent);
                    });
                    tempClass.sectionList.push(tempSection);
                });
                this.fromClassSectionStudentList.push(tempClass);
            });
            if (this.fromClassSectionStudentList.length > 0) {
                this.fromSelectedClass = this.fromClassSectionStudentList[0];
                this.changeSelectedSectionToFirst();
            }
        });
    }

}
