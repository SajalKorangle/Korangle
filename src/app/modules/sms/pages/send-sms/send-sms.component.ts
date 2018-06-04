import {Component, Input, OnInit} from '@angular/core';

import {ClassService} from '../../../../services/class.service';
import {StudentService} from '../../../students/student.service';
import { EmployeeService } from '../../../employee/employee.service';
import { SmsService } from '../../sms.service';

import { ChangeDetectorRef } from '@angular/core';

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

class EmployeeColumnFilter {
    showSerialNumber = true;
    showName = true;
    showEmployeeNumber = false;
    showFatherName = true;
    showMobileNumber = true;
    showDateOfBirth = false;
    showMotherName = false;
    showAadharNumber = false;
    showPassportNumber = false;
    showQualification = false;
    showCurrentPost = false;
    showDateOfJoining = false;
    showPanNumber = false;
    showGender = false;
    showAddress = true;
    showBankName = false;
    showBankAccountNumber = false;
    showEpfAccountNumber = false;
    showRemark = false;
}

@Component({
    selector: 'send-sms',
    templateUrl: './send-sms.component.html',
    styleUrls: ['./send-sms.component.css'],
    providers: [StudentService, ClassService, EmployeeService],
})

export class SendSmsComponent implements OnInit {

    @Input() user;

    columnFilter: ColumnFilter;

    employeeColumnFilter: EmployeeColumnFilter;

    employeeProfileList = [];

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

    // classSectionStudentList = [];

    classSectionList = [];
    studentFullProfileList = [];

    filteredStudentFullProfileList = [];

    smsBalance = 0;

    showStudentList = false;
    showEmployeeList = false;

    selectedMobileNumberList = [];

    message = '';

    isLoading = false;

    rows;
    expanded = {};
    timeout: any;

    constructor(private studentService: StudentService,
                private employeeService: EmployeeService,
                private classService: ClassService,
                private smsService: SmsService,
                private cdRef: ChangeDetectorRef) { }




