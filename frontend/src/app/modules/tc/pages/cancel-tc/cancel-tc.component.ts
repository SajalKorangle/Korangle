import { Component, OnInit } from '@angular/core';
import { DataStorage } from '../../../../classes/data-storage';
import { CancelTCServiceAdapter } from './cancle-tc.service.adapter';
import { TCService } from './../../../../services/modules/tc/tc.service';
import { StudentService } from './../../../../services/modules/student/student.service';
import { ClassService } from '@services/modules/class/class.service';

import { Student } from './../../../../services/modules/student/models/student';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';
import { StudentSection } from './../../../../services/modules/student/models/student-section';

interface CustomSSInterface extends StudentSection {
    parentStudentInstance: Student;
    tc: TransferCertificateNew;
}

@Component({
    selector: 'app-cancel-tc',
    templateUrl: './cancel-tc.component.html',
    styleUrls: ['./cancel-tc.component.css'],
    providers: [TCService, StudentService, ClassService],
})
export class CancelTCComponent implements OnInit {
    user: any;

    certificateNumberSearchInput: string = '';
    studentNameSearchInput: string = '';

    tcCancelledOnThisPageSession: { [key: number]: boolean } = {}; // tcId->boolean

    tcList: Array<TransferCertificateNew>;

    studentSectionList: Array<StudentSection>;
    studentList: Array<Student>;
    classList: Array<any>;
    divisionList: Array<any>;

    classSectionList: Array<any>;
    studentSestionWithTC: Array<CustomSSInterface>;

    serviceAdapter: CancelTCServiceAdapter;

    isLoading = false;

    constructor(public tcService: TCService, public studentService: StudentService, public classService: ClassService) {}

    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
        this.serviceAdapter = new CancelTCServiceAdapter(this);
        this.serviceAdapter.initializeData();
    }

    populateClassSectionList(classList, divisionList): void {
        this.classSectionList = [];
        classList.forEach((classs) => {
            divisionList.forEach((division) => {
                if (
                    this.studentSectionList.find((studentSection) => {
                        return studentSection.parentClass == classs.id && studentSection.parentDivision == division.id;
                    }) != undefined
                ) {
                    this.classSectionList.push({
                        class: classs,
                        section: division,
                        selected: false,
                    });
                }
            });
        });

        const divisionPerClassCount = {}; // count of divisions in each class
        this.classSectionList.forEach((cs) => {
            if (divisionPerClassCount[cs.class.id]) divisionPerClassCount[cs.class.id] += 1;
            else divisionPerClassCount[cs.class.id] = 1;
        });

        this.classSectionList = this.classSectionList.map((cs) => {
            // showDivision based of division count per class
            if (divisionPerClassCount[cs.class.id] == 1) {
                return { ...cs, showDivision: false };
            } else {
                return { ...cs, showDivision: true };
            }
        });
    }

    populateStudentSectionWithTC(): void {
        this.studentSestionWithTC = this.tcList.map((tc) => {
            const student = this.studentList.find((s) => s.id == tc.parentStudent);
            const ss = this.studentSectionList.find((ss) => ss.id == tc.parentStudentSection);
            return {
                ...ss,
                tc: tc,
                parentStudentInstance: student,
            };
        });
    }

    getClassSectionName = (classId, divisionId) => {
        const classSection = this.classSectionList.find((cs) => cs.class.id == classId && cs.section.id == divisionId);
        if (classSection.showDivision) {
            return classSection.class.name + ', ' + classSection.section.name;
        } else {
            return classSection.class.name;
        }
    }

    getFilteredStudentSectionList() {
        return this.studentSestionWithTC.filter(
            (ss) =>
                ss.tc.certificateNumber.toString().startsWith(this.certificateNumberSearchInput) &&
                ss.parentStudentInstance.name.toLowerCase().startsWith(this.studentNameSearchInput.toLowerCase())
        );
    }

    cancelTC(tc: TransferCertificateNew): void {
        this.isLoading = true;
        this.serviceAdapter.cancelTC(tc).then((res) => {
            this.tcCancelledOnThisPageSession[res.id] = true;
            this.isLoading = false;
        });
    }
}
