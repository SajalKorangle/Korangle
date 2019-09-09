import {Component, Input, OnInit} from '@angular/core';

import { AddStudentServiceAdapter } from './add-student-service.adapter';

import { ClassOldService } from '../../../../services/modules/class/class-old.service';
import { BusStopService } from '../../../../services/modules/school/bus-stop.service';
import {StudentService} from "../../../../services/modules/student/student.service";
import {Student} from "../../../../services/modules/student/student";
import {StudentSection} from "../../../../services/modules/student/student-section";
import {SESSION_LIST} from "../../../../classes/constants/session";
import {VehicleOldService} from "../../../../services/modules/vehicle/vehicle-old.service";
import {ExaminationService} from "../../../../services/modules/examination/examination.service";
import {SubjectService} from "../../../../services/modules/subject/subject.service";
import {FeeService} from "../../../../services/modules/fees/fee.service";
import {INSTALLMENT_LIST} from "../../../fees/classes/constants";
import {DataStorage} from "../../../../classes/data-storage";

@Component({
  selector: 'add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
    providers: [ ClassOldService, BusStopService, StudentService, SubjectService, ExaminationService, VehicleOldService, FeeService ],
})

export class AddStudentComponent implements OnInit {

    installmentList = INSTALLMENT_LIST;
    sessionList = SESSION_LIST;
    nullValue = null;

    user:any;

    // From Service Adapter
    classList = [];
    sectionList = [];
    busStopList = [];
    classSubjectList = [];
    testSecondList = []; // represents Class Test
    schoolFeeRuleList = [];
    classFilterFeeList = [];
    busStopFilterFeeList = [];

    newStudent: Student;
    newStudentSection: StudentSection;

    serviceAdapter: AddStudentServiceAdapter;

    isLoading = false;

    constructor (public classService: ClassOldService,
                 public busStopService: BusStopService,
                 public studentService: StudentService,
                 public subjectService: SubjectService,
                 public vehicleService: VehicleOldService,
                 public examinationService: ExaminationService,
                 public feeService: FeeService) { }

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new AddStudentServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    initializeVariable(): void {

        this.newStudent = new Student();
        this.newStudent.parentSchool = this.user.activeSchool.dbId;

        this.newStudentSection = new StudentSection();
        this.newStudentSection.parentClass = this.classList[0].dbId;
        this.newStudentSection.parentDivision = this.sectionList[0].id;
        this.newStudentSection.parentSession = this.user.activeSchool.currentSessionDbId;

    }

    checkLength(value: any) {
        if (value && value.toString().length > 0) {
            return true;
        }
        return false;
    }

    checkRight(value: any, rightValue: number) {
        if (value && value.toString().length === rightValue) {
            return true;
        }
        return false;
    }

    policeNumberInput(event: any): boolean {
        let value = event.key;
        if (value !== '0' && value !== '1' && value !== '2' && value !== '3' &&
            value !== '4' && value !== '5' && value !== '6' && value !== '7' &&
            value !== '8' && value !== '9') {
            return false;
        }
        return true;
    }

    getCurrentSessionName(): string {
        return this.sessionList.find(session => {
            return session.id == this.user.activeSchool.currentSessionDbId;
        }).name;
    }

    getSection(sectionId: number): any {
        return this.sectionList.find(section => {
            return this.newStudentSection.parentDivision == section.id;
        });
    }

}