    onPage(event) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            console.log('paged!', event);
        }, 100);
    }

    /*fetch(cb) {
        const req = new XMLHttpRequest();
        req.open('GET', `assets/data/100k.json`);

        req.onload = () => {
            const rows = JSON.parse(req.response);

            for(const row of rows) {
                row.height = Math.floor(Math.random() * 80) + 50;
            }

            cb(rows);
        };

        req.send();
    }*/

    getRowHeight(row) {
        // return row.height;
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



    ngOnInit(): void {

        this.columnFilter = new ColumnFilter();
        this.employeeColumnFilter = new EmployeeColumnFilter();

        const student_full_profile_request_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        const class_section_request_data = {
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };
        const sms_count_request_data = {
            parentSchool: this.user.activeSchool.dbId,
        };
        const employee_profile_request_data = {
            parentSchool: this.user.activeSchool.dbId,
        };

        this.isLoading = true;
        Promise.all([
            this.classService.getClassSectionList(class_section_request_data, this.user.jwt),
            this.studentService.getStudentFullProfileList(student_full_profile_request_data, this.user.jwt),
            this.employeeService.getEmployeeProfileList(employee_profile_request_data, this.user.jwt),
            this.smsService.getSMSCount(sms_count_request_data, this.user.jwt),
        ]).then(value => {
            console.log(value);
            this.isLoading = false;
            this.initializeClassSectionList(value[0]);
            this.initializeStudentFullProfileList(value[1]);
            this.initializeEmployeeProfileList(value[2]);
            this.smsBalance = value[3].count;
        }, error => {
            this.isLoading = false;
        });

    }

    sendSMS(): void {

        let smsContentType = (this.hasUnicode()? 'unicode':'english');

        let mobileNumberList = '';

        this.selectedMobileNumberList.forEach(mobileNumber => {
            mobileNumberList += mobileNumber.toString() + ',';
        });

        let data = {
            'parentSchool': this.user.activeSchool.dbId,
            'smsContentType': smsContentType,
            'estimatedCount': this.getSMSCount()*this.getMobileNumberList(),
            'message': this.message,
            'mobileNumberList': mobileNumberList,
        };

        if (!confirm('Please confirm that you are sending ' + (this.getSMSCount()*this.getMobileNumberList()) + ' SMS.')) {
            return;
        }

        this.isLoading = true;
        this.smsService.sendSMS(data, this.user.jwt).then(data => {
            this.isLoading = false;
            alert(data.message);
            if (data.status === 'success') {
                this.smsBalance -= data.count;
            } else if (data.status === 'failure') {
                this.smsBalance = data.count;
            }
        }, error => {
            this.isLoading = false;
        })
    }

    getMobileNumberList(): number {
        this.selectedMobileNumberList = [];
        let result = 0;
        if (this.showStudentList) {
            this.studentFullProfileList.forEach(student => {
                if (student.show && student.selected) {
                    if (this.selectedMobileNumberList.indexOf(student.mobileNumber) === -1) {
                        this.selectedMobileNumberList.push(student.mobileNumber);
                        ++result;
                    }
                }
            });
        }
        if (this.showEmployeeList) {
            this.employeeProfileList.forEach(employee => {
                if (employee.selected) {
                    if (this.selectedMobileNumberList.indexOf(employee.mobileNumber) === -1) {
                        this.selectedMobileNumberList.push(employee.mobileNumber);
                        ++result;
                    }
                }
            });
        }
        return result;
    }

    hasUnicode(): boolean {
        for (let i=0; i<this.message.length; ++i) {
            if (this.message.charCodeAt(i) > 127) {
                return true;
            }
        }
        return false;
    }

    getSMSCount(): number {
        if (this.hasUnicode()) {
            return Math.ceil(this.message.length/70);
        } else {
            return Math.ceil(this.message.length/160);
        }
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
        this.studentFullProfileList = studentFullProfileList;
        this.studentFullProfileList.forEach(studentFullProfile => {
            studentFullProfile['sectionObject'] = this.getSectionObject(studentFullProfile.sectionDbId);
            studentFullProfile['show'] = false;
            studentFullProfile['selected'] = false;
            studentFullProfile['validMobileNumber'] = this.isMobileNumberValid(studentFullProfile.mobileNumber);
        });
        this.handleStudentDisplay();
    }

    initializeEmployeeProfileList(employeeProfileList: any): void {
        this.employeeProfileList = employeeProfileList;
        this.employeeProfileList.forEach(employee => {
            employee['selected'] = false;
            employee['validMobileNumber'] = this.isMobileNumberValid(employee.mobileNumber);
        })
    }

    isMobileNumberValid(mobileNumber: any): boolean {
        if (mobileNumber === null) {
            return false;
        }
        if (mobileNumber === '') {
            return false;
        }
        if (typeof mobileNumber !== 'number') {
            return false;
        }
        if (mobileNumber<1000000000) {
            return false;
        }
        if (mobileNumber>9999999999) {
            return false;
        }
        return true;
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
            if(student.validMobileNumber) {
                student.selected = true;
            }
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

    selectAllEmployeeColumns(): void {
        Object.keys(this.employeeColumnFilter).forEach((key) => {
            this.employeeColumnFilter[key] = true;
        });
    };

    unSelectAllEmployeeColumns(): void {
        Object.keys(this.employeeColumnFilter).forEach((key) => {
            this.employeeColumnFilter[key] = false;
        });
    };

    selectAllEmployees(): void {
        this.employeeProfileList.forEach(employee => {
            if(employee.validMobileNumber) {
                employee.selected = true;
            }
        });
    }

    unSelectAllEmployees(): void {
        this.employeeProfileList.forEach(employee => {
            employee.selected = false;
        });
    }

    getSelectedStudentNumber(): number {
        let result = 0;
        this.studentFullProfileList.forEach(student => {
            if (student.show && student.selected) {
                ++result;
            }
        });
        return result;
    }

    getSelectedEmployeeNumber(): number {
        let result = 0;
        this.employeeProfileList.forEach(employee => {
            if (employee.selected) {
                ++result;
            }
        });
        return result;
    }

}
