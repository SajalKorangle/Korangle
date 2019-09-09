
import { UpdateStudentFeesComponent } from './update-student-fees.component';
import {CommonFunctions} from "../../../../classes/common-functions";
import {SchoolFeeRule} from "../../../../services/modules/fees/school-fee-rule";

export class UpdateStudentFeesServiceAdapter {

    vm: UpdateStudentFeesComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: UpdateStudentFeesComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        let request_fee_type_data = {
            'parentSchool': schoolId,
        };

        let request_school_fee_rule_data = {
            'parentFeeType__parentSchool': schoolId,
            'parentSession': sessionId,
        };

        let request_class_filter_fee_data = {
            'parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSchoolFeeRule__parentSession': sessionId,
        };

        let request_bus_stop_filter_fee_data = {
            'parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSchoolFeeRule__parentSession': sessionId,
        };

        let request_bus_stop_data = {
            parentSchool: schoolId,
        };

        let lock_fees_list = {
            'parentSchool': schoolId,
            'parentSession': sessionId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.getList(this.vm.feeService.fee_type, request_fee_type_data),
            this.vm.feeService.getList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data),
            this.vm.feeService.getList(this.vm.feeService.class_filter_fees, request_class_filter_fee_data),
            this.vm.feeService.getList(this.vm.feeService.bus_stop_filter_fees, request_bus_stop_filter_fee_data),
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.vehicleService.getBusStopList(request_bus_stop_data, this.vm.user.jwt),
            this.vm.feeService.getObjectList(this.vm.feeService.lock_fees, lock_fees_list),
        ]).then(value => {

            this.vm.feeTypeList = value[0];
            this.vm.schoolFeeRuleList = value[1];
            this.vm.classFilterFeeList = value[2];
            this.vm.busStopFilterFeeList = value[3];
            this.vm.classList = value[4];
            this.vm.sectionList = value[5];
            this.vm.busStopList = value[6];
            if (value[7].length == 1) { this.vm.lockFees = value[7]; }

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    // Get Student Fee Profile
    getStudentFeeProfile(): void {

        let student_fee_data = {
            'parentStudent': this.vm.selectedStudent.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let sub_fee_receipt_data = {
            'parentStudentFee__parentStudent': this.vm.selectedStudent.dbId,
            'parentFeeReceipt__cancelled': 'false__boolean',
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let sub_discount_data = {
            'parentStudentFee__parentStudent': this.vm.selectedStudent.dbId,
            'parentDiscount__cancelled': 'false__boolean',
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.getList(this.vm.feeService.student_fees, student_fee_data),
            this.vm.feeService.getList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_data),
            this.vm.feeService.getList(this.vm.feeService.sub_discounts, sub_discount_data),
        ]).then(value => {

            this.vm.studentFeeList = value[0];
            this.vm.subFeeReceiptList = value[1];
            this.vm.subDiscountList = value[2];

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    // Delete Student Fee
    deleteStudentFee(): void {

        let student_fee_data = {
            'id': this.vm.selectedStudentFee.id,
        };

        this.vm.isLoading = true;

        this.vm.feeService.delete(this.vm.feeService.student_fees, student_fee_data).then( value => {

            alert('Student Fee deletion successful');
            this.deleteFromStudentFee(parseInt(value));
            this.vm.changeSelectedStudentFee();
            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    deleteFromStudentFee(studentFeeId: number): void {
        this.vm.studentFeeList = this.vm.studentFeeList.filter(item => {
            return item.id != studentFeeId;
        });
    }

    // Edit Student Fee Rule
    editStudentFee(): void {

        this.vm.isLoading = true;

        this.vm.feeService.update(this.vm.feeService.student_fees, this.vm.newStudentFee).then(value => {

            alert('Student Fee updated successfully');

            this.deleteFromStudentFee(this.vm.newStudentFee.id);
            this.vm.studentFeeList.push(value);
            this.vm.changeSelectedStudentFee();

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    // Attach Rule
    attachToThisRule(schoolFeeRule: any): void {

        let tempObject = {
            'parentStudent': this.vm.selectedStudent.dbId,
            'parentSchoolFeeRule': schoolFeeRule.id,
            'parentFeeType': schoolFeeRule.parentFeeType,
            'parentSession': schoolFeeRule.parentSession,
            'isAnnually': schoolFeeRule.isAnnually,
            'cleared': false,
        };
        this.vm.installmentList.forEach(installment => {
            tempObject[installment+'Amount'] = schoolFeeRule[installment+'Amount'];
            tempObject[installment+'LastDate'] = schoolFeeRule[installment+'LastDate'];
            tempObject[installment+'LateFee'] = schoolFeeRule[installment+'LateFee'];
            tempObject[installment+'MaximumLateFee'] = schoolFeeRule[installment+'MaximumLateFee'];
            tempObject[installment+'ClearanceDate'] = null;
        });

        this.vm.isLoading = true;

        this.vm.feeService.create(this.vm.feeService.student_fees, tempObject).then(value => {

            alert('Rule attached to students profile');
            this.vm.studentFeeList.push(value);
            this.vm.changeSelectedStudentFee();
            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

}