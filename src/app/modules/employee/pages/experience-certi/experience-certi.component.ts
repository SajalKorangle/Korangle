import {Component, Input, OnInit} from '@angular/core';
import {EmitterService} from '../../../../services/emitter.service';
import {EmployeeService} from '../../employee.service';

@Component({
    selector: 'app-experience-certi',
    templateUrl: './experience-certi.component.html',
    styleUrls: ['./experience-certi.component.css'],
})

export class ExperienceCertiComponent {
    @Input() user;

    employee: any;
    employeeFullProfile: any;
    selected = false;

    certificateNumber: number;
    certificateIssueDate;
    remark = 'His general conduct was good during the work.';

    isLoading = false;
    numberOfMissingParameters = 0;

    dateOfJoiningMissing = false;
    dateOfLeavingMissing = false;
    fatherNameMissing = false;
    mothernameMissing = false;
    currentPostMissing = false;


    constructor (private employeeService: EmployeeService) { }

    getEmployeeProfile(employee: any): void {

        this.employee = employee;
        this.selected = true;
        console.log(employee);

        const data = {
            id: employee.id,
        };

        this.isLoading = true;
        Promise.all([
            this.employeeService.getEmployeeProfile(data, this.user.jwt) ]).then(value => {
            this.isLoading = false;
            this.employeeFullProfile = value[0];
            this.validateAllParameters(this.employeeFullProfile);
        }, error => {
            this.isLoading = false;
        });

    }

    handleEmployeeCertiIssueDate(issueDate) {
        this.certificateIssueDate = issueDate;
    }

    genrateExpCerti() {
        if (!this.isValidCertificate()) {
            return;
        }
        const value = {
            employeeFullProfile: this.employeeFullProfile,
            certificateNumber: this.certificateNumber,
            certificateIssueDate: this.certificateIssueDate,
            remark: this.remark
        };
        EmitterService.get('print-employee-exp-certi').emit(value);
    }

    isValidCertificate(): boolean {
        if (this.certificateNumber == null) {
            alert('Certificate Number field should be filled');
            return false;
        }
        if (this.certificateIssueDate == null ) {
            alert('Certificate Issue Date field should be filled');
            return false;
        }
        return true;
    }

    validateAllParameters(employeeFullProfile) {
       if (!employeeFullProfile.dateOfJoining) {
           this.dateOfJoiningMissing = true;
           this.numberOfMissingParameters++;
       }
       if (!employeeFullProfile.dateOfLeaving) {
           this.dateOfLeavingMissing = true;
           this.numberOfMissingParameters++;
       }
       if (!employeeFullProfile.fatherName) {
           this.fatherNameMissing = true;
           this.numberOfMissingParameters++;
       }
       if (!employeeFullProfile.motherName) {
           this.mothernameMissing = true;
           this.numberOfMissingParameters++;
       }
       if ( !employeeFullProfile.currentPost) {
           this.currentPostMissing = true;
           this.numberOfMissingParameters++;
       }
    }

}
