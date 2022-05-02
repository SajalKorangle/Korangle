import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
import { StudentService } from '../../services/modules/student/student.service';
import { ParentStudentFilterServiceAdapter } from './parent-student-filter.service.adapter';
import { ClassService } from '../../services/modules/class/class.service';

@Component({
    selector: 'parent-student-filter',
    templateUrl: './parent-student-filter.component.html',
    styleUrls: ['./parent-student-filter.component.css'],
    providers: [StudentService, ClassService],
})
export class ParentStudentFilterComponent implements OnInit {
    @Input() user;

    @Input() studentTcGenerated = false;

    @Input() bothFilters = true;

    @Input() showFilter = true;

    @Input() selectedFilterType = 'Student';

    @Output() onDataLoaded = new EventEmitter<any>();

    @Output() onStudentListLoading = new EventEmitter<boolean>();

    @Output() onStudentListSelected = new EventEmitter<any>();

    classList = [];
    sectionList = [];
    studentSectionList = [];
    studentList = [];
    mobileNumberList = [];

    studentFormControl = new FormControl();
    mobileNumberFormControl = new FormControl();

    filteredStudentList: any;
    filteredMobileNumberList: any;

    filterTypeList = ['Student', 'Parent'];

    serviceAdapter: ParentStudentFilterServiceAdapter;

    isLoading = false;

    constructor(public studentService: StudentService, public classService: ClassService) {}

    ngOnInit(): void {
        this.serviceAdapter = new ParentStudentFilterServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();

        this.filteredStudentList = this.studentFormControl.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : (value as any).name)),
            map((name) => this.filterStudentList(name.toString()))
        );

        this.filteredMobileNumberList = this.mobileNumberFormControl.valueChanges.pipe(
            map((value) => (typeof value === 'number' ? value : null)),
            map((value) => this.filterMobileNumberList(value))
        );
    }

    policeMobileNumberInput(event: any): boolean {
        let value = event.key;
        if (
            value !== '0' &&
            value !== '1' &&
            value !== '2' &&
            value !== '3' &&
            value !== '4' &&
            value !== '5' &&
            value !== '6' &&
            value !== '7' &&
            value !== '8' &&
            value !== '9'
        ) {
            return false;
        }
        return true;
    }

    getClassName(classId: number): any {
        return this.classList.find((item) => {
            return item.id == classId;
        }).name;
    }

    getSectionName(sectionId: number): any {
        return this.sectionList.find((item) => {
            return item.id == sectionId;
        }).name;
    }

    getFilteredStudentListByMobileNumber(mobileNumber: number): any {
        return this.studentList.filter((student) => {
            return student.mobileNumber == mobileNumber || student.secondMobileNumber == mobileNumber;
        });
    }

    getFilteredStudentSectionListByStudentList(studentList: any): any {
        return this.studentSectionList.filter((studentSection) => {
            return (
                studentList.find((student) => {
                    return student.id == studentSection.parentStudent;
                }) != undefined
            );
        });
    }

    handleDataLoading(): void {
        let data = {
            classList: this.classList,
            sectionList: this.sectionList,
            studentSectionList: this.studentSectionList,
            studentList: this.studentList,
        };
        this.onDataLoaded.emit(data);
    }

    handleOnStudentListLoading(value: boolean): void {
        this.isLoading = value;
        this.onStudentListLoading.emit(value);
    }

    // Student
    filterStudentList(value: string): any {
        if (value === null || value === '') {
            return [];
        }
        return this.studentList.filter((student) => {
            return (
                student.name.toLowerCase().indexOf(value.toLowerCase()) != -1 ||
                (student.scholarNumber && student.scholarNumber.toLowerCase().indexOf(value.toLowerCase()) != -1)
            );
        });
    }

    getStudentClassAndSection(student?: any): any {
        if (student) {
            let studentSection = this.studentSectionList.find((studentSection) => {
                return studentSection.parentStudent == student.id;
            });
            return (
                this.getClassName(studentSection.parentClass) +
                ', ' +
                this.getSectionName(studentSection.parentDivision)
            );
        }
        return '';
    }

    handleStudentSelection(student: any): void {
        this.onStudentListSelected.emit([[student], this.getFilteredStudentSectionListByStudentList([student])]);
    }

    // Parent
    filterMobileNumberList(value: number): any {
        if (value == null) {
            return [];
        }
        return this.mobileNumberList
            .filter((mobileNumber) => {
                return mobileNumber.toString().indexOf(value.toString()) === 0;
            })
            .slice(0, 10);
    }

    displayMobileNumberFn(mobileNumber?: any): any {
        if (mobileNumber) {
            return mobileNumber;
        }
        return null;
    }

    handleMobileNumberSelection(mobileNumber: any): void {
        let studentList = this.getFilteredStudentListByMobileNumber(mobileNumber);
        this.onStudentListSelected.emit([studentList, this.getFilteredStudentSectionListByStudentList(studentList)]);
    }
}
