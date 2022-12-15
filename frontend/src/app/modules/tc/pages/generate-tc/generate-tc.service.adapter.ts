import { GenerateTCComponent } from './generate-tc.component';
import { StudentCustomParameterStructure } from './../../class/constants';
import { TC_SCHOOL_FEE_RULE_NAME, DEFAULT_TC_SETTINGS } from './../../class/constants_tc';
import { TransferCertificateNew } from './../../../../services/modules/tc/models/transfer-certificate';

const MAX_LENGTH_OF_GET_REQUEST = 900;

export class GenerateTCServiceAdapter {
    vm: GenerateTCComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: GenerateTCComponent): void {
        this.vm = vm;
    }

    // initialize data
    async initializeData() {

        this.vm.isLoading = true;

        this.vm.DATA.currentSession = this.vm.user.activeSchool.currentSessionDbId;
        const tc_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const request_student_section_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.DATA.data.sessionList = await this.vm.genericService.getObjectList({school_app: 'Session'}, {});

        const nextSession = this.vm.DATA.data.sessionList.find(session => {
            return this.vm.DATA.data.sessionList.find(sessionTwo => {
                return sessionTwo.id == this.vm.user.activeSchool.currentSessionDbId;
            }).orderNumber + 1 == session.orderNumber;
        });
        const request_next_session_student_section_data = {
            parentSession: nextSession ? nextSession.id : 0,
        };

        const request_tc_settings = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.tcService.getObjectList(this.vm.tcService.tc_layout, tc_layouts_data), // 0
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: request_student_section_data}), // 1
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: request_next_session_student_section_data, fields_list: ['parentStudent']}), // 2
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 3
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 4
            this.vm.tcService.getObject(this.vm.tcService.tc_settings, request_tc_settings), // 5
        ]).then((data) => {
            this.vm.tcLayoutList = data[0];
            this.vm.studentSectionList = data[1].filter((ss) => {
                // students who has not been promoted to next session
                const studentId = ss.parentStudent;
                const nextSessionSS = data[2].find((ssNextSession) => ssNextSession.parentStudent == studentId);
                if (nextSessionSS) return false;
                return true;
            });
            this.vm.classList = data[3];
            this.vm.divisionList = data[4];
            this.vm.DATA.data.classList = data[3];
            this.vm.DATA.data.divisionList = data[4];

            const studentIdList = this.vm.studentSectionList.map(item => item.parentStudent);
            const studentIdChunkList = [];
            for (let i = 0; i < studentIdList.length;) {    // dividing big id list to smaller chunks until request is satasfiable
                const chunk = [];
                while (chunk.join(',').length < MAX_LENGTH_OF_GET_REQUEST && i < studentIdList.length) {
                    chunk.push(studentIdList[i]);
                    i++;
                }
                studentIdChunkList.push(chunk);
            }

            const studentCombinedRequest = Promise.all(
                studentIdChunkList.map(studentIdChunk => this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: { id__in: studentIdChunk }}))
            ).then(studentChunks => studentChunks.reduce((accumulator, nextChunk) => [...accumulator, ...nextChunk], []));

            const tcCombinedRequest = Promise.all(
                studentIdChunkList.map(studentIdChunk => this.vm.genericService.getObjectList(
                    { tc_app: 'TransferCertificateNew' },
                    {
                        filter: {
                            parentStudent__in: studentIdChunk,
                            status__in: ['Generated', 'Issued']
                        }
                    })
                )
            ).then(tcChunks => tcChunks.reduce((accumulator, nextChunk) => [...accumulator, ...nextChunk], []));

            const studentTcFeeCombined = Promise.all(
                studentIdChunkList.map(studentIdChunk => this.vm.genericService.getObjectList(
                    {fees_third_app: 'StudentFee'},
                    {
                        filter: {
                            parentStudent__in: studentIdChunk,
                            parentSchoolFeeRule__name: TC_SCHOOL_FEE_RULE_NAME
                        }
                    })
                )
            ).then(feeChunks => feeChunks.reduce((accumulator, nextChunk) => [...accumulator, ...nextChunk], []));


            const serviceList = [];
            if (data[5]) {
                this.vm.tcSettings = data[5];
            } else {
                // settings is not initilized
                this.vm.tcSettings = new DEFAULT_TC_SETTINGS(this.vm.user.activeSchool.dbId);
                const defaultTCSettings = new DEFAULT_TC_SETTINGS(this.vm.user.activeSchool.dbId);
                const tcSettingsInitilization = this.vm.tcService
                    .createObject(this.vm.tcService.tc_settings, defaultTCSettings)
                    .then((savedTcSettings) => {
                        this.vm.tcSettings = savedTcSettings;
                    });
                serviceList.push(tcSettingsInitilization);
            }

            this.vm.DATA.certificateNumber = this.vm.tcSettings.nextCertificateNumber;

            if (this.vm.tcSettings.tcFee > 0) {
                const request_tc_school_fee_rule = {
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                    name: TC_SCHOOL_FEE_RULE_NAME,
                    parentFeeType: this.vm.tcSettings.parentFeeType,
                };
                const tc_fee_rule_request = this.vm.feeService.getObject(this.vm.feeService.school_fee_rules, request_tc_school_fee_rule)
                    .then(async tcSchoolFeeRule => {
                        if (!tcSchoolFeeRule) {    // is school Fee Rule is not present
                            const newSchoolFeeRule = {
                                name: TC_SCHOOL_FEE_RULE_NAME,
                                parentFeeType: this.vm.tcSettings.parentFeeType,
                                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                                isAnnually: true,
                                isClassFilter: true,
                            };
                            await this.vm.feeService.createObject(this.vm.feeService.school_fee_rules, newSchoolFeeRule).then(savedSchoolFeeRule => {
                                this.vm.tcSchoolFeeRule = savedSchoolFeeRule;
                            });
                        }
                        else {
                            this.vm.tcSchoolFeeRule = tcSchoolFeeRule;
                        }
                    });
                serviceList.push(tc_fee_rule_request);
            }

            Promise.all([
                studentCombinedRequest, // 0
                tcCombinedRequest,   // 1
                studentTcFeeCombined, // 2
                ...serviceList
            ]).then(value => {
                this.vm.studentList = value[0];
                this.vm.tcStudentFeeList = value[2];
                this.vm.populateClassSectionList(this.vm.classList, this.vm.divisionList);
                this.vm.disableStudentsWithTC(value[1]);
                this.vm.isLoading = false;
            });
        });
    }

    async getDataForGeneratingTC() {
        const request_student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const request_student_full_data = {
            id__in: this.vm.getSelectedStudentList().map((ss) => ss.parentStudent),
        };
        // this.vm.isLoading = true;
        await Promise.all([
            this.vm.genericService.getObjectList({student_app: 'StudentParameter'}, {filter: request_student_parameter_data}), // 0
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), // 1
            this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: request_student_full_data}), // 2
        ]).then(async (data) => {
            this.vm.DATA.data.studentParameterList = data[0];
            this.vm.DATA.data.subjectList = data[1];
            this.vm.DATA.data.studentList = data[2];

            const request_student_parameter_value_data = {
                parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent),
            };
            const request_attendance_data = {
                parentStudent__in: this.vm.DATA.data.studentSectionList.map((item) => item.parentStudent).join(','),
                dateOfAttendance__gte:
                    new Date(
                        this.vm.DATA.data.sessionList.find((session) => {
                            return session.id === this.vm.user.activeSchool.currentSessionDbId;
                        }).startDate
                    ).getFullYear() + '-01-01', // We are getting the attendance of whole first year just to be safe
                dateOfAttendance__lte:
                    new Date(
                        this.vm.DATA.data.sessionList.find((session) => {
                            return session.id === this.vm.user.activeSchool.currentSessionDbId;
                        }).endDate
                    ).getFullYear() + '-12-31', // We are getting the attendance of whole second year just to be safe
            };

            await Promise.all([
                this.vm.genericService.getObjectList({student_app: 'StudentParameterValue'}, {filter: request_student_parameter_value_data}), // 0
                this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_attendance_data), // 1
            ]).then((value) => {
                this.vm.DATA.data.studentParameterValueList = value[0];
                this.vm.DATA.data.attendanceList = value[1];
            });
            this.populateParameterListWithStudentCustomField();
        });
    }

    populateParameterListWithStudentCustomField(): void {
        this.vm.DATA.data.studentParameterList.forEach((studentParameter) => {
            this.vm.htmlAdapter.parameterList.push(
                StudentCustomParameterStructure.getStructure(studentParameter.name, studentParameter.id)
            );
        });
    }

    generateTC(studentId: number, certificateNumber: number, certificateDocumet: Blob) {
        const tc_object = new TransferCertificateNew();
        tc_object.parentStudent = studentId;
        tc_object.parentStudentSection = this.vm.DATA.data.studentSectionList.find((ss) => ss.parentStudent == studentId).id;
        tc_object.parentSession = this.vm.user.activeSchool.currentSessionDbId;
        tc_object.certificateNumber = certificateNumber;
        tc_object.issueDate = this.vm.DATA.issueDate;
        tc_object.leavingDate = this.vm.DATA.leavingDate;
        tc_object.leavingReason = this.vm.DATA.isLeavingSchoolBecause;
        tc_object.lastClassPassed = this.vm.DATA.lastClassPassed;
        tc_object.status = 'Generated';
        tc_object.generatedBy = this.vm.user.activeSchool.employeeId;

        delete tc_object.certificateFile;
        const tc_form = new FormData();
        Object.entries(tc_object).forEach(([key, value]) => tc_form.append(key, value));
        tc_form.append('certificateFile', certificateDocumet, certificateNumber.toString() + '.pdf');

        const serviceList = [];
        serviceList.push(this.vm.genericService.createObject({tc_app: 'TransferCertificateNew'}, tc_form));

        if (this.vm.tcSettings.tcFee > 0 && this.vm.tcStudentFeeList.find((fee) => fee.parentStudent == studentId) == undefined) {
            const student_tc_fee = {
                parentStudent: studentId,
                parentSchoolFeeRule: this.vm.tcSchoolFeeRule.id,
                parentFeeType: this.vm.tcSettings.parentFeeType,
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                isAnnually: true,
                aprilAmount: this.vm.tcSettings.tcFee
            };

            serviceList.push(this.vm.genericService.createObject({fees_third_app: 'StudentFee'}, student_tc_fee)
                .then(tcStudentFee => this.vm.tcStudentFeeList.push(tcStudentFee)));
        }

        return Promise.all(serviceList).then((res) => res[0]);
    }

    updateTcSettings() {
        return this.vm.tcService.updateObject(this.vm.tcService.tc_settings, this.vm.tcSettings).then((responseData) => {
            this.vm.tcSettings = responseData;
        });
    }
}
