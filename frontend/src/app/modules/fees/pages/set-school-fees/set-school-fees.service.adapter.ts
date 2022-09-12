
import { SetSchoolFeesComponent } from './set-school-fees.component';
import { CommonFunctions } from "../../../../classes/common-functions";
import { SchoolFeeRule } from "../../../../services/modules/fees/models/school-fee-rule";

export class SetSchoolFeesServiceAdapter {

    vm: SetSchoolFeesComponent;

    constructor() { }

    // Data

    initializeAdapter(vm: SetSchoolFeesComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        let request_fee_type_data = {
            'parentSchool': schoolId,
        };

        let student_full_profile_request_data = {
            schoolDbId: schoolId,
            sessionDbId: sessionId,
        };

        let request_bus_stop_data = {
            parentSchool: schoolId,
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

        let request_student_fee_data = {
            'parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSchoolFeeRule__parentSession': sessionId,
            'fields__korangle': 'id,parentSchoolFeeRule,parentStudent',
        };

        let request_sub_fee_receipt_data = {
            'parentStudentFee__parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSession': sessionId,
            'parentFeeReceipt__cancelled': 'false__boolean',
            'fields__korangle': 'id,parentStudentFee',
        };

        let request_sub_discount_data = {
            'parentStudentFee__parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentStudentFee__parentSchoolFeeRule__parentSession': sessionId,
            'parentDiscount__cancelled': 'false__boolean',
            'fields__korangle': 'id,parentStudentFee',
        };

        const fee_settings_request = {
            'parentSchool': schoolId,
            'parentSession': sessionId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, request_fee_type_data), // 0
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 1
            this.vm.classService.getObjectList(this.vm.classService.division, {}),   // 2
            this.vm.vehicleService.getBusStopList(request_bus_stop_data, this.vm.user.jwt), // 3
            this.vm.studentService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),  // 4
            this.vm.feeService.getObjectList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data),  // 5
            this.vm.feeService.getObjectList(this.vm.feeService.class_filter_fees, request_class_filter_fee_data),    // 6
            this.vm.feeService.getObjectList(this.vm.feeService.bus_stop_filter_fees, request_bus_stop_filter_fee_data),  // 7
            this.vm.feeService.getObjectList(this.vm.feeService.student_fees, request_student_fee_data),  // 8
            this.vm.feeService.getObjectList(this.vm.feeService.sub_fee_receipts, request_sub_fee_receipt_data),  // 9
            this.vm.feeService.getObjectList(this.vm.feeService.sub_discounts, request_sub_discount_data),    // 10
            this.vm.feeService.getObjectList(this.vm.feeService.fee_settings, fee_settings_request),    // 11
        ]).then(value => {

            this.populateFeeTypeList(value[0]);
            this.vm.classList = value[1];
            this.vm.sectionList = value[2];
            this.vm.busStopList = value[3];
            this.vm.studentList = value[4].filter(student => {
                return student.parentTransferCertificate == null;
            });

            this.vm.schoolFeeRuleList = value[5].sort((a, b) => {
                return a.ruleNumber - b.ruleNumber;
            });

            this.vm.classFilterFeeList = value[6];
            this.vm.busStopFilterFeeList = value[7];
            this.vm.studentFeeList = value[8];
            this.vm.subFeeReceiptList = value[9];
            this.vm.subDiscountList = value[10];
            if (value[11].length == 1) { this.vm.lockFees = value[11][0].sessionLocked; }

            this.vm.isLoading = false;

        });

    }

    populateFeeTypeList(data: any): void {
        this.vm.feeTypeList = data.sort((a, b) => {
            return a.orderNumber - b.orderNumber;
        });
    }

    // Add New School Fee Rule
    addNewSchoolFeeRule(): void {

        // Any conditions to check

        if (!this.vm.newSchoolFeeRule.ruleNumber) {
            alert('Group number should be populated');
            return;
        }

        if (this.vm.schoolFeeRuleList.filter(schoolFeeRule => {
            return schoolFeeRule.parentFeeType == this.vm.selectedFeeType.id;
        }).map(a => a.ruleNumber).includes(this.vm.newSchoolFeeRule.ruleNumber)) {
            alert('Group number already exists');
            return;
        }

        if (!this.vm.newSchoolFeeRule.name || this.vm.newSchoolFeeRule.name == '') {
            alert('Rule Name should be populated');
            return;
        }

        if (this.vm.schoolFeeRuleList.filter(schoolFeeRule => {
            return schoolFeeRule.parentFeeType == this.vm.selectedFeeType.id;
        }).map(a => a.name).includes(this.vm.newSchoolFeeRule.name)) {
            alert('Rule Name already exists');
            return;
        }
        // -------------------- Confirming the number of students affected starts -----------------------
        let number_of_students = this.vm.getExpectedStudentList().length;

        if (!confirm("This fee group is going to be added to " + number_of_students + " students")) {
            return;
        }
        // -------------------- Confirming the number of students affected ends -------------------------

        let school_fee_rule_data = CommonFunctions.getInstance().copyObject(this.vm.newSchoolFeeRule);

        school_fee_rule_data['parentFeeType'] = this.vm.selectedFeeType.id;

        let class_filter_fee_list = [];
        if (this.vm.newSchoolFeeRule.isClassFilter) {
            class_filter_fee_list = this.vm.newClassFilterFeeList.map(a => {
                return CommonFunctions.getInstance().copyObject(a);
            });
        }

        let bus_stop_filter_fee_list = [];
        if (this.vm.newSchoolFeeRule.isBusStopFilter) {
            bus_stop_filter_fee_list = this.vm.newBusStopFilterFeeList.map(a => {
                return CommonFunctions.getInstance().copyObject(a);
            });
        }

        let student_fee_list = [];

        this.vm.getExpectedStudentList().forEach(student => {
            let tempObject = {
                'parentStudent': student.dbId,
                'parentSchoolFeeRule': null,
                'parentFeeType': school_fee_rule_data['parentFeeType'],
                'parentSession': school_fee_rule_data['parentSession'],
                'isAnnually': school_fee_rule_data['isAnnually'],
                'cleared': false,
            };
            this.vm.installmentList.forEach(installment => {
                // --- Starts : not updating other months if isannually is true --
                if (school_fee_rule_data['isAnnually'] && installment != 'april') {
                    return;
                }
                // --- Ends : not updating other months if isannually is true --
                tempObject[installment + 'Amount'] = school_fee_rule_data[installment + 'Amount'];
                tempObject[installment + 'LastDate'] = school_fee_rule_data[installment + 'LastDate'];
                tempObject[installment + 'LateFee'] = school_fee_rule_data[installment + 'LateFee'];
                tempObject[installment + 'MaximumLateFee'] = school_fee_rule_data[installment + 'MaximumLateFee'];
                tempObject[installment + 'ClearanceDate'] = null;
            });
            student_fee_list.push(tempObject);
        });

        this.vm.isLoading = true;

        this.vm.feeService.createObject(this.vm.feeService.school_fee_rules, school_fee_rule_data).then(value => {

            let service_list = [];

            class_filter_fee_list.forEach(class_filter_fee => {
                class_filter_fee['parentSchoolFeeRule'] = value.id;
            });
            service_list.push(this.vm.feeService.createObjectList(this.vm.feeService.class_filter_fees, class_filter_fee_list));

            bus_stop_filter_fee_list.forEach(bus_stop_filter_fee => {
                bus_stop_filter_fee['parentSchoolFeeRule'] = value.id;
            });
            service_list.push(this.vm.feeService.createObjectList(this.vm.feeService.bus_stop_filter_fees, bus_stop_filter_fee_list));

            student_fee_list.forEach(student_fee => {
                student_fee['parentSchoolFeeRule'] = value.id;
            });
            service_list.push(this.vm.feeService.createObjectList(this.vm.feeService.student_fees, student_fee_list));

            Promise.all(service_list).then(value2 => {

                console.log(value2);

                this.addToSchoolFeeRuleList(value);
                this.addToClassFilterFeeList(value2[0]);
                this.addToBusStopFilterFeeList(value2[1]);
                this.addToStudentFeeList(value2[2]);

                this.vm.initializeNewSchoolFeeRule();

                this.vm.isLoading = false;

            });

        });

    }

    addToSchoolFeeRuleList(schoolFeeRule: any): void {
        this.vm.schoolFeeRuleList.push(schoolFeeRule);
        this.vm.schoolFeeRuleList = this.vm.schoolFeeRuleList.sort((a, b) => {
            return a.ruleNumber - b.ruleNumber;
        });
    }

    addToClassFilterFeeList(classFilterFeeList: any): void {
        this.vm.classFilterFeeList = this.vm.classFilterFeeList.concat(classFilterFeeList);
    }

    addToBusStopFilterFeeList(busStopFilterFeeList: any): void {
        this.vm.busStopFilterFeeList = this.vm.busStopFilterFeeList.concat(busStopFilterFeeList);
    }

    addToStudentFeeList(studentFeeList: any): void {
        this.vm.studentFeeList = this.vm.studentFeeList.concat(studentFeeList);
    }

    // Delete School Fee Rule
    deleteSchoolFeeRule(schoolFeeRule: SchoolFeeRule): void {

        let school_fee_rule_data = {
            id: schoolFeeRule.id,
        };

        /*let class_filter_fee_list;
        if (schoolFeeRule.isClassFilter) {
            class_filter_fee_list = {
                id: this.vm.classFilterFeeList.filter(class_filter_fee => {
                    return class_filter_fee.parentSchoolFeeRule == schoolFeeRule.id;
                }).map(a => a.id).join(','),
            };
        }

        let bus_stop_filter_fee_list;
        if (schoolFeeRule.isBusStopFilter) {
            bus_stop_filter_fee_list = {
                id: this.vm.busStopFilterFeeList.filter(bus_stop_filter_fee => {
                    return bus_stop_filter_fee.parentSchoolFeeRule == schoolFeeRule.id;
                }).map(a => a.id).join(','),
            };
        }

        let student_fee_list = {
            id: this.vm.studentFeeList.filter(studentFee => {
                return studentFee.parentSchoolFeeRule == schoolFeeRule.id;
            }).map(a => a.id).join(','),
        };*/

        let service_list = [];

        service_list.push(this.vm.feeService.deleteObject(this.vm.feeService.school_fee_rules, school_fee_rule_data));
        /*if (class_filter_fee_list) {
            service_list.push(this.vm.feeService.deleteList(this.vm.feeService.class_filter_fees, class_filter_fee_list));
        }
        if (bus_stop_filter_fee_list) {
            service_list.push(this.vm.feeService.deleteList(this.vm.feeService.bus_stop_filter_fees, bus_stop_filter_fee_list));
        }
        if (student_fee_list['id'] != '') {
            service_list.push(this.vm.feeService.deleteList(this.vm.feeService.student_fees, student_fee_list));
        }*/

        this.vm.isLoading = true;

        Promise.all(service_list).then(value => {

            console.log(value);
            this.deleteFromSchoolFeeRuleList(schoolFeeRule.id);

            this.deleteFromClassFilterFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            this.deleteFromBusStopFilterFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            this.deleteFromStudentFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            /*if (class_filter_fee_list) {
                this.deleteFromClassFilterFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            }

            if (bus_stop_filter_fee_list) {
                this.deleteFromBusStopFilterFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            }

            if (student_fee_list['id'] != '') {
                this.deleteFromStudentFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            }*/

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    deleteFromSchoolFeeRuleList(schoolFeeRuleId: any): void {
        this.vm.schoolFeeRuleList = this.vm.schoolFeeRuleList.filter(item => {
            return item.id != schoolFeeRuleId;
        });
    }

    deleteFromClassFilterFeeListBySchoolFeeRuleId(schoolFeeRuleId: any): void {
        this.vm.classFilterFeeList = this.vm.classFilterFeeList.filter(item => {
            return item.parentSchoolFeeRule != schoolFeeRuleId;
        });
    }

    deleteFromBusStopFilterFeeListBySchoolFeeRuleId(schoolFeeRuleId: any): void {
        this.vm.busStopFilterFeeList = this.vm.busStopFilterFeeList.filter(item => {
            return item.parentSchoolFeeRule != schoolFeeRuleId;
        });
    }

    deleteFromStudentFeeListBySchoolFeeRuleId(schoolFeeRuleId: any): void {
        this.vm.studentFeeList = this.vm.studentFeeList.filter(item => {
            return item.parentSchoolFeeRule != schoolFeeRuleId;
        });
    }

}
