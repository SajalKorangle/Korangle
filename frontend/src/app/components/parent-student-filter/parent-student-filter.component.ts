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
    parentNameFormControl = new FormControl();

    motherNameFormControlValue : any;
    fatherNameFormControlValue : any;

    filteredStudentList: any;
    filteredMobileNumberList: any;
    filteredSiblingListList: any;

    STUDENT = 'Student';
    MOBILE_NUMBER = 'Mobile Number';
    FATHER_NAME = "Father's Name";
    MOTHER_NAME = "Mother's Name";
    filterTypeList = [];

    serviceAdapter: ParentStudentFilterServiceAdapter;

    isLoading = false;

    constructor(public studentService: StudentService, public classService: ClassService) {}

    ngOnInit(): void {

        this.filterTypeList = this.filterTypeList.concat([
            this.STUDENT,
            this.MOBILE_NUMBER,
            this.FATHER_NAME,
            this.MOTHER_NAME
        ]);

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

        this.filteredSiblingListList = this.parentNameFormControl.valueChanges.pipe(
            map((value) => this.filterSiblingListListByParentName(value))
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
        })
        .sort((a, b) => {
            if (getStudentIndex(a) == getStudentIndex(b)) {
                return 0;
            } else if (getStudentIndex(a) > getStudentIndex(b)) {
                return 1;
            } else {
                return -1;
            }
        })
        .slice(0, 20);

        function getStudentIndex(student: any): number {
            let index = 100000;
            let nameIndex = student.name.toLowerCase().indexOf(value.toLowerCase());
            let scholarNumberIndex = student.scholarNumber ? student.scholarNumber.toLowerCase().indexOf(value.toLowerCase()) : -1;
            index = (nameIndex != -1 && nameIndex < index) ? nameIndex : index;
            index = (scholarNumberIndex != -1 && scholarNumberIndex < index) ? scholarNumberIndex : index;
            return index;
        }

    }

    displayStudentFunction(student?: any): any {
        if (student) {
            if (typeof student == 'string') {
                return student;
            } else {
                return student.name + (student.scholarNumber ? ' (' + student.scholarNumber + ')' : '');
            }
        }
        return '';
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

    // Parent Mobile Number
    filterMobileNumberList(value: number): any {
        if (value == null) {
            return [];
        }
        return this.mobileNumberList
            .filter((mobileNumber) => {
                return mobileNumber.toString().indexOf(value.toString()) != -1;
            })
            .sort((a, b) => {
                if (getMobileNumberIndex(a) == getMobileNumberIndex(b)) {
                    return 0;
                } else if (getMobileNumberIndex(a) > getMobileNumberIndex(b)) {
                    return 1;
                } else {
                    return -1;
                }
            })
            .slice(0, 10);

        function getMobileNumberIndex(mobileNumber: any): number {
            return mobileNumber.toString().indexOf(value.toString());
        }

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

    // Parent Name
    getPlaceHolder(): any {
        let parent = this.selectedFilterType == this.FATHER_NAME ? "father's" : "mother's";
        return "Type " + parent + " name here";
    }

    filterSiblingListListByParentName(value: any): any {
        if (typeof value != 'string' || value === '') {
            return [];
        }
        // toString is required with value below, because for a moment form sends the mobilenumber (typeof number) as value
        let strValue = value.toString().toLowerCase();
        let filteredStudentList = [];
        if (this.selectedFilterType == this.FATHER_NAME) {
            filteredStudentList = this.studentList.filter((student) => {
                return student.fathersName.toLowerCase().indexOf(strValue) != -1;
            })
            .sort((a, b) => {
                let indexA = a.fathersName.toLowerCase().indexOf(strValue);
                let indexB = b.fathersName.toLowerCase().indexOf(strValue);
                if (indexA == indexB) {
                    return 0;
                } else if (indexA > indexB) {
                    return 1;
                } else {
                    return -1;
                }
            });
        } else {
            filteredStudentList = this.studentList.filter((student) => {
                return student.motherName && student.motherName.toLowerCase().indexOf(strValue) != -1;
            })
            .sort((a, b) => {
                let indexA = a.motherName.toLowerCase().indexOf(strValue);
                let indexB = b.motherName.toLowerCase().indexOf(strValue);
                if (indexA == indexB) {
                    return 0;
                } else if (indexA > indexB) {
                    return 1;
                } else {
                    return -1;
                }
            });
        }
        return filteredStudentList.reduce( (siblingListList, student) => {
            let studentListFromMobileNumber = student.mobileNumber ? this.getFilteredStudentListByMobileNumber(student.mobileNumber) : [];
            let studentListFromSecondMobileNumber = student.secondMobileNumber ? this.getFilteredStudentListByMobileNumber(student.secondMobileNumber) : [];
            let studentListFromAllMobileNumbers = Array.from(new Set([...[student], ...studentListFromMobileNumber, ...studentListFromSecondMobileNumber]));
            let siblingsFound = false;
            siblingListList.every(studentListLoop => {
                if (studentListLoop.find(value => studentListFromAllMobileNumbers.includes(value)) != undefined) {
                    studentListLoop = Array.from(new Set([...studentListLoop, ...studentListFromAllMobileNumbers]));
                    siblingsFound = true;
                    return false;
                }
                return true;
            });
            if (!siblingsFound) {
                siblingListList.push(studentListFromAllMobileNumbers);
            }
            return siblingListList;
        }, []).slice(0, 20);
    }

    displayParentNameFn = (studentList?: any) => {
        if (studentList) {
            return this.selectedFilterType == this.FATHER_NAME ?
                studentList[0].fathersName :
                studentList[0].motherName;
        }
        return null;
    }

    getMotherName(siblingList: any): any {
        let student = siblingList.find(student => {
            return student.motherName;
        });
        if (student != undefined) return student.motherName;
        return '';
    }

    handleSiblingListSelection(studentList: any): void {
        this.onStudentListSelected.emit([studentList, this.getFilteredStudentSectionListByStudentList(studentList)]);
    }

    leftText(name: any): any {
        let text = (<HTMLInputElement>document.getElementById("textInput")).value;
        let ind = name.toLowerCase().indexOf(text.toLowerCase());
        if (ind == -1)
            return name;
        if (ind > 0)
            return name.substring(0, ind);
        return '';
    }

    rightText(name: any): any {
        let text = (<HTMLInputElement>document.getElementById("textInput")).value;
        let ind = name.toLowerCase().indexOf(text.toLowerCase());
        if (ind == -1)
            return '';
        let right = ind + text.length;
        if (right < name.length)
            return name.substring(right, name.length);
        return '';
    }

    highlightText(name: any): any {
        let text = (<HTMLInputElement>document.getElementById("textInput")).value;
        let ind = name.toLowerCase().indexOf(text.toLowerCase());
        if (ind != -1)
            return name.substring(ind, ind + text.length);
        return '';
    }

    onChangeSelectedFilterType(event : any) : any {
        if (this.selectedFilterType == this.FATHER_NAME){
            this.fatherNameFormControlValue = this.parentNameFormControl.value 
            this.parentNameFormControl.setValue(this.motherNameFormControlValue)
        } else {
            this.motherNameFormControlValue = this.parentNameFormControl.value 
            this.parentNameFormControl.setValue(this.fatherNameFormControlValue)
        }
        this.selectedFilterType = event
    }
    

}
