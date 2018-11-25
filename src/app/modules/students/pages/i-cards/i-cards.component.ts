import {Component, Input, OnInit} from '@angular/core';

import {ClassService} from '../../../../services/class.service';
import {StudentService} from '../../../students/student.service';

import { ChangeDetectorRef } from '@angular/core';
import {EmitterService} from '../../../../services/emitter.service';

class ColumnFilter {
    showSerialNumber = true;
    showName = true;
    showClassName = true;
    showRollNumber = false;
    showFathersName = true;
    showMobileNumber = true;
    showScholarNumber = false;
    showDateOfBirth = false;
    showMotherName = false;
    showGender = false;
    showCaste = false;
    showCategory = false;
    showReligion = false;
    showFatherOccupation = false;
    showAddress = false;
    showRTE = false;
}

@Component({
    selector: 'i-cards',
    templateUrl: './i-cards.component.html',
    styleUrls: ['./i-cards.component.css'],
    providers: [StudentService, ClassService ],
})

export class ICardsComponent implements OnInit {

    @Input() user;

    columnFilter: ColumnFilter;

    /* Category Options */
    scSelected = false;
    stSelected = false;
    obcSelected = false;
    generalSelected = false;

    /* Gender Options */
    maleSelected = false;
    femaleSelected = false;
    otherGenderSelected = false;

    displayStudentNumber = 0;
    selectedStudentNumber = 0;

    classSectionList = [];
    studentFullProfileList = [];

    filteredStudentFullProfileList = [];

    message = '';

    isLoading = false;

    rows;
    expanded = {};
    timeout: any;

    constructor(private studentService: StudentService,
                private classService: ClassService,
                private cdRef: ChangeDetectorRef) { }

    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

    getRowHeight(row) {
        return 50;
    }

    getRowClass(row): any {
        return {
            'hoverRow': true,
        };
    }

    updateRowValue(row: any, value: boolean): void {
        row.selected = value;
        this.cdRef.detectChanges();
    }

    getThumbImage(row: any): string {
        if (row.profileImage) {
            let url = row.profileImage;
            if (url.substr(url.length-4) === "main") {
                return url + "_thumb";
            }
            return url.substr(0, url.length-4) + "_thumb" + url.substr(url.length-4);
        } else {
            return '';
        }
    }

    ngOnInit(): void {

        this.columnFilter = new ColumnFilter();

        const student_full_profile_request_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        const class_section_request_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        this.isLoading = true;
        Promise.all([
            this.classService.getClassSectionList(class_section_request_data, this.user.jwt),
            this.studentService.getStudentFullProfileList(student_full_profile_request_data, this.user.jwt),
        ]).then(value => {
            console.log(value);
            this.isLoading = false;
            this.initializeClassSectionList(value[0]);
            this.initializeStudentFullProfileList(value[1]);
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

    initializeStudentFullProfileList(studentFullProfileList: any): void {
        // this.studentFullProfileList = studentFullProfileList;
        this.studentFullProfileList = studentFullProfileList.filter( student => {
            return student.parentTransferCertificate == null;
        });
        this.studentFullProfileList.forEach(studentFullProfile => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.classDbId, studentFullProfile.sectionDbId);
            studentFullProfile['show'] = false;
            studentFullProfile['selected'] = false;
        });
        this.handleStudentDisplay();
    }

    getSectionObject(classDbId: number, sectionDbId: number): any {
        let sectionObject = null;
        this.classSectionList.every(classs => {
            classs.sectionList.every(section => {
                if (sectionDbId === section.dbId && classDbId === classs.dbId) {
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
        this.handleStudentDisplay();
    };

    selectAllClasses(): void {
        this.classSectionList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = true;
                });
            }
        );
        this.handleStudentDisplay();
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

    selectAllStudents(): void {
        this.studentFullProfileList.forEach(student => {
            student.selected = true;
        });
    }

    unSelectAllStudents(): void {
        this.studentFullProfileList.forEach(student => {
            student.selected = false;
        });
    }

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

    handleStudentDisplay(): void {
        let serialNumber = 0;
        this.displayStudentNumber = 0;

        this.studentFullProfileList.forEach(student => {

            /* Class Section Check */
            if (!student.sectionObject.selected) {
                student.show = false;
                return;
            }

            /* Category Check */
            if (!(this.scSelected && this.stSelected && this.obcSelected && this.generalSelected)
                && !(!this.scSelected && !this.stSelected && !this.obcSelected && !this.generalSelected)) {
                if (student.category === null || student.category === '') {
                    student.show = false;
                    return;
                }
                switch (student.category) {
                    case 'SC':
                        if (!this.scSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'ST':
                        if (!this.stSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'OBC':
                        if (!this.obcSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Gen.':
                        if (!this.generalSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Gender Check */
            if (!(this.maleSelected && this.femaleSelected && this.otherGenderSelected)
                && !(!this.maleSelected && !this.femaleSelected && !this.otherGenderSelected)) {
                if (student.gender === null || student.gender === '') {
                    student.show = false;
                    return;
                }
                switch (student.gender) {
                    case 'Male':
                        if (!this.maleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Female':
                        if (!this.femaleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Other':
                        if (!this.otherGenderSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            ++this.displayStudentNumber;
            student.show = true;
            student.serialNumber = ++serialNumber;

        });

        this.filteredStudentFullProfileList = this.studentFullProfileList.filter(student => {
            return student.show;
        });

    };

    getSelectedStudentNumber(): number {
        let result = 0;
        this.studentFullProfileList.forEach(student => {
            if (student.show && student.selected) {
                ++result;
            }
        });
        return result;
    }

    printStudentICards(): void {
        const value = {
            studentProfileList: this.studentFullProfileList.filter(student => {
                return (student.show && student.selected);
            }),
            columnFilter: this.columnFilter
        };
        EmitterService.get('print-i-cards').emit(value);
    };

}
