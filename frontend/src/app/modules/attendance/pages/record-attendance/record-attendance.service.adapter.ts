import { RecordAttendanceComponent } from './record-attendance.component';
import { ATTENDANCE_STATUS_LIST } from '../../classes/constants';
import {CommonFunctions} from '@classes/common-functions';
import {getValidStudentSectionList} from '@modules/classes/valid-student-section-service';
import {CommonFunctions as moduleCommonFunctions} from '@modules/common/common-functions';

export class RecordAttendanceServiceAdapter {
    vm: RecordAttendanceComponent;

    constructor() {}

    initializeAdapter(vm: RecordAttendanceComponent): void {
        this.vm = vm;
    }

    async initializeData() {
        this.vm.isInitialLoading = true;
        // ------------------- Initial Data Fetching Starts ---------------------

        const routeInformation = moduleCommonFunctions.getModuleTaskPaths();
        const in_page_permission_request = {
            parentTask__parentModule__path: routeInformation.modulePath,
            parentTask__path: routeInformation.taskPath,
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

         this.vm.inPagePermissionMappedByKey = (await
             this.vm.employeeService.getObject(this.vm.employeeService.employee_permissions, in_page_permission_request)).configJSON;

        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        let request_attendance_permission_list_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentEmployee: this.vm.user.activeSchool.employeeId
        };

        const value = await Promise.all([
            this.vm.attendanceService.getObjectList(
                this.vm.attendanceService.attendance_permission,
                request_attendance_permission_list_data
            ), //0
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //1
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //2
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt), //3
            this.vm.smsService.getObjectList(this.vm.smsService.sms_event,
                { id__in: this.vm.ATTENDANCE_UPDATION_EVENT_DBID + ',' + this.vm.ATTENDANCE_CREATION_EVENT_DBID }) //4
        ]);
        // ------------------- Initial Data Fetching Ends ---------------------

        this.vm.smsBalance = value[3].count;
        this.vm.backendData.attendanceSMSEventList = value[4];

