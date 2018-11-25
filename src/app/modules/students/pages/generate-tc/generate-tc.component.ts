import { Component, Input, OnInit } from '@angular/core';

import { Student } from '../../../../classes/student';
import { Classs } from '../../../../classes/classs';
import { Section } from '../../../../classes/section';

import { TransferCertificate } from '../../classes/transfer-certificate';

import { StudentService } from '../../student.service';
import { SchoolService } from '../../../../services/school.service';

import { EmitterService } from '../../../../services/emitter.service';

@Component({
  selector: 'generate-tc',
  templateUrl: './generate-tc.component.html',
  styleUrls: ['./generate-tc.component.css'],
    providers: [ StudentService, SchoolService ],
})

export class GenerateTcComponent implements OnInit {

    @Input() user;

    selectedClass: Classs;
    selectedSection: Section;
    selectedStudent: Student;

    selectedTransferCertificate: TransferCertificate = new TransferCertificate();

    currentTransferCertificate: TransferCertificate = new TransferCertificate();

    classSectionStudentList: Classs[] = [];

    showDetails: boolean = false;

    isLoading = false;
    isStudentListLoading = false;

    twoCopies = false;

    selectedSession: any;
    sessionList: any;

    constructor (private studentService: StudentService,
                 private schoolService: SchoolService) { }

    changeSelectedSectionToFirst(): void {
        this.selectedSection = this.selectedClass.sectionList[0];
        this.changeSelectedStudentToFirst();
    }

    changeSelectedStudentToFirst(): void {
        this.selectedStudent = this.selectedSection.studentList[0];
        // this.currentTransferCertificate.copy(this.selectedStudent);
        this.showDetails = false;
    }

    handleSessionChange(): void {
        this.getStudentList(this.selectedSession.dbId);
    }

    ngOnInit(): void {
        this.getSessionList();
        this.getStudentList(this.user.activeSchool.currentSessionDbId);
    }

    getSessionList(): void {
        this.schoolService.getSessionList(this.user.jwt).then(sessionList => {
            this.sessionList = sessionList;
            this.sessionList.every(session => {
                if (session.dbId === this.user.activeSchool.currentSessionDbId) {
                    this.selectedSession = session;
                    return false;
                }
                return true;
            });
        });
    }

    getStudentList(sessionDbId: number): void {
        const data = {
            sessionDbId: sessionDbId,
            schoolDbId: this.user.activeSchool.dbId,
        };
        this.isStudentListLoading = true;
        this.studentService.getClassSectionStudentList(data, this.user.jwt).then(classSectionStudentList => {
            this.isStudentListLoading = false;
            this.classSectionStudentList = [];
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
                        tempStudent.parentTransferCertificate = student.parentTransferCertificate;
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
        }, error => {
            this.isStudentListLoading = false;
        });
    }

    getStudentProfile(): void {
        this.isLoading = true;
        const student_data = {
            studentDbId: this.selectedStudent.dbId,
            sessionDbId: this.selectedSession.dbId,
        };
        if (this.selectedStudent.parentTransferCertificate) {
            const transfer_certificate_data = {
                id: this.selectedStudent.parentTransferCertificate,
            };
            Promise.all([
                this.studentService.getStudentProfile(student_data, this.user.jwt),
                this.studentService.getTransferCertificate(transfer_certificate_data, this.user.jwt),
            ]).then(value => {
                this.isLoading = false;
                if (this.selectedStudent.dbId === value[0].dbId) {
                    this.selectedStudent.copy(value[0]);
                }
                if (this.selectedStudent.parentTransferCertificate === value[1].id) {
                    this.selectedTransferCertificate.copy(value[1]);
                    this.currentTransferCertificate.copy(value[1]);
                }
                this.showDetails = true;
            }, error => {
                this.isLoading = false;
            });
        } else {
            this.studentService.getStudentProfile(student_data, this.user.jwt).then(
                student => {
                    this.isLoading = false;
                    if (this.selectedStudent.dbId === student.dbId) {
                        this.selectedStudent.copy(student);
                        this.selectedTransferCertificate.clean();
                        this.currentTransferCertificate.clean();
                    }
                    this.showDetails = true;
                }, error => {
                    this.isLoading = false;
                }
            );
        }
    }

    isValidCertificate(): boolean {
        if (this.currentTransferCertificate.certificateNumber == null) {
            alert('Certificate Number field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.issueDate == null) {
            alert('Issue Date field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.leavingDate == null) {
            alert('Leaving Date field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.leavingReason == null) {
            alert('Leaving Reason field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.lastClassPassed == null) {
            alert('Last Class passed field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.leavingMidSession == null) {
            alert('Leaving Mid Session field should be filled');
            return false;
        }
        if (this.currentTransferCertificate.admissionClass == null) {
            alert('Admission Class should be filled');
            return false;
        }
        return true;
    }

    generateTC(): void {
        if (!this.isValidCertificate()) {
            return;
        }
        this.isLoading = true;
        let selectedStudentId = this.selectedStudent.dbId;
        this.studentService.createTransferCertificate(this.currentTransferCertificate, this.user.jwt).then(
            response => {
                // alert(response.message);
                if (response.id !== 0) {
                    const data = {
                        id: selectedStudentId,
                        parentTransferCertificate: response.id,
                    };
                    this.studentService.partiallyUpdateStudentFullProfile(data, this.user.jwt).then(
                        response => {
                            this.isLoading = false;
                            if (response.status === 'success') {
                                alert('Transfer Certificate generated successfully');
                                this.currentTransferCertificate.id = data.parentTransferCertificate;
                                this.selectedTransferCertificate.copy(this.currentTransferCertificate);
                                this.printTCSecondFormat();
                            } else {
                                alert('Failed to link generated transfer certificate to student, Contact Admin');
                            }
                        }
                    );
                } else {
                    this.isLoading = false;
                    alert('Failed to generate Transfer Certificate');
                }
            }, error => {
                this.isLoading = false;
            }
        );
    }

    updateTC(): void {
        if (!this.isValidCertificate()) {
            return;
        }
        this.isLoading = true;
        this.studentService.updateTransferCertificate(this.currentTransferCertificate, this.user.jwt).then(
            response => {
                this.isLoading = false;
                alert(response.message);
                this.selectedTransferCertificate.copy(this.currentTransferCertificate);
            }, error => {
                this.isLoading = false;
            }
        );
    }

    printTCSecondFormat(): void {
        const value = {
            studentProfile: this.selectedStudent,
            transferCertificate: this.selectedTransferCertificate,
            twoCopies: this.twoCopies,
        };
        EmitterService.get('print-transfer-certificate-second-format').emit(value);
    }

}
