import {Component, Input} from '@angular/core';
import {EmployeeOldService} from '../../../../services/modules/employee/employee-old.service';
import { PrintService } from '../../../../print/print-service';
import { PRINT_EMPLOYEE_EXP_CERT } from '../../../../print/print-routes.constants';
import {DataStorage} from "../../../../classes/data-storage";
import {SchoolService} from "../../../../services/modules/school/school.service";

@Component({
    selector: 'app-experience-certi',
    templateUrl: './experience-certi.component.html',
    styleUrls: ['./experience-certi.component.css'],
    providers: [ SchoolService ],
})

export class ExperienceCertiComponent {
    user;

    employee: any;
    employeeFullProfile: any;
    selected = false;

    certificateNumber: any;
    certificateIssueDate;
    remark = 'His general conduct was good during the work.';
    boardList;

    isLoading = false;
    numberOfMissingParameters = 0;

    dateOfJoiningMissing = false;
    fatherNameMissing = false;
    currentPostMissing = false;


    constructor (private employeeService: EmployeeOldService,
                 private schoolService: SchoolService,
                 private printService: PrintService) { }
    ngOnInit() {
        this.user = DataStorage.getInstance().getUser();
    }

    getEmployeeProfile(employee: any): void {

        this.employee = employee;
        this.selected = true;
        console.log(employee);

        const data = {
            id: employee.id,
        };

        this.isLoading = true;
        Promise.all([
            this.employeeService.getEmployeeProfile(data, this.user.jwt),
            this.schoolService.getObjectList(this.schoolService.board, {}),
        ]).then(value => {
            this.isLoading = false;
            this.employeeFullProfile = value[0];
            this.boardList = value[1];
            this.validateAllParameters(this.employeeFullProfile);
            this.populateRemark();
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
            remark: this.remark,
            boardList: this.boardList,
        };
        this.printService.navigateToPrintRoute(PRINT_EMPLOYEE_EXP_CERT, {user:this.user, value})
    }

    isValidCertificate(): boolean {
        if (this.certificateNumber == null || this.certificateNumber == '') {
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
        this.numberOfMissingParameters = 0;
        this.dateOfJoiningMissing = false;
        this.fatherNameMissing = false;
        this.currentPostMissing = false;
        if (!employeeFullProfile.dateOfJoining) {
            this.dateOfJoiningMissing = true;
            this.numberOfMissingParameters++;
        }
        if (!employeeFullProfile.fatherName) {
            this.fatherNameMissing = true;
            this.numberOfMissingParameters++;
        }
        if ( !employeeFullProfile.currentPost) {
            this.currentPostMissing = true;
            this.numberOfMissingParameters++;
        }
    }

    populateRemark(): void {
        if (this.employeeFullProfile.dateOfLeaving) {
            this.remark = (this.employeeFullProfile.gender=='Female'?'Her':'His')
                +' general conduct was good during the work. We hope for '
                + (this.employeeFullProfile.gender=='Female'?'her':'his')
                + ' better future.';
        } else {
            this.remark = (this.employeeFullProfile.gender=='Female'?'Her':'His')
                +' general conduct is good during the work.';
        }
    }

}
