import { SettingsComponent } from './settings.component';
import { CommonFunctions } from '@modules/common/common-functions';

export class SettingsServiceAdapter {

    vm: SettingsComponent;

    constructor() { }

    initialize(vm: SettingsComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.isLoading = true;

        const online_class_list_request = {
            parentClassSubject__parentSchool: this.vm.user.activeSchool.dbId,
            parentClassSubject__parentSession: this.vm.user.activeSchool.currentSessionDbId
        };

        const class_subject_list_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        };

        const employee_list_request = {
            parentSchool: this.vm.user.activeSchool.dbId,
            fields__korangle: ['id', 'name'],
        };

        const routeInformation = CommonFunctions.getModuleTaskPaths();
        const in_page_permission_request = {
            parentTask__parentModule__path: routeInformation.modulePath,
            parentTask__path: routeInformation.taskPath,
            parentEmployee: this.vm.user.activeSchool.employeeId,
        };

        [
            this.vm.backendData.classList,
            this.vm.backendData.divisionList,
            this.vm.backendData.onlineClassList,
            this.vm.backendData.classSubjectList,
            this.vm.backendData.subjectList,
            this.vm.backendData.employeeList,
            this.vm.backendData.accountInfoList,
            this.vm.backendData.employeePermission,
        ] = await Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.online_class, online_class_list_request), // 2
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, class_subject_list_request), // 3
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}), //4
            this.vm.employeeService.getObjectList(this.vm.employeeService.employees, employee_list_request), //5
            this.vm.onlineClassService.getObjectList(this.vm.onlineClassService.account_info, {}), // 6
            this.vm.employeeService.getObject(this.vm.employeeService.employee_permissions, in_page_permission_request), //7
        ]);

        this.vm.parseBackendData();
        this.vm.isLoading = false;

    }

    async updateOnlineClassList() {
        if (this.vm.view == 'class' && this.vm.htmlRenderer.isAnyClassOverlapping()) {
            alert('Teacher\'s time slot if overlapping. Kindly rectify.');
            return;
        }
        const onlineClassBackendDataIndexArray = [];
        // filter online classes for selected class and section
        const originalFilteredOnlineClassList = this.vm.backendData.onlineClassList.filter((onlineClass, index) => {
            const classSubject = this.vm.backendData.classSubjectList.find(cs => cs.id == onlineClass.parentClassSubject);
            if (this.vm.view == 'class' && classSubject.parentClass == this.vm.userInput.selectedClass.id
                && classSubject.parentDivision == this.vm.userInput.selectedSection.id) {
                onlineClassBackendDataIndexArray.push(index);
                return true;
            }
            else if (this.vm.view == 'employee' && classSubject.parentEmployee == this.vm.userInput.selectedEmployee.id) {
                onlineClassBackendDataIndexArray.push(index);
                return true;
            }
            return false;
        });
        const updatedFilteredOnlineClassList = this.vm.htmlRenderer.filteredOnlineClassList;

        const toCreateList = [];
        const toUpdateList = [];

        updatedFilteredOnlineClassList.forEach(onlineClass => {
            if (!onlineClass.id) {
                toCreateList.push(onlineClass);
            }
            else {
                toUpdateList.push(onlineClass);
            }
        });

        const toDeleteList = originalFilteredOnlineClassList.filter(onlineClass1 => {
            return !toUpdateList.find(onlineClass2 => onlineClass2.id == onlineClass1.id);
        }).map(onlineClass => onlineClass.id);

        const serviceList = [];

        if (toDeleteList.length > 0) {
            const delete_request = {
                id__in: toDeleteList,
            };
            serviceList.push(this.vm.onlineClassService.deleteObjectList(this.vm.onlineClassService.online_class, delete_request));
        } else {
            serviceList.push(Promise.resolve([]));
        }

        this.vm.isLoading = true;
        const [deleteResponse, updateResponse, createResponse] = await Promise.all([...serviceList,
        this.vm.onlineClassService.updateObjectList(this.vm.onlineClassService.online_class, toUpdateList),
        this.vm.onlineClassService.createObjectList(this.vm.onlineClassService.online_class, toCreateList),
        ]);

        onlineClassBackendDataIndexArray.forEach(index => delete this.vm.backendData.onlineClassList[index]);
        this.vm.backendData.onlineClassList = this.vm.backendData.onlineClassList.filter(Boolean);
        this.vm.backendData.onlineClassList.push(...updateResponse);
        this.vm.backendData.onlineClassList.push(...createResponse);
        this.vm.parseBackendData();
        this.vm.htmlRenderer.initilizeTimeTable();
        this.vm.isLoading = false;
    }

}
