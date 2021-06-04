import { RecordAttendanceComponent } from './record-attendance.component';
import { ATTENDANCE_STATUS_LIST } from '../../classes/constants';
import moment = require('moment');

export class RecordAttendanceServiceAdapter {
    vm: RecordAttendanceComponent;

    attendanceEvents = ['Attendance Creation', 'Attendance Updation'];

    constructor() {}
    // Data

    initializeAdapter(vm: RecordAttendanceComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isInitialLoading = true;
        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        let request_attendance_permission_list_data = {
            parentEmployee: this.vm.user.activeSchool.employeeId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const value = await Promise.all([
            this.vm.smsService.getObjectList(this.vm.smsService.sms_event, {eventName__in: this.attendanceEvents}), //0
            this.vm.attendanceService.getObjectList(
                this.vm.attendanceService.attendance_permission,
                request_attendance_permission_list_data
            ), //1
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //2
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //3
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt), //4

        ]);
        this.vm.smsBalance = value[4];
        this.vm.dataForMapping['classList'] = value[2];
        this.vm.dataForMapping['divisionList'] = value[3];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        this.vm.backendData.eventList = value[0];
        let fetch_event_settings_list = {
            parentSMSEvent__in: this.vm.backendData.eventList.map(a => a.id).join(),
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        if (this.vm.backendData.eventList.length > 0) {
            this.vm.backendData.eventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, fetch_event_settings_list);
        }
        let class_permission_list = [];
        let division_permission_list = [];
        value[1].forEach((element) => {
            class_permission_list.push(element.parentClass);
            division_permission_list.push(element.parentDivision);
        });
        let student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentClass__in: class_permission_list,
            parentDivision__in: division_permission_list,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const secondValue = await Promise.all([this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data)]);
        this.vm.dataForMapping['studentSection'] = secondValue[0];
        let student_id_list = [];
        let student_data = {
            id__in: student_id_list,
            fields__korangle: 'id,name,mobileNumber,scholarNumber,parentTransferCertificate',
        };
        secondValue[0].forEach((element) => {
            student_id_list.push(element.parentStudent);
        });
        const thirdValue = await Promise.all([this.vm.studentService.getObjectList(this.vm.studentService.student, student_data)]);
        this.initializeClassSectionStudentList(value[2], value[3], secondValue[0], thirdValue[0], value[1]);
        this.vm.isInitialLoading = false;

    }

    initializeClassSectionStudentList(
        classList: any,
        divisionList: any,
        studentList: any,
        studentDetailsList: any,
        attendancePermissionList: any
    ): any {
        this.vm.classSectionStudentList = [];
        studentList.forEach((student) => {
            if (this.vm.classSectionInPermissionList(student.parentClass, student.parentDivision, attendancePermissionList)) {
                let classIndex = -1;
                let tempIndex = 0;
                this.vm.classSectionStudentList.forEach((classs) => {
                    if (classs.dbId == student.parentClass) {
                        classIndex = tempIndex;
                        return;
                    }
                    tempIndex = tempIndex + 1;
                });
                if (classIndex === -1) {
                    let classs = classList.find((classs) => classs.id === student.parentClass);
                    let tempClass = {
                        name: classs.name,
                        dbId: classs.id,
                        sectionList: [],
                    };
                    this.vm.classSectionStudentList.push(tempClass);
                    let tempIndex = 0;
                    this.vm.classSectionStudentList.forEach((classs) => {
                        if (classs.dbId == student.parentClass) {
                            classIndex = tempIndex;
                            return;
                        }
                        tempIndex = tempIndex + 1;
                    });
                }
                let divisionIndex = -1;
                tempIndex = 0;
                this.vm.classSectionStudentList[classIndex].sectionList.forEach((division) => {
                    if (division.dbId == student.parentDivision) {
                        divisionIndex = tempIndex;
                        return;
                    }
                    tempIndex = tempIndex + 1;
                });

                if (divisionIndex === -1) {
                    let division = divisionList.find((division) => division.id === student.parentDivision);
                    let tempDivision = {
                        name: division.name,
                        dbId: division.id,
                        studentList: [],
                    };
                    this.vm.classSectionStudentList[classIndex].sectionList.push(tempDivision);
                    tempIndex = 0;
                    this.vm.classSectionStudentList[classIndex].sectionList.forEach((division) => {
                        if (division.dbId == student.parentDivision) {
                            divisionIndex = tempIndex;
                            return;
                        }
                        tempIndex = tempIndex + 1;
                    });
                }
                let studentDetails = studentDetailsList.find((studentDetails) => studentDetails.id == student.parentStudent);
                 studentDetails['dbId'] =  studentDetails.id;
                this.vm.classSectionStudentList[classIndex].sectionList[divisionIndex].studentList.push(studentDetails);
            }
        });
        this.vm.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.studentList.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
            });
            classs.sectionList.sort((a, b) => (a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0));
        });
        this.vm.classSectionStudentList.sort((a, b) => (a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0));
        if (this.vm.classSectionStudentList.length > 0) {
            this.vm.selectedClass = this.vm.classSectionStudentList[0];
            this.vm.changeSelectedSectionToFirst();
        }
    }

    getStudentsAttendanceStatusList(): void {
        this.vm.isLoading = true;
        this.vm.showStudentList = true;
        this.vm.currentAttendanceList = [];

        let data = {
            parentStudent__in: this.getStudentIdList(),
            dateOfAttendance__gte: this.vm.startDate,
            dateOfAttendance__lte: this.vm.endDate,
        };

        this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, data).then(
            (attendanceList) => {
                this.vm.isLoading = false;
                attendanceList.forEach((element) => {
                    this.vm.currentAttendanceList.push(element);
                });
                this.populateStudentAttendanceList(attendanceList);
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateStudentAttendanceList(attendanceList: any) {
        this.vm.studentAttendanceStatusList = [];
        this.vm.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (this.vm.selectedSection.dbId === section.dbId && classs.dbId === this.vm.selectedClass.dbId) {
                    section.studentList.forEach((student) => {
                        student['attendanceStatusList'] = [];
                        let dateList = this.vm.getDateList();
                        dateList.forEach((date) => {
                            student.attendanceStatusList.push(this.vm.getStudentAttendanceStatusObject(student, date, attendanceList));
                        });
                        this.vm.studentAttendanceStatusList.push(student);
                    });
                }
            });
        });
        this.vm.updateService.fetchGCMDevicesNew(this.vm.studentAttendanceStatusList);
    }

    updateStudentAttendanceList(): void {
        let data = this.vm.prepareStudentAttendanceStatusListData();
        if (data.length === 0) {
            return;
        }
        const promises = [];
        let toCreateAttendance = [];
        let toUpdateAttendance = [];
        data.forEach((attendance) => {
            let tempData = {
                dbId: attendance.parentStudent,
            };
            let previousAttendanceIndex = this.vm.getPreviousAttendanceIndex(tempData, new Date(attendance.dateOfAttendance));
            if (this.vm.currentAttendanceList[previousAttendanceIndex].id == null) {
                toCreateAttendance.push(attendance);
            } else {
                let tempData = {
                    id: this.vm.currentAttendanceList[previousAttendanceIndex].id,
                    dateOfAttendance: attendance.dateOfAttendance,
                    status: attendance.status,
                    parentStudent: attendance.parentStudent,
                };
                toUpdateAttendance.push(tempData);
            }
        });
        promises.push(this.vm.attendanceService.createObjectList(this.vm.attendanceService.student_attendance, toCreateAttendance));
        promises.push(this.vm.attendanceService.updateObjectList(this.vm.attendanceService.student_attendance, toUpdateAttendance));
        this.vm.isLoading = true;
        Promise.all(promises).then(
            (response) => {
                response[0].forEach((element) => {
                    let previousIndex = this.vm.currentAttendanceList.find(
                        (attendance) =>
                            attendance.parentStudent == element.parentStudent && attendance.dateOfAttendance == element.dateOfAttendance
                    );
                    previousIndex.id = element.id;
                });
                this.notifyParents();
                alert('Student Attendance recorded successfully');
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    notifyParents(): void {
        this.vm.createdStudentList = [];
        this.vm.updatedStudentList = [];
        let createdSettings = this.vm.backendData.eventSettingsList.find(sett => sett.parentSMSEvent == this.vm.backendData.eventList.find
        (event => event.eventName == 'Attendance Creation').id);
        let updatedSettings = this.vm.backendData.eventSettingsList.find(sett => sett.parentSMSEvent == this.vm.backendData.eventList.find
        (event => event.eventName == 'Attendance Updation').id);
        this.vm.studentAttendanceStatusList.forEach((student) => {
            student.attendanceStatusList.forEach((attendanceStatus) => {
                let previousAttendanceIndex = this.vm.getPreviousAttendanceIndex(student, attendanceStatus.date);
                if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== attendanceStatus.status) {
                    if (attendanceStatus.status !== null && this.checkMobileNumber(student.mobileNumber) == true) {
                        student['attendance'] = {
                            attendanceDate: this.vm.formatDate(attendanceStatus.date.toString(), ''),
                            attendanceStatus: attendanceStatus.status
                        };
                        if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                            if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== null) {
                                this.vm.updatedStudentList.push(student);
                            }else {
                                this.vm.createdStudentList.push(student);
                            }
                        }
                        if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[0]) {
                            if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== null &&
                                updatedSettings.receiverType == this.vm.receiverList[0]) {
                                this.vm.updatedStudentList.push(student);
                            }else if (createdSettings.receiverType == this.vm.receiverList[0]) {
                                this.vm.createdStudentList.push(student);
                            }
                        }
                    }
                    this.vm.currentAttendanceList[previousAttendanceIndex].status = attendanceStatus.status;
                }
            });
        });
        let currentDate = new Date();
        if (this.vm.by == 'date' && this.vm.startDate == this.vm.formatDate(currentDate, '')) {

            if (this.vm.createdStudentList.length > 0) {
                this.vm.dataForMapping['studentList'] = this.vm.createdStudentList;
                this.vm.updateService.sendEventNotification(
                    this.vm.createdStudentList,
                    'Attendance Creation',
                    this.vm.user.activeSchool.dbId,
                    this.vm.smsBalance
                );
            }

            if (this.vm.updatedStudentList.length > 0) {
                this.vm.dataForMapping['studentList'] = this.vm.updatedStudentList;
                this.vm.updateService.sendEventNotification(
                    this.vm.dataForMapping,
                    'Attendance Updation',
                    this.vm.user.activeSchool.dbId,
                    this.vm.smsBalance
                );
            }
        }
    }

    getStudentIdList(): any {
        let studentIdList = [];
        this.vm.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                if (this.vm.selectedSection.dbId === section.dbId && classs.dbId === this.vm.selectedClass.dbId) {
                    section.studentList.forEach((student) => {
                        studentIdList.push(student.dbId);
                    });
                }
            });
        });
        return studentIdList;
    }

    checkMobileNumber(mobileNumber: number): boolean {
        return mobileNumber && mobileNumber.toString().length == 10;
    }
}