        this.vm.dataForMapping['classList'] = value[1];
        this.vm.dataForMapping['divisionList'] = value[2];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        let fetch_event_settings_list = {
            SMSEventId__in: this.vm.backendData.attendanceSMSEventList.map(a => a.id).join(),
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        if (this.vm.backendData.attendanceSMSEventList.length > 0) {
            this.vm.backendData.eventSettingsList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, fetch_event_settings_list);
        }
        // ------------------- Initial Data Fetching Ends ---------------------
        let class_permission_list = [];
        let division_permission_list = [];
        if (this.vm.hasAdminPermission()) {
            class_permission_list = value[1].map(classs => classs.id);
            division_permission_list = value[2].map(div => div.id);
        } else {
            value[1].forEach((element) => {
                class_permission_list.push(element.id);
            });
            value[2].forEach((element) => {
                division_permission_list.push(element.id);
            });
        }
        // ------------------- Fetching Valid Student Data Starts ---------------------
        let student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
            parentClass__in: class_permission_list,
            parentDivision__in: division_permission_list,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let studentSectionList = await getValidStudentSectionList(this.vm.tcService, this.vm.studentService, student_section_data);
        this.vm.dataForMapping['studentSectionList'] = studentSectionList;
        let student_data = {
            id__in: studentSectionList.map(studentSection => studentSection.parentStudent).join(','),
            fields__korangle: 'id,name,mobileNumber,scholarNumber,parentTransferCertificate',
        };
        const studentDataList = await this.vm.studentService.getObjectList(this.vm.studentService.student, student_data);
        // ------------------- Fetching Valid Student Data Ends ---------------------
        // ------------------- Initialization of the ClassSectionStudentList using initial and student data ---------------------
        this.initializeClassSectionStudentList(value[1], value[2], studentSectionList, studentDataList, value[0]);
        this.vm.isInitialLoading = false;

    }

    initializeClassSectionStudentList(
        classList: any,
        divisionList: any,
        studentSectionList: any,
        studentDetailsList: any,
        attendancePermissionList: any
    ): any {
        this.vm.classSectionStudentList = [];
        studentSectionList.forEach((studentSection) => {
            if (this.vm.hasAdminPermission() || this.vm.classSectionInPermissionList(studentSection.parentClass, studentSection.parentDivision,
                attendancePermissionList)) {
                let classIndex = -1;
                let tempIndex = 0;
                this.vm.classSectionStudentList.forEach((classs) => {
                    if (classs.dbId == studentSection.parentClass) {
                        classIndex = tempIndex;
                        return;
                    }
                    tempIndex = tempIndex + 1;
                });
                if (classIndex === -1) {
                    let classs = classList.find((classs) => classs.id === studentSection.parentClass);
                    let tempClass = {
                        name: classs.name,
                        dbId: classs.id,
                        sectionList: [],
                    };
                    this.vm.classSectionStudentList.push(tempClass);
                    let tempIndex = 0;
                    this.vm.classSectionStudentList.forEach((classs) => {
                        if (classs.dbId == studentSection.parentClass) {
                            classIndex = tempIndex;
                            return;
                        }
                        tempIndex = tempIndex + 1;
                    });
                }
                let divisionIndex = -1;
                tempIndex = 0;
                this.vm.classSectionStudentList[classIndex].sectionList.forEach((division) => {
                    if (division.dbId == studentSection.parentDivision) {
                        divisionIndex = tempIndex;
                        return;
                    }
                    tempIndex = tempIndex + 1;
                });

                if (divisionIndex === -1) {
                    let division = divisionList.find((division) => division.id === studentSection.parentDivision);
                    let tempDivision = {
                        name: division.name,
                        dbId: division.id,
                        studentList: [],
                    };
                    this.vm.classSectionStudentList[classIndex].sectionList.push(tempDivision);
                    tempIndex = 0;
                    this.vm.classSectionStudentList[classIndex].sectionList.forEach((division) => {
                        if (division.dbId == studentSection.parentDivision) {
                            divisionIndex = tempIndex;
                            return;
                        }
                        tempIndex = tempIndex + 1;
                    });
                }
                let studentDetails = studentDetailsList.find((studentDetails) => studentDetails.id == studentSection.parentStudent);
                let tempData = {
                    id: studentDetails.id,
                    name: studentDetails.name,
                    dbId: studentDetails.id,
                    scholarNumber: studentDetails.scholarNumber,
                    mobileNumber: studentDetails.mobileNumber,
                    rollNumber: studentSection.rollNumber
                };
                this.vm.classSectionStudentList[classIndex].sectionList[divisionIndex].studentList.push(tempData);
            }
        });
        // ------------------- Populating  classSectionStudentList Ends ---------------------

        // ------------------- Sorting Students with Roll Number, names (A-Z), Sections and Classes with DbId Starts ---------------------
        this.vm.classSectionStudentList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.studentList.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

                section.studentList.sort((a, b) =>
                (a.rollNumber || a.name.toUpperCase()).localeCompare((b.rollNumber || b.name.toUpperCase()), 'en', { numeric: true }));
            });
            classs.sectionList.sort((a, b) => (a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0));
        });
        this.vm.classSectionStudentList.sort((a, b) => (a.dbId < b.dbId ? -1 : a.dbId > b.dbId ? 1 : 0));
        if (this.vm.classSectionStudentList.length > 0) {
            this.vm.selectedClass = this.vm.classSectionStudentList[0];
            this.vm.changeSelectedSectionToFirst();
        }
        // ------------------- Sorting Students with Roll Number, names (A-Z), Sections and Classes with DbId Ends ---------------------
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
                        let tempStudent =  CommonFunctions.getInstance().copyObject(student);
                        tempStudent['attendanceStatusList'] = [];
                        let dateList = this.vm.getDateList();
                        dateList.forEach((date) => {
                            tempStudent.attendanceStatusList.push(this.vm.getStudentAttendanceStatusObject(student, date, attendanceList));
                        });
                        this.vm.studentAttendanceStatusList.push(tempStudent);
                    });
                }
            });
        });
        this.vm.changeSortType();
        this.vm.messageService.fetchGCMDevicesNew(this.vm.studentAttendanceStatusList);
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

    async notifyParents() {
        let createdStudentList = [];
        let updatedStudentList = [];
        let createdSettings = this.vm.backendData.eventSettingsList.find(sett => sett.SMSEventId == this.vm.ATTENDANCE_CREATION_EVENT_DBID);
        let updatedSettings = this.vm.backendData.eventSettingsList.find(sett => sett.SMSEventId == this.vm.ATTENDANCE_UPDATION_EVENT_DBID);
        this.vm.studentAttendanceStatusList.forEach((student) => {
            student.attendanceStatusList.forEach((attendanceStatus) => {
                let previousAttendanceIndex = this.vm.getPreviousAttendanceIndex(student, attendanceStatus.date);
                if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== attendanceStatus.status) {
                    if (attendanceStatus.status !== null && this.checkMobileNumber(student.mobileNumber) == true) {
                        let tempData = CommonFunctions.getInstance().copyObject(student);
                        tempData['attendance'] = {
                            attendanceDate: this.vm.formatDate(attendanceStatus.date.toString(), ''),
                            attendanceStatus: attendanceStatus.status
                        };
                        if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[1]) {
                            if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== null) {
                                updatedStudentList.push(tempData);
                            }else {
                                createdStudentList.push(tempData);
                            }
                        }
                        if (attendanceStatus.status === ATTENDANCE_STATUS_LIST[0]) {
                            if (this.vm.currentAttendanceList[previousAttendanceIndex].status !== null &&
                                updatedSettings.receiverType == this.vm.receiverList[0]) {
                                updatedStudentList.push(tempData);
                            }else if (createdSettings.receiverType == this.vm.receiverList[0]) {
                                createdStudentList.push(tempData);
                            }
                        }
                    }
                    this.vm.currentAttendanceList[previousAttendanceIndex].status = attendanceStatus.status;
                }
            });
        });
        let currentDate = new Date();
        if (this.vm.by == 'date' && this.vm.startDate == this.vm.formatDate(currentDate, '')) {

            if (createdStudentList.length > 0) {
                console.log(createdStudentList);
                this.vm.dataForMapping['studentList'] =  createdStudentList;
                await this.vm.messageService.fetchEventDataAndSendEventSMSNotification(
                   this.vm.dataForMapping,
                    ['student'],
                    this.vm.ATTENDANCE_CREATION_EVENT_DBID,
                    this.vm.user.activeSchool.dbId,
                    this.vm.smsBalance
                );
            }

            if (updatedStudentList.length > 0) {
                console.log(updatedStudentList);
                this.vm.dataForMapping['studentList'] = updatedStudentList;
                console.log( this.vm.dataForMapping);
                this.vm.messageService.fetchEventDataAndSendEventSMSNotification(
                    this.vm.dataForMapping,
                    ['student'],
                    this.vm.ATTENDANCE_UPDATION_EVENT_DBID,
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
