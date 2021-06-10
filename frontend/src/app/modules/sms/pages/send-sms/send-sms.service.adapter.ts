import {SendSmsComponent} from './send-sms.component';


export class SendSmsServiceAdapter {

    vm: SendSmsComponent;

    constructor() {
    }

    initializeAdapter(vm: SendSmsComponent): void {
        this.vm = vm;
    }

    //initialize data
    async initializeData() {
        let student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
        };

        let student_data = {
            parentTransferCertificate: 'null__korangle',
            parentSchool: this.vm.user.activeSchool.dbId,
            fields__korangle:
                'id,name,fathersName,mobileNumber,secondMobileNumber,scholarNumber,rte,gender,newCategoryField,admissionSession',
        };

        const sms_count_request_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const employee_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            dateOfLeaving: 'null__korangle',
            fields__korangle: 'id,name,fathersName,mobileNumber',
        };

        this.vm.stateKeeper.isLoading = true;

        const value = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), //0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), //1
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data), //2
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_data), //3
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_data), //4
            this.vm.smsOldService.getSMSCount(sms_count_request_data, this.vm.user.jwt), //5
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, { //6
                parentSchool: this.vm.user.activeSchool.dbId,
                parameterType: 'FILTER',
            }),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, { //7
                parentStudentParameter__parentSchool: this.vm.user.activeSchool.dbId,
                parentStudentParamter__parameterType: 'FILTER',
            }),
            this.vm.smsService.getObjectList(this.vm.smsService.sms_id_school, {parentSchool: this.vm.user.activeSchool.dbId}), //8
            this.vm.smsService.getObject(this.vm.smsService.sms_event, {eventName: 'General'}), //9
            this.vm.smsService.getObjectList(this.vm.smsService.sms_event_settings, {parentSMSEvent__eventName: 'General'}) //10
        ]);

        this.vm.backendData.classList = value[0];
        this.vm.backendData.sectionList = value[1];

        this.vm.dataForMapping['classList'] = value[0];
        this.vm.dataForMapping['divisionList'] = value[1];
        this.vm.dataForMapping['studentSectionList'] = value[2];
        this.vm.dataForMapping['school'] = this.vm.user.activeSchool;

        this.vm.studentSectionList = value[2];
        this.populateStudentList(value[3]);
        this.populateEmployeeList(value[4]);
        this.vm.backendData.smsBalance = value[5].count;
        this.vm.studentParameterList = value[6].map((x) => ({
            ...x,
            filterValues: JSON.parse(x.filterValues).map((x) => ({name: x, show: false})),
            showNone: false,
            filterFilterValues: '',
        }));

        this.vm.studentParameterValueList = value[7];
        this.vm.backendData.smsIdSchool = value[8];
        this.vm.backendData.smsEvent = value[9];
        this.vm.backendData.eventSettingList = value[10];

        this.vm.backendData.smsIdList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_id, {
            id__in: this.vm.backendData.smsIdSchool.map(a => a.parentSMSId),
            smsIdStatus: 'ACTIVATED'
        });
        this.vm.backendData.templateList = await this.vm.smsService.getObjectList(this.vm.smsService.sms_template, {
            id__in: this.vm.backendData.eventSettingList.map(a => a.parentSMSTemplate),
            registrationStatus: 'APPROVED',
            'korangle__order': '-id',
        });

        this.populateClassSectionList();
        this.populateStudentSectionList();
        this.populateTemplateList();

        this.vm.userInput.selectedSendTo = this.vm.sendToList[0];
        this.vm.stateKeeper.isLoading = false;
    }

    populateTemplateList(): void {
        this.vm.populatedTemplateList = this.vm.backendData.templateList;
        this.vm.populatedTemplateList.forEach(template => {
            template['selected'] = false;
        });
    }

    populateClassSectionList(): void {
        this.vm.backendData.classList.forEach((classs) => {
            this.vm.backendData.sectionList.forEach((section) => {
                if (
                    this.vm.studentSectionList.find((studentSection) => {
                        return studentSection.parentClass == classs.id && studentSection.parentDivision == section.id;
                    }) != undefined
                ) {
                    this.vm.classSectionList.push({
                        class: classs,
                        section: section,
                        selected: true,
                    });
                }
            });
        });
    }

    populateStudentList(studentList: any): void {
        this.vm.backendData.studentList = studentList;
        this.vm.studentMessageService.fetchGCMDevicesNew(this.vm.backendData.studentList);
    }

    populateEmployeeList(employeeList: any): void {
        this.vm.employeeList = employeeList;
        this.vm.employeeList.forEach((employee) => {
            employee['selected'] = true;
            employee['validMobileNumber'] = this.vm.isMobileNumberValid(employee.mobileNumber);
        });
        this.vm.employeeMessageService.fetchGCMDevicesNew(this.vm.employeeList);
    }

    populateStudentSectionList(): void {
        this.vm.studentSectionList.forEach((studentSection) => {
            studentSection['student'] = this.vm.backendData.studentList.find((student) => {
                return student.id == studentSection.parentStudent;
            });
            studentSection['validMobileNumber'] = this.vm.isMobileNumberValid(studentSection['student'].mobileNumber);
            studentSection['selected'] = !!studentSection['validMobileNumber'];
        });
        this.vm.studentSectionList = this.vm.studentSectionList.sort((a, b) => {
            return (
                10 *
                (this.vm.backendData.classList.find((item) => item.id == a.parentClass).orderNumber -
                    this.vm.backendData.classList.find((item) => item.id == b.parentClass).orderNumber) +
                (this.vm.backendData.sectionList.find((item) => item.id == a.parentDivision).orderNumber = this.vm.backendData.sectionList.find(
                    (item) => item.id == b.parentDivision
                ).orderNumber)
            );
        });
    }

    async sendSMSAndNotification() {
        if (this.vm.getMobileNumberList('sms').length > 0 &&
            !confirm('Please confirm that you are sending ' + this.vm.htmlRenderer.getEstimatedSMSCount() + ' SMS.')) {
            return;
        }
        this.vm.stateKeeper.isLoading = true;

        let messageService;
        if (this.vm.userInput.selectedSendTo == this.vm.sendToList[0]) {
            this.vm.dataForMapping['studentList'] = this.vm.getMobileNumberList('both');
            messageService = this.vm.employeeMessageService;

        } else {
            this.vm.dataForMapping['employeeList'] = this.vm.getMobileNumberList('both');
            messageService = this.vm.employeeMessageService;
        }

        await messageService.smsNotificationSender(
            this.vm.dataForMapping,
            this.vm.backendData.smsEvent,
            this.vm.userInput.selectedSentType.id,
            this.vm.message,
            this.vm.message,
            this.vm.userInput.selectedTemplate.parentSMSId,
            this.vm.user.activeSchool.dbId,
            this.vm.backendData.smsBalance
        );
        alert(this.vm.userInput.selectedSentType.name + ' Sent Successfully');
        this.vm.stateKeeper.isLoading = false;
    }

}
