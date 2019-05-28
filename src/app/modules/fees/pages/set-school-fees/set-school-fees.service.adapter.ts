
import { SetSchoolFeesComponent } from './set-school-fees.component';
import {CommonFunctions} from "../../../../classes/common-functions";
import {SchoolFeeRule} from "../../../../services/fees/school-fee-rule";

export class SetSchoolFeesServiceAdapter {

    vm: SetSchoolFeesComponent;

    constructor() {}

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
        };

        let request_sub_fee_receipt_data = {
            'parentStudentFee__parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentSession': sessionId,
            'parentFeeReceipt__cancelled': 'false__boolean',
        };

        let request_sub_discount_data = {
            'parentStudentFee__parentSchoolFeeRule__parentFeeType__parentSchool': schoolId,
            'parentStudentFee__parentSchoolFeeRule__parentSession': sessionId,
            'parentDiscount__cancelled': 'true__boolean',
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.feeService.getList(this.vm.feeService.fee_type, request_fee_type_data),
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.vehicleService.getBusStopList(request_bus_stop_data, this.vm.user.jwt),
            this.vm.studentService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),
            this.vm.feeService.getList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data),
            this.vm.feeService.getList(this.vm.feeService.class_filter_fees, request_class_filter_fee_data),
            this.vm.feeService.getList(this.vm.feeService.bus_stop_filter_fees, request_bus_stop_filter_fee_data),
            this.vm.feeService.getList(this.vm.feeService.student_fees, request_student_fee_data),
            this.vm.feeService.getList(this.vm.feeService.sub_fee_receipts, request_sub_fee_receipt_data),
            this.vm.feeService.getList(this.vm.feeService.sub_discounts, request_sub_discount_data),
        ]).then(value => {

            this.populateFeeTypeList(value[0]);
            this.vm.classList = value[1];
            this.vm.sectionList = value[2];
            this.vm.busStopList = value[3];
            this.vm.studentList = value[4].filter(student => {
                return student.parentTransferCertificate == null;
            });

            this.vm.schoolFeeRuleList = value[5].sort( (a,b) => {
                return a.ruleNumber-b.ruleNumber;
            });

            this.vm.classFilterFeeList = value[6];
            this.vm.busStopFilterFeeList = value[7];
            this.vm.studentFeeList = value[8];
            this.vm.subFeeReceiptList = value[9];
            this.vm.subDiscountList = value[10];

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateFeeTypeList(data: any): void {
        this.vm.feeTypeList = data.sort( (a,b) => {
            return a.orderNumber-b.orderNumber;
        });
    }

    // Add New School Fee Rule
    addNewSchoolFeeRule(): void {

        // Any conditions to check

        if (!this.vm.newSchoolFeeRule.ruleNumber) {
            alert('Rule number should be populated');
            return;
        }

        if (this.vm.schoolFeeRuleList.filter(schoolFeeRule => {
            return schoolFeeRule.parentFeeType == this.vm.selectedFeeType.id;
        }).map(a => a.ruleNumber).includes(this.vm.newSchoolFeeRule.ruleNumber)) {
            alert('Rule number already exists');
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
            };
            this.vm.installmentList.forEach(installment => {
                tempObject[installment+'Amount'] = school_fee_rule_data[installment+'Amount'];
                tempObject[installment+'LastDate'] = school_fee_rule_data[installment+'LastDate'];
                tempObject[installment+'LateFee'] = school_fee_rule_data[installment+'LateFee'];
                tempObject[installment+'ClearanceDate'] = null;
            });
            student_fee_list.push(tempObject);
        });

        this.vm.isLoading = true;

        this.vm.feeService.create(this.vm.feeService.school_fee_rules, school_fee_rule_data).then( value => {

            let service_list = [];

            class_filter_fee_list.forEach(class_filter_fee => {
                class_filter_fee['parentSchoolFeeRule'] = value.id;
            });
            service_list.push(this.vm.feeService.createList(this.vm.feeService.class_filter_fees, class_filter_fee_list));

            bus_stop_filter_fee_list.forEach(bus_stop_filter_fee => {
                bus_stop_filter_fee['parentSchoolFeeRule'] = value.id;
            });
            service_list.push(this.vm.feeService.createList(this.vm.feeService.bus_stop_filter_fees, bus_stop_filter_fee_list));

            student_fee_list.forEach(student_fee => {
                student_fee['parentSchoolFeeRule'] = value.id;
            });
            service_list.push(this.vm.feeService.createList(this.vm.feeService.student_fees, student_fee_list));

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
        this.vm.schoolFeeRuleList = this.vm.schoolFeeRuleList.sort( (a,b) => {
            return a.ruleNumber-b.ruleNumber;
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

        let class_filter_fee_list;
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
        };

        let service_list = [];

        service_list.push(this.vm.feeService.delete(this.vm.feeService.school_fee_rules, school_fee_rule_data));
        if (class_filter_fee_list) {
            console.log('class filter');
            service_list.push(this.vm.feeService.deleteList(this.vm.feeService.class_filter_fees, class_filter_fee_list));
        }
        if (bus_stop_filter_fee_list) {
            console.log('bus stop filter');
            service_list.push(this.vm.feeService.deleteList(this.vm.feeService.bus_stop_filter_fees, bus_stop_filter_fee_list));
        }
        if (student_fee_list['id'] != '') {
            console.log('student fee');
            service_list.push(this.vm.feeService.deleteList(this.vm.feeService.student_fees, student_fee_list));
        }

        this.vm.isLoading = true;

        Promise.all(service_list).then(value => {

            console.log(value);
            this.deleteFromSchoolFeeRuleList(schoolFeeRule.id);

            if (class_filter_fee_list) {
                this.deleteFromClassFilterFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            }

            if (bus_stop_filter_fee_list) {
                this.deleteFromBusStopFilterFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            }

            if (student_fee_list['id'] != '') {
                this.deleteFromStudentFeeListBySchoolFeeRuleId(schoolFeeRule.id);
            }

            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        })

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