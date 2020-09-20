import {Component, Input, OnInit} from '@angular/core';

import { AddStudentServiceAdapter } from './add-student-service.adapter';

import { ClassService } from '../../../../services/modules/class/class.service';
import { BusStopService } from '../../../../services/modules/school/bus-stop.service';
import {StudentService} from "../../../../services/modules/student/student.service";
import {Student} from "../../../../services/modules/student/models/student";
import {StudentSection} from "../../../../services/modules/student/models/student-section";
import {VehicleOldService} from "../../../../services/modules/vehicle/vehicle-old.service";
import {ExaminationService} from "../../../../services/modules/examination/examination.service";
import {SubjectService} from "../../../../services/modules/subject/subject.service";
import {FeeService} from "../../../../services/modules/fees/fee.service";
import {INSTALLMENT_LIST} from "../../../fees/classes/constants";
import {DataStorage} from "../../../../classes/data-storage";
import {SchoolService} from "../../../../services/modules/school/school.service"
import {BankService} from '../../../../services/bank.service';

@Component({
  selector: 'add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
    providers: [
        SchoolService, ClassService, BusStopService, StudentService, SubjectService,
        ExaminationService, VehicleOldService, FeeService, BankService
    ],
})

export class AddStudentComponent implements OnInit {

    installmentList = INSTALLMENT_LIST;
    sessionList = [] ;
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

    studentParameterList: any[] = [];
    currentStudentParameterValueList: any[] = [];

    serviceAdapter: AddStudentServiceAdapter;

    isLoading = false;

    constructor (public schoolService : SchoolService,
                 public classService: ClassService,
                 public busStopService: BusStopService,
                 public studentService: StudentService,
                 public subjectService: SubjectService,
                 public vehicleService: VehicleOldService,
                 public examinationService: ExaminationService,
                 public feeService: FeeService,
                 public bankService: BankService) { }

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

        this.currentStudentParameterValueList = [];

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

    getParameterValue = (parameter) => {
        try {
            return this.currentStudentParameterValueList.find(x => x.parentStudentParameter === parameter.id).value
        } catch {
            return this.nullValue;
        }
    }

    updateParameterValue = (parameter, value) => {
        let item = this.currentStudentParameterValueList.find(x => x.parentStudentParameter === parameter.id);
        if (!item) {
            item = {parentStudentParameter: parameter.id, value: value};
            this.currentStudentParameterValueList.push(item);
        } else {
            item.value = value;
        }
    }

}
