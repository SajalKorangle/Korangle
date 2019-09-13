import { Component, OnInit } from '@angular/core';

import { GenerateFinalReportServiceAdapter } from './generate-final-report.service.adapter';

import { ChangeDetectorRef } from '@angular/core';

import { AttendanceOldService } from '../../../../../services/modules/attendance/attendance-old.service';

import { PrintService } from '../../../../../print/print-service';
import { DataStorage } from "../../../../../classes/data-storage";

import { ReportCardCbseService } from "../../../../../services/modules/report-card/cbse/report-card-cbse.service";
import { ClassService } from "../../../../../services/modules/class/class.service";
import { StudentService } from "../../../../../services/modules/student/student.service";
import {ExaminationService} from "../../../../../services/modules/examination/examination.service";
import {SubjectService} from "../../../../../services/modules/subject/subject.service";

@Component({
    selector: 'generate-final-report',
    templateUrl: './generate-final-report.component.html',
    styleUrls: ['./generate-final-report.component.css'],
    providers: [ ReportCardCbseService, ClassService, StudentService, ExaminationService, SubjectService,
         AttendanceOldService ],
})

export class GenerateFinalReportComponent implements OnInit {

    user;

    selectedClassSection = null;

    subjectList = [];
    termList = [];
    extraFieldList = [];
    reportCardMappingList = [];
    classSectionList = [];
    studentSectionList = [];
    examinationList = [];

    showPrincipalSignature = true;

    serviceAdapter: GenerateFinalReportServiceAdapter;

    isLoading = true;
    timeout: any;

    constructor(public reportCardCbseService: ReportCardCbseService,
                public studentService: StudentService,
                public classService: ClassService,
                public examinationService: ExaminationService,
                public subjectService: SubjectService,
                public attendanceOldService: AttendanceOldService,
                private cdRef: ChangeDetectorRef,
                private printService: PrintService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new GenerateFinalReportServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    printStudentFinalReport(): void {
        let data = {
            // 'extraFieldList': this.extraFieldList,
            // 'subjectList': this.subjectList,
            // 'studentFinalReportList': this.studentFinalReportCardList,
            // 'reportCardMapping': this.reportCardMapping,
            // 'showPrincipalSignature': this.showPrinicipalSignature,
        };
        // let selectedClassSection = this.getSelectedClassSection();
        let printRoute : string;
        
        /*if (selectedClassSection.className == 'Class - 9') {
            printRoute = PRINT_STUDENT_NINTH_FINAL_REPORT;
        } else if( selectedClassSection.className == 'Class - 11'){
            printRoute = PRINT_STUDENT_ELEVENTH_FINAL_REPORT;
        } else if (this.reportCardMapping.reportCardType == REPORT_CARD_TYPE_LIST[2]) {
            printRoute = PRINT_STUDENT_COMPREHENSIVE_FINAL_REPORT;
        } else if (this.reportCardMapping.reportCardType == REPORT_CARD_TYPE_LIST[1]) {
            printRoute = PRINT_STUDENT_ELEGANT_FINAL_REPORT;
        } else {
            printRoute = PRINT_STUDENT_CLASSIC_FINAL_REPORT;
        }*/

        this.printService.navigateToPrintRoute(printRoute, {user: this.user, value: data});
        alert('This may take a while');
    }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

    showSectionName(classSection: any): boolean {
        return this.classSectionList.filter(item => {
            return item.class.id == classSection.class.id;
        }).length > 1;
    }

    getFilteredStudentList(): any {
        return this.studentSectionList.filter(studentSection => {
            return studentSection.parentClass == this.selectedClassSection.class.id
                && studentSection.parentDivision == this.selectedClassSection.section.id;
        });
    }

    getSelectedStudentNumber(): number {
        return this.getFilteredStudentList().filter(studentSection => {
            return studentSection.selected == true;
        }).length;
    }

}
