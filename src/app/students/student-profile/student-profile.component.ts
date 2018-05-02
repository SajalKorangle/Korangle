import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../classes/student';
import { Classs } from '../../classes/classs';
import { Section } from '../../classes/section';

import { StudentService } from '../../students/student.service';
import {BusStopService} from '../../services/bus-stop.service';

import { EmitterService } from '../../services/emitter.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css'],
    providers: [ StudentService, BusStopService ],
})
export class StudentProfileComponent implements OnInit {

    @Input() user;

    selectedClass: Classs;
    selectedSection: Section;
    selectedStudent: Student;

    classSectionStudentList: Classs[] = [];

    currentStudent: Student = new Student();

    busStopList = [];

    isLoading = false;

    constructor (private studentService: StudentService,
                 private busStopService: BusStopService) { }

    changeSelectedSectionToFirst(): void {
        this.selectedSection = this.selectedClass.sectionList[0];
        this.changeSelectedStudentToFirst();
    }

    changeSelectedStudentToFirst(): void {
        this.selectedStudent = this.selectedSection.studentList[0];
        this.currentStudent.copy(this.selectedStudent);
    }

    ngOnInit(): void {
        const data = {
            sessionDbId: this.user.schoolCurrentSessionDbId,
        }
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(
            classSectionStudentList => {
                classSectionStudentList.forEach( classs => {
                    const tempClass = new Classs();
                    tempClass.name = classs.name;
                    tempClass.dbId = classs.dbId;
                    classs.sectionList.forEach( section => {
                        const tempSection = new Section();
                        tempSection.name = section.name;
                        tempSection.dbId = section.dbId;
                        section.studentList.forEach( student => {
                            const tempStudent = new Student();
                            tempStudent.name = student.name;
                            tempStudent.dbId = student.dbId;
                            tempSection.studentList.push(tempStudent);
                        });
                        tempClass.sectionList.push(tempSection);
                    });
                    this.classSectionStudentList.push(tempClass);
                });
                if (this.classSectionStudentList.length > 0) {
                    this.selectedClass = this.classSectionStudentList[0];
                    this.changeSelectedSectionToFirst();
                } else {
                    alert('Student needs to be added first, before profile updation');
                }

            }
        );

        const dataForBusStop = {
            schoolDbId: this.user.schoolDbId,
        }

        this.busStopService.getBusStopList(dataForBusStop, this.user.jwt).then( busStopList => {
            this.busStopList = busStopList;
        });
    }

    getStudentProfile(): void {
        this.isLoading = true;
        const data = {
            studentDbId: this.selectedStudent.dbId,
            sectionDbId: this.selectedSection.dbId,
        };
        this.studentService.getStudentProfile(data, this.user.jwt).then(
            student => {
                this.isLoading = false;
                const breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    this.currentStudent.copy(student);
                    console.log(this.selectedStudent);
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

    updateProfile(): void {
        if (this.currentStudent.busStopDbId == 0) {
            this.currentStudent.busStopDbId = null;
        }
        if (this.currentStudent.familySSMID
            && this.currentStudent.familySSMID.toString().length !== 0
            && this.currentStudent.familySSMID.toString().length !== 8) {
            alert('Number of digits in Family SSMID should be 8');
            return;
        }
        if (this.currentStudent.childSSMID
            && this.currentStudent.childSSMID.toString().length !== 0
            && this.currentStudent.childSSMID.toString().length !== 9) {
            alert('Number of digits in Child SSMID should be 9');
            return;
        }
        if (this.currentStudent.aadharNum
            && this.currentStudent.aadharNum.toString().length !== 0
            && this.currentStudent.aadharNum.toString().length !== 12) {
            alert('Number of digits in Aadhar No. should be 12');
            return;
        }
        this.isLoading = true;
        /*const data = {
            student: Student,
        }
        data.student = new Student();
        data.student.copy(this.currentStudent);*/
        this.studentService.updateStudentProfile(this.currentStudent, this.user.jwt).then(
            student => {
                this.isLoading = false;
                let breakLoop = false;
                if (this.selectedStudent.dbId === student.dbId) {
                    this.selectedStudent.copy(student);
                    alert('Student updated successfully');
                } else {
                    this.classSectionStudentList.forEach( classs => {
                        classs.studentList.forEach( tempStudent => {
                            if (tempStudent.dbId === student.dbId) {
                                tempStudent.copy(student);
                                breakLoop = true;
                                return;
                            }
                        });
                        if (breakLoop) { return; }
                    });
                    alert('Student: ' + student.name + ' updated successfully');
                }
            }
        );
    }

    deleteProfile(): void {
        if (!confirm('Are you sure you want to delete ' + this.currentStudent.name + '\'s profile.')) {
            return;
        }
        this.isLoading = true;
        this.studentService.deleteStudentProfile(this.currentStudent.dbId, this.user.jwt).then( data => {
            alert(data['message']);
            this.isLoading = false;
            let studentIndex = 0;
            this.selectedSection.studentList.forEach( (student, index) => {
                if (student.dbId === data['studentDbId']) {
                    studentIndex = index;
                }
            });
            this.selectedSection.studentList.splice(studentIndex, 1);
            if (this.selectedSection.studentList.length > 0) {
                this.changeSelectedStudentToFirst();
            } else {
                let sectionIndex = 0;
                this.selectedClass.sectionList.forEach( (section, index) => {
                    if (section.dbId === this.selectedSection.dbId) {
                        sectionIndex = index;
                    }
                });
                this.selectedClass.sectionList.splice(sectionIndex, 1);
                if (this.selectedClass.sectionList.length > 0) {
                    this.changeSelectedSectionToFirst();
                } else {
                    let classIndex = 0;
                    this.classSectionStudentList.forEach( (classs, index) => {
                        if (classs.dbId === this.selectedClass.dbId) {
                            classIndex = index;
                        }
                    });
                    this.classSectionStudentList.splice(classIndex, 1);
                    if (this.classSectionStudentList.length > 0) {
                        this.selectedClass = this.classSectionStudentList[0];
                        this.changeSelectedSectionToFirst();
                    } else {
                        alert('No students left, you can add more students from \'New Student\' section');
                        this.selectedClass = null;
                        this.selectedSection = null;
                        this.selectedStudent = null;
                    }
                }
            }
        }, error => {
            this.isLoading = false;
            alert('Server Error: Contact admin');
        });
    }

    getBusStopName(busStopDbId: any) {
        let stopName = 'None';
        if (busStopDbId !== null) {
            this.busStopList.forEach(busStop => {
                if (busStop.dbId == busStopDbId) {
                    stopName = busStop.stopName;
                    console.log(stopName);
                    return;
                }
            });
        }
        return stopName;
    }

    checkFieldChanged(selectedValue, currentValue): boolean {
        if (selectedValue !== currentValue && !(selectedValue == null && currentValue === '')) {
            return true;
        }
        return false;
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

    printTCSecondFormat(): void {
        EmitterService.get('print-transfer-certificate').emit('');
    }

}
