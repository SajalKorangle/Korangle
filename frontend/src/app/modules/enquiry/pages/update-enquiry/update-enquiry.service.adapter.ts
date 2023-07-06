import { UpdateEnquiryComponent } from './update-enquiry.component';
import { Query } from '@services/generic/query';
import { map } from 'rxjs/operators';

export class UpdateEnquiryServiceAdapter {
    vm: UpdateEnquiryComponent;

    constructor() { }

    initializeAdapter(vm: UpdateEnquiryComponent): void {
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

        Object.keys(this.vm.selectedEnquiry).forEach((key) => {
            this.vm.currentEnquiry[key] = this.vm.selectedEnquiry[key];
        });

        this.vm.isLoading = false;

    }

    async updateEnquiry() {

        if (this.vm.currentEnquiry.studentName === undefined || this.vm.currentEnquiry.studentName === '') {
            alert('Name should be populated');
            return;
        }

        if (this.vm.currentEnquiry.enquirerName === undefined || this.vm.currentEnquiry.enquirerName === '') {
            alert("Father's Name should be populated");
            return;
        }

        let id = this.vm.currentEnquiry.id;

        this.vm.isLoading = true;

        let result = await new Query()
            .updateObject({'enquiry_app': 'Enquiry'}, this.vm.currentEnquiry);

        if (result) {
            alert('Enquiry updated successfully');

            if (this.vm.selectedEnquiry.id === id) {
                this.vm.selectedEnquiry = this.vm.currentEnquiry;
            }
        }

        this.vm.isLoading = false;

    }

}
