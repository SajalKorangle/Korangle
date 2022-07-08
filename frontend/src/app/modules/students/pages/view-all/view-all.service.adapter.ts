import { ViewAllComponent } from './view-all.component';
import { CommonFunctions } from '@classes/common-functions';

export class ViewAllServiceAdapter {
    vm: ViewAllComponent;

    constructor() { }

    initializeAdapter(vm: ViewAllComponent): void {
        this.vm = vm;
    }

    async initializeData(): Promise<void> {
        this.vm.isLoading = true;
        const student_full_profile_request_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const class_section_request_data = {
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_parameter_value_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };

        const bus_stop_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const tc_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            status__in: ['Generated', 'Issued'],
            fields__korangle: ['parentStudent'],
        };

        let temp_classSectionList_1, temp_classSectionList_2, temp_studentFullProfileList, temp_studentParameterList, 
        temp_studentParameterValueList, temp_busStopList, temp_session_list, temp_backendDataTcList;

        [temp_classSectionList_1, temp_classSectionList_2, temp_studentFullProfileList, temp_studentParameterList, temp_studentParameterValueList, 
        temp_busStopList, temp_session_list, temp_backendDataTcList] = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),    // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}),  // 1
            this.vm.studentOldService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),   // 2
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, student_parameter_data), // 3
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, student_parameter_value_data), // 4
            this.vm.schoolService.getObjectList(this.vm.schoolService.bus_stop, bus_stop_data), // 5
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 6
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, tc_data),   // 7
        ]);

        temp_classSectionList_1.forEach((classs) => {
            classs.sectionList = [];
            temp_classSectionList_2.forEach((section) => {
                classs.sectionList.push(CommonFunctions.getInstance().copyObject(section));
            });
        });
        this.vm.initializeClassSectionList(temp_classSectionList_1);
        this.vm.backendData.tcList = temp_backendDataTcList;
        this.vm.initializeStudentFullProfileList(temp_studentFullProfileList);
        await this.vm.messageService.fetchGCMDevicesNew(this.vm.studentFullProfileList, true);
        this.vm.studentParameterList = temp_studentParameterList.map((x) => ({
            ...x,
            filterValues: JSON.parse(x.filterValues).map((x2) => ({ name: x2, show: false })),
            showNone: false,
            filterFilterValues: '',
        }));
        this.vm.studentParameterValueList = temp_studentParameterValueList;
        this.vm.studentParameterDocumentList = this.vm.studentParameterList.filter((x) => x.parameterType == 'DOCUMENT');
        this.vm.studentParameterOtherList = this.vm.studentParameterList.filter((x) => x.parameterType !== 'DOCUMENT');
        this.vm.busStopList = temp_busStopList;
        this.vm.session_list = temp_session_list;
        this.vm.isLoading = false;
    }
}
