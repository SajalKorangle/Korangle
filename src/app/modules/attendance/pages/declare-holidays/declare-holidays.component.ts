import {Component, Input, OnInit } from '@angular/core';

import { AttendanceService } from '../../attendance.service';
import {StudentService} from '../../../students/student.service';
import {ATTENDANCE_STATUS_LIST} from '../../classes/constants';

@Component({
  selector: 'declare-holidays',
  templateUrl: './declare-holidays.component.html',
  styleUrls: ['./declare-holidays.component.css'],
    providers: [ AttendanceService, StudentService ],
})

export class DeclareHolidaysComponent implements OnInit {

    @Input() user;

    classSectionStudentList = [];

    by = 'date';

    startDate = null;
    endDate = null;

    isLoading = false;

    constructor (private attendanceService: AttendanceService,
                 private studentService: StudentService) { }

    ngOnInit(): void {

        let request_student_data = {
            schoolDbId: this.user.activeSchool.dbId,
            sessionDbId: this.user.activeSchool.currentSessionDbId,
        };

        this.isLoading = true;

        Promise.all([
            this.studentService.getClassSectionStudentList(request_student_data, this.user.jwt),
        ]).then(value => {
            this.isLoading = false;
            this.initializeClassSectionStudentList(value[0]);
        }, error => {
            this.isLoading = false;
        });

    }

    initializeClassSectionStudentList(classSectionStudentList: any): void {
        classSectionStudentList.forEach( classs => {
            let tempClass = {
                name: classs.name,
                dbId: classs.dbId,
                sectionList: [],
            };
            classs.sectionList.forEach( section => {
                let tempSection = {
                    name: section.name,
                    dbId: section.dbId,
                    selected: false,
                    studentList: [],
                };
                section.studentList.forEach( student => {
                    if (student.parentTransferCertificate === null) {
                        let tempStudent = {
                            name: student.name,
                            dbId: student.dbId,
                            scholarNumber: student.scholarNumber
                        };
                        tempSection.studentList.push(tempStudent);
                    }
                });
                if (tempSection.studentList.length > 0) {
                    tempClass.sectionList.push(tempSection);
                }
            });
            if (tempClass.sectionList.length > 0) {
                this.classSectionStudentList.push(tempClass);
            }
        });
    }

    // Server Handling - 1
    declareHoliday(): void {

        let data = this.prepareStudentAttendanceStatusListData();

        if (data.length === 0) {
            alert('Nothing to update');
            return;
        }

        this.isLoading = true;
        this.attendanceService.recordAttendance(data, this.user.jwt).then(response => {
            this.isLoading = false;
            alert(response);
        }, error => {
            this.isLoading = false;
        });

    }

    prepareStudentAttendanceStatusListData(): any {
        let studentAttendanceStatusListData = [];
        this.classSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                if (section.selected) {
                    section.studentList.forEach(student => {
                        this.getDateList().forEach(date => {
                            let tempData = {
                                parentStudent: student.dbId,
                                dateOfAttendance: this.formatDate(date.toString(), ''),
                                status: ATTENDANCE_STATUS_LIST[2],
                            };
                            studentAttendanceStatusListData.push(tempData);
                        });
                    });
                }
            });
        });
        return studentAttendanceStatusListData;
    }


    // Server Handling - 2
    getStudentIdList(): any {
        let studentIdList = [];
        this.classSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                if (section.selected) {
                    section.studentList.forEach(student => {
                        studentIdList.push(student.dbId);
                    });
                }
            });
        });
        return studentIdList;
    }

    deleteAttendance(): void {

        if (!confirm('Are you sure, you want to delete all the attendance records for selected classes and dates')) {
            return;
        }

        let studentList = this.getStudentIdList();

        if (studentList.length === 0) {
            alert('Nothing to delete');
            return;
        }

        let data = {
            studentIdList: studentList,
            startDate: this.startDate,
            endDate: this.endDate,
        };

        this.isLoading = true;
        this.attendanceService.deleteAttendance(data, this.user.jwt).then(response => {
            this.isLoading = false;
            alert(response);
        }, error => {
            this.isLoading = false;
        });

    }

    // Called from Html files
    unselectAllClasses(): void {
        this.classSectionStudentList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = false;
                });
            }
        );
    };

    selectAllClasses(): void {
        this.classSectionStudentList.forEach(
            classs => {
                classs.sectionList.forEach(section => {
                    section.selected = true;
                });
            }
        );
    };

    getSelectedClasses(): any {
        let all = true;
        let selectedClasses = '';
        this.classSectionStudentList.forEach(classs => {
            classs.sectionList.forEach(section => {
                if (section.selected) {
                    selectedClasses += classs.name + (classs.sectionList.length > 1 ? ' (' + section.name + ')': '') + ', ';
                } else {
                    all = false;
                }
            });
        });
        return (all ?
            'All' : (selectedClasses.length > 0) ?
                selectedClasses.substr(0, selectedClasses.length-2) : '');
    }

    onDateSelected(event: any): void {
        this.startDate = this.formatDate(event, '');
        this.endDate = this.startDate;
    }

    onStartDateSelected(event: any): void {
        this.startDate = this.formatDate(event, '');
    }

    onEndDateSelected(event: any): void {
        this.endDate = this.formatDate(event, '');
    }

    formatDate(dateStr: any, status: any): any {

        let d = new Date(dateStr);

        if (status === 'firstDate') {
            d = new Date(d.getFullYear(), d.getMonth(), 1);
        } else if (status === 'lastDate') {
            d = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        }

        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    getDateList(): any {
        let dateList = [];

        let tempDate = new Date(this.startDate);
        let lastDate = new Date(this.endDate);

        while(tempDate <= lastDate) {
            dateList.push(new Date(tempDate));
            tempDate.setDate(tempDate.getDate() + 1);
        }

        return dateList;
    }

}
