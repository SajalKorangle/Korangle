import { DeleteEnquiryComponent } from './delete-enquiry.component';
import { Query } from '@services/generic/query';
import { map } from 'rxjs/operators';

export class DeleteEnquiryServiceAdapter {
    vm: DeleteEnquiryComponent;

    constructor() { }

    initializeAdapter(vm: DeleteEnquiryComponent): void {
        this.vm = vm;
    }

    async initializeData() {

        this.vm.isLoading = true;

        let classQuery = new Query()
            .getObjectList({'class_app': 'Class'});

        let inPagePermissionsQuery = new Query()
            .filter({parentEmployeePermission__parentEmployee: this.vm.user.activeSchool.employeeId})
            .getObject({'enquiry_app': 'ViewEnquiryInPagePermissions'});

        [
            this.vm.classList,
            this.vm.inPagePermissions,
        ] = await Promise.all([
            classQuery,
            inPagePermissionsQuery,
        ]);

        this.vm.enquiryList = await new Query()
            .filter(
                this.vm.isAdmin() ?
                {parentSchool: this.vm.user.activeSchool.dbId} :
                {parentEmployee: this.vm.user.activeSchool.employeeId}
            )
            .orderBy('studentName')
            .setFields('id', 'enquirerName', 'dateOfEnquiry', 'studentName')
            .getObjectList({'enquiry_app': 'Enquiry'});


        this.vm.filteredEnquiryList = this.vm.myControl.valueChanges.pipe(
            map((value) => (typeof value === 'string' ? value : (value as any).enquirerName)),
            map((value) => this.vm.filter(value))
        );

        this.vm.isLoading = false;

    }

    async getEnquiry(enquiry: any) {

        this.vm.isLoading = true;

        this.vm.selectedEnquiry = await new Query()
            .filter({id: enquiry.id})
            .getObject({'enquiry_app': 'Enquiry'});

        this.vm.isLoading = false;

    }

    async deleteEnquiry() {

        this.vm.isLoading = true;

        let result = await new Query()
            .filter({id: this.vm.selectedEnquiry.id})
            .deleteObjectList({'enquiry_app': 'Enquiry'});

        if (result) {
            this.vm.enquiryList = this.vm.enquiryList.filter((enquiry) => {
                return enquiry.id != this.vm.selectedEnquiry.id;
            });

            this.vm.selectedEnquiry = '';

            alert('Enquiry deleted succesfully');
        }

        this.vm.isLoading = false;

    }

}
