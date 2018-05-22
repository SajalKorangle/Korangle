import {Component, Input, OnInit} from '@angular/core';

import {FeeService} from '../../fee.service';
import {ClassService} from '../../../../services/class.service';
import {StudentFeeProfile} from '../../classes/student-fee-profile';

class ColumnFilter {
    showName = true;
    showClassName = true;
    showFathersName = true;
    showMobileNumber = true;
    showScholarNumber = true;
    showTotalFees = true;
    showFeesDue = true;
    showRTE = true;
}

@Component({
    selector: 'app-school-fee-record',
    templateUrl: './school-record.component.html',
    styleUrls: ['./school-record.component.css'],
    providers: [FeeService, ClassService],
})

export class SchoolRecordComponent implements OnInit {

    @Input() user;

    columnFilter: ColumnFilter;

    displayStudentNumber = 0;
    totalStudents = 0;

    studentFeeProfileList = [];

    classSectionList = [];

    isLoading = false;

    constructor(private feeService: FeeService,
                private classService: ClassService) {
    }

    ngOnInit(): void {
        this.columnFilter = new ColumnFilter();
        const student_fee_profile_request_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        const class_section_request_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        }
        this.isLoading = true;
        Promise.all([
            this.classService.getClassSectionList(class_section_request_data, this.user.jwt),
            this.feeService.getStudentFeeProfileList(student_fee_profile_request_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.initializeClassSectionList(value[0]);
            this.initializeStudentFeeProfileList(value[1]);
        }, error => {
            this.isLoading = false;
        });
    }

    initializeClassSectionList(classSectionList: any): void {
        this.classSectionList = classSectionList;
        this.classSectionList.forEach(classs => {
            classs.sectionList.forEach(section => {
                section.selected = false;
                section.containsStudent = false;
            });
        });
    }

    initializeStudentFeeProfileList(studentFeeProfileList: any): void {
        this.studentFeeProfileList = studentFeeProfileList;
        this.studentFeeProfileList.forEach(studentFeeProfile => {
            studentFeeProfile['sectionObject'] = this.getSectionObject(studentFeeProfile.sectionDbId);
            studentFeeProfile['totalFees'] = StudentFeeProfile.getStudentTotalFee(studentFeeProfile);
            studentFeeProfile['feesDue'] = StudentFeeProfile.getStudentFeesDue(studentFeeProfile);
        });
    }

    getSectionObject(sectionDbId: number): any {
        let sectionObject = null;
        this.classSectionList.every(classs => {
            classs.sectionList.every(section => {
                if (sectionDbId === section.dbId) {
                    sectionObject = section;
                    section.containsStudent = true;
                    return false;
                }
                return true;
            });
            if (sectionObject) {
                return false;
            }
            return true;
        });
        if (!sectionObject) {
            console.log('Error: should have section object');
        }
        return sectionObject;
    }

    unselectAllClasses(): void {
        this.classSectionList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = false;
                });
            }
        );
    };

    selectAllClasses(): void {
        this.classSectionList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = true;
                });
            }
        );
    };

    selectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = true;
        });
    };

    unSelectAllColumns(): void {
        Object.keys(this.columnFilter).forEach((key) => {
            this.columnFilter[key] = false;
        });
    };

    showSectionName(classs: any): boolean {
        let sectionLength = 0;
        classs.sectionList.every(section => {
            if (section.containsStudent) {
                ++sectionLength;
            }
            if (sectionLength > 1) {
                return false;
            } else {
                return true;
            }
        });
        return sectionLength > 1;
    }

}
