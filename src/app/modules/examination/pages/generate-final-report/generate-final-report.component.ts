import { Component, Input, OnInit } from '@angular/core';

import { ExaminationService } from '../../../../services/examination.service';

import { GenerateFinalReportServiceAdapter } from './generate-final-report.service.adapter';
import {REPORT_CARD_TYPE_LIST} from '../../classes/constants';

import { ChangeDetectorRef } from '@angular/core';
import {ClassService} from '../../../../services/class.service';
import {StudentService} from '../../../students/student.service';
import {SubjectService} from '../../../../services/subject.service';
import {AttendanceService} from '../../../attendance/attendance.service';
import {EmitterService} from '../../../../services/emitter.service';

@Component({
    selector: 'generate-final-report',
    templateUrl: './generate-final-report.component.html',
    styleUrls: ['./generate-final-report.component.css'],
    providers: [ ExaminationService, ClassService, StudentService, SubjectService, AttendanceService ],
})

export class GenerateFinalReportComponent implements OnInit {

    @Input() user;

    reportCardTypeList = REPORT_CARD_TYPE_LIST;

    reportCardMapping: any;
    classSectionStudentList = [];

    filteredStudentList = [];

    subjectList = [];
    extraFieldList = [];
    studentFinalReportCardList = [];

    serviceAdapter: GenerateFinalReportServiceAdapter;

    isLoading = true;
    timeout: any;

    constructor(public examinationService: ExaminationService,
                public classService: ClassService,
                public studentService: StudentService,
                public subjectService: SubjectService,
                public attendanceService: AttendanceService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new GenerateFinalReportServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    printStudentFinalReport(): void {
        let data = {
            'extraFieldList': this.extraFieldList,
            'subjectList': this.subjectList,
            'studentFinalReportList': this.studentFinalReportCardList,
            'reportCardMapping': this.reportCardMapping,
        };
        let selectedClassSection = this.getSelectedClassSection();
        if (selectedClassSection.className == 'Class - 9') {
            EmitterService.get('print-student-ninth-final-report-list').emit(data);
        } else if( selectedClassSection.className == 'Class - 11'){
            EmitterService.get('print-student-eleventh-final-report-list').emit(data);
        } else if (this.reportCardMapping.reportCardType == REPORT_CARD_TYPE_LIST[2]) {
            EmitterService.get('print-student-comprehensive-final-report-list').emit(data);
        } else if (this.reportCardMapping.reportCardType == REPORT_CARD_TYPE_LIST[1]) {
            EmitterService.get('print-student-elegant-final-report-list').emit(data);
        } else {
            EmitterService.get('print-student-classic-final-report-list').emit(data);
        }
        alert('This may take a while');
    }

    showSectionName(className: any): boolean {
        let result = false;
        this.classSectionStudentList.every(classs => {
            if (classs.name == className) {
                if (classs.sectionList.length > 1) {
                    result = true;
                    return false;
                }
            }
            return true;
        });
        return result;
    }

    unselectAllClasses(): void {
        this.classSectionStudentList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = false;
                });
            }
        );
    }

    getSelectedStudentsValue(from: number, to: number): boolean {
        let result = true;
        this.filteredStudentList.slice(from, to).every(student => {
            if (!student.selected) {
                result = false;
                return false;
            }
            return true;
        });
        return result;
    }

    selectStudents(from: number, to: number, value: boolean): void {
        this.unselectAllStudents();
        if (value) {
            this.filteredStudentList.slice(from, to).forEach(student => {
                student.selected = true;
            });
        }
        this.cdRef.detectChanges();
    }

    unselectAllStudents(): void {
        this.filteredStudentList.forEach(student => {
            student.selected = false;
        });
        this.cdRef.detectChanges();
    }

    handleStudentDisplay(): void {
        this.filteredStudentList = [];
        this.classSectionStudentList.every(classs => {
            let result = true;
            classs.sectionList.every(section => {
                if (section.selected) {
                    this.filteredStudentList = section.studentList;
                    result = false;
                    return false;
                }
                return true;
            });
            return result;
        });
        this.cdRef.detectChanges();
    }

    getSelectedClassSection(): any {
        let selectedClassSection = null;
        this.classSectionStudentList.every(classs => {
            let result = true;
            classs.sectionList.every(section => {
                if (section.selected) {
                    selectedClassSection = {
                        'className': classs.name,
                        'classDbId': classs.dbId,
                        'sectionName': section.name,
                        'sectionDbId': section.id,
                    };
                    result = false;
                    return false;
                }
                return true;
            });
            return result;
        });
        return selectedClassSection;
    }

    getSelectedStudentNumber(): number {
        let result = 0;
        this.filteredStudentList.forEach(student => {
            if (student.selected) {
                ++result;
            }
        });
        return result;
    }

    updateRowValue(row: any, value: boolean): void {
        row.selected = value;
        this.cdRef.detectChanges();
    }

    getRowClass(row): any {
        return {
            'hoverRow': true,
        };
    }

    getRowHeight(row) {
        return 50;
    }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

}
