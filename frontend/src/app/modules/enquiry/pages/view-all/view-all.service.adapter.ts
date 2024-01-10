import { ViewAllComponent } from './view-all.component';
import { Query } from '@services/generic/query';

export class ViewAllServiceAdapter {
    vm: ViewAllComponent;

    constructor() { }

    initializeAdapter(vm: ViewAllComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.isLoading = true;

        let classQuery = new Query()
            .getObjectList({class_app: 'Class'});

        let inPagePermissionQuery = new Query()
            .filter({parentEmployeePermission__parentEmployee: this.vm.user.activeSchool.employeeId})
            .getObject({enquiry_app: 'ViewEnquiryInPagePermissions'});

        [
            this.vm.classList,
            this.vm.inPagePermissions,
        ] = await Promise.all([
            classQuery,
            inPagePermissionQuery,
        ]);

        this.vm.employeeList = await new Query()
            .filter(
                !this.vm.isAdmin() ?
                {id: this.vm.user.activeSchool.employeeId} :
                {parentSchool: this.vm.user.activeSchool.dbId}
            )
            .orderBy('name')
            .getObjectList({employee_app: 'Employee'});

        this.vm.isLoading = false;

    }

    async getEnquiryList() {

        this.vm.isLoading = true;

        let enquiryQueryFilterData = {
            dateOfEnquiry__gte: this.vm.startDate,
            dateOfEnquiry__lte: this.vm.endDate,
        };

        this.vm.isAdmin() ?
            enquiryQueryFilterData['parentSchool'] = this.vm.user.activeSchool.dbId :
            enquiryQueryFilterData['parentEmployee'] = this.vm.user.activeSchool.employeeId;

        this.vm.streamVariables.enquiryList$.next(await new Query()
            .filter(enquiryQueryFilterData)
            .orderBy('dateOfEnquiry')
            .getObjectList({enquiry_app: 'Enquiry'}));

        this.vm.isLoading = false;

    }

}
