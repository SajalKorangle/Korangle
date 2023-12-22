import { UpdateStudentFeesComponent } from './update-student-fees.component';
import { CommonFunctions } from '@modules/common/common-functions';
import { SchoolFeeRule } from '../../../../services/modules/fees/models/school-fee-rule';
import { INSTALLMENT_LIST } from '@modules/fees/classes/constants';

export class UpdateStudentFeesServiceAdapter {
    vm: UpdateStudentFeesComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: UpdateStudentFeesComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        let request_fee_type_data = {
            parentSchool: schoolId,
        };

        let request_school_fee_rule_data = {
            parentFeeType__parentSchool: schoolId,
            parentSession: sessionId,
        };

        let request_class_filter_fee_data = {
            parentSchoolFeeRule__parentFeeType__parentSchool: schoolId,
            parentSchoolFeeRule__parentSession: sessionId,
        };

        let request_bus_stop_filter_fee_data = {
            parentSchoolFeeRule__parentFeeType__parentSchool: schoolId,
            parentSchoolFeeRule__parentSession: sessionId,
        };

        let request_bus_stop_data = {
            parentSchool: schoolId,
        };

        let fee_settings_request = {
            'parentSchool': schoolId,
            'parentSession': sessionId,
        };

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, request_fee_type_data),
            this.vm.genericService.getObjectList(
                {fees_third_app: 'SchoolFeeRule'},
                {
                    filter: request_school_fee_rule_data,
                    order_by: ['ruleNumber'],
                    child_query: {
                        customfilterfee: {
                            order_by: ['parentStudentParameter_id']
                        }
                    }
                }
            ),
            this.vm.feeService.getObjectList(this.vm.feeService.class_filter_fees, request_class_filter_fee_data),
            this.vm.feeService.getObjectList(this.vm.feeService.bus_stop_filter_fees, request_bus_stop_filter_fee_data),
            this.vm.vehicleService.getBusStopList(request_bus_stop_data, this.vm.user.jwt),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fee_settings_request),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.genericService.getObjectList(
                {student_app: 'StudentParameter'},
                {filter: {parentSchool: schoolId, parameterType: 'FILTER'}}
            ),
        ]).then(value => {

            this.vm.feeTypeList = value[0];
            this.vm.schoolFeeRuleList = value[1];
            this.vm.schoolFeeRuleList.forEach(schoolFeeRule => {
                schoolFeeRule.customfilterfee.forEach(item => {
                    item.selectedFilterValues = JSON.parse(item.selectedFilterValues);
                });
            });
            this.vm.classFilterFeeList = value[2];
            this.vm.busStopFilterFeeList = value[3];
            this.vm.busStopList = value[4];
            if (value[5].length == 1) { this.vm.lockFees = value[5].sessionLocked; }
            this.vm.classList = value[6];
            this.vm.sectionList = value[7];
            this.vm.studentParameterList = value[8];

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    // Get Student Fee Profile
    getStudentFeeProfile(): void {
        let student_fee_data = {
            parentStudent: this.vm.selectedStudent.id,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let sub_fee_receipt_data = {
            parentStudentFee__parentStudent: this.vm.selectedStudent.id,
            parentFeeReceipt__cancelled: 'false__boolean',
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let sub_discount_data = {
            parentStudentFee__parentStudent: this.vm.selectedStudent.id,
            parentDiscount__cancelled: 'false__boolean',
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_data),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, sub_fee_receipt_data),
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, sub_discount_data),
        ]).then(
            (value) => {
                this.vm.studentFeeList = value[0];
                this.vm.subFeeReceiptList = value[1];
                this.vm.subDiscountList = value[2];

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    // Delete Student Fee
    deleteStudentFee(): void {
        let student_fee_data = {
            id: this.vm.selectedStudentFee.id,
        };

        this.vm.isLoading = true;

        this.vm.feeService.deleteObject(this.vm.feeService.student_fees, student_fee_data).then(
            (value) => {
                alert('Student Fee deletion successful');
                this.deleteFromStudentFee(parseInt(value));
                this.vm.changeSelectedStudentFee();
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    deleteFromStudentFee(studentFeeId: number): void {
        this.vm.studentFeeList = this.vm.studentFeeList.filter((item) => {
            return item.id != studentFeeId;
        });
    }

    // Edit Student Fee Rule
    editStudentFee(): void {

        // Starts :- Validate New Student Fee Data
        let invalid = false;
        INSTALLMENT_LIST.every(month => {

            // Starts :- Last Date should only be present when amount is present.
            // Late Fees should only be present when last date is present.
            // Maximum Late Fees should only be present when late fees is present.
            if (
                (this.vm.newStudentFee[month + 'LastDate'] && !this.vm.newStudentFee[month + 'Amount']) ||
                (this.vm.newStudentFee[month + 'LateFee'] && !this.vm.newStudentFee[month + 'LastDate']) ||
                (this.vm.newStudentFee[month + 'MaximumLateFee'] && !this.vm.newStudentFee[month + 'LateFee'])
            ) {
                invalid = true;
                return false;
            }
            // Ends :- Last Date should only be present when amount is present.
            // Late Fees should only be present when last date is present.
            // Maximum Late Fees should only be present when late fees is present.

            // Starts :- No Installment other than april should be present when is annually is true.
            if (
                this.vm.newStudentFee.isAnnually &&
                month != 'April' &&
                (
                    this.vm.newStudentFee[month + 'Amount'] ||
                    this.vm.newStudentFee[month + 'LastDate'] ||
                    this.vm.newStudentFee[month + 'LateFee'] ||
                    this.vm.newStudentFee[month + 'MaximumLateFee']
                )
            ) {
                invalid = true;
                return false;
            }
            // Ends :- No Installment other than april should be present when is annually is true.

            return true;
        });
        if (invalid) {
            alert('Invalid Data!!!');
            return;
        }
        // Ends :- Validate New Student Fee Data

        this.vm.isLoading = true;

        this.vm.feeService.updateObject(this.vm.feeService.student_fees, this.vm.newStudentFee).then(
            (value) => {
                alert('Student Fee updated successfully');

                let parentEmployee = this.vm.user.activeSchool.employeeId;
                let moduleName = this.vm.user.section.title;
                let taskName = this.vm.user.section.subTitle;
                let moduleList = this.vm.user.activeSchool.moduleList;
                let actionString = " updated student " + this.vm.selectedFeeType.name + " of " + this.vm.selectedStudent.name;
                CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);

                this.deleteFromStudentFee(this.vm.newStudentFee.id);
                this.vm.studentFeeList.push(value);
                this.vm.changeSelectedStudentFee();

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    // Attach Rule
    attachToThisRule(schoolFeeRule: any): void {
        let tempObject = {
            parentStudent: this.vm.selectedStudent.id,
            parentSchoolFeeRule: schoolFeeRule.id,
            parentFeeType: schoolFeeRule.parentFeeType,
            parentSession: schoolFeeRule.parentSession,
            isAnnually: schoolFeeRule.isAnnually,
        };
        this.vm.installmentList.forEach((installment) => {
            tempObject[installment + 'Amount'] = schoolFeeRule[installment + 'Amount'];
            tempObject[installment + 'LastDate'] = schoolFeeRule[installment + 'LastDate'];
            tempObject[installment + 'LateFee'] = schoolFeeRule[installment + 'LateFee'];
            tempObject[installment + 'MaximumLateFee'] = schoolFeeRule[installment + 'MaximumLateFee'];
        });


        // Starts :- Validate temp object
        let invalid = false;
        INSTALLMENT_LIST.every(month => {

            // Starts :- Last Date should only be present when amount is present.
            // Late Fees should only be present when last date is present.
            // Maximum Late Fees should only be present when late fees is present.
            if (
                (tempObject[month + 'LastDate'] && !tempObject[month + 'Amount']) ||
                (tempObject[month + 'LateFee'] && !tempObject[month + 'LastDate']) ||
                (tempObject[month + 'MaximumLateFee'] && !tempObject[month + 'LateFee'])
            ) {
                invalid = true;
                return false;
            }
            // Ends :- Last Date should only be present when amount is present.
            // Late Fees should only be present when last date is present.
            // Maximum Late Fees should only be present when late fees is present.

            // Starts :- No Installment other than april should be present when is annually is true.
            if (
                tempObject.isAnnually &&
                month != 'April' &&
                (
                    tempObject[month + 'Amount'] ||
                    tempObject[month + 'LastDate'] ||
                    tempObject[month + 'LateFee'] ||
                    tempObject[month + 'MaximumLateFee']
                )
            ) {
                invalid = true;
                return false;
            }
            // Ends :- No Installment other than april should be present when is annually is true.

            return true;
        });
        if (invalid) {
            alert('Invalid Data!!!');
            return;
        }
        // Ends :- Validate temp object

        this.vm.isLoading = true;

        this.vm.feeService.createObject(this.vm.feeService.student_fees, tempObject).then(
            (value) => {
                alert('Group attached to students profile');
                this.vm.studentFeeList.push(value);
                this.vm.changeSelectedStudentFee();
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
