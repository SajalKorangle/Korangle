import { DeleteStudentComponent } from './delete-student.component';
import { CommonFunctions } from '@classes/common-functions';

export class DeleteStudentServiceAdapter {
    vm: DeleteStudentComponent;

    constructor() {}

    initializeAdapter(vm: DeleteStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        
        this.vm.isLoading = true;
        
        const student_full_profile_request_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const class_section_request_data = {
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        const student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const student_parameter_value_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };

        const bus_stop_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        const tc_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            status__in: ['Generated', 'Issued'],
            fields__korangle: ['parentStudent'],
        };

        const student_section_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            
        }

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),    // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}),  // 1
            this.vm.studentOldService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),   // 2
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, student_parameter_data), // 3
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, student_parameter_value_data), // 4
            this.vm.schoolService.getObjectList(this.vm.schoolService.bus_stop, bus_stop_data), // 5
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}), // 6
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, tc_data),   // 7
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),   // 8
        ]).then(
            (value) => {
                console.log(value);
                value[0].forEach((classs) => {
                    classs.sectionList = [];
                    value[1].forEach((section) => {
                        classs.sectionList.push(CommonFunctions.getInstance().copyObject(section));
                    });
                });
                this.vm.initializeClassSectionList(value[0]);
                this.vm.backendData.tcList = value[7];
                this.vm.initializeStudentFullProfileList(value[2]);
                this.vm.studentParameterList = value[3].map((x) => ({
                    ...x,
                    filterValues: JSON.parse(x.filterValues).map((x2) => ({ name: x2, show: false })),
                    showNone: false,
                    filterFilterValues: '',
                }));
                this.vm.studentParameterValueList = value[4];
                this.vm.studentParameterDocumentList = this.vm.studentParameterList.filter((x) => x.parameterType == 'DOCUMENT');
                this.vm.studentParameterOtherList = this.vm.studentParameterList.filter((x) => x.parameterType !== 'DOCUMENT');
                this.vm.busStopList = value[5];
                this.vm.session_list = value[6];
                this.vm.studentList = value[8];
                
                this.vm.isLoading = false;                
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    checkDeletability(studentList: any): any {
        
        let studentIdList = [];
        studentList.forEach((student) => {
            studentIdList.push(student.dbId);
        });

        let student_data = {
            id: studentIdList.join(','),
            fields__korangle: 'motherName,rollNumber,scholarNumber,dateOfBirth,address,remark',
        };

        let tc_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            status__in: ['Generated', 'Issued'].join(','),
        };

        let student_section_data = {
            parentStudent: studentIdList.join(','),
        };

        let fee_receipt_data = {
            parentStudent: studentIdList.join(','),
            cancelled: 'false__boolean',
        };

        let discount_data = {
            parentStudent: studentIdList.join(','),
            cancelled: 'false__boolean',
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data), // 0
            this.vm.feeService.getObjectList(this.vm.feeService.fee_receipts, fee_receipt_data), // 1
            this.vm.feeService.getObjectList(this.vm.feeService.discounts, discount_data), // 2
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, tc_data), // 3
        ]).then(
            (value) => {

                studentList.forEach((student)=> {

                    this.vm.selectedStudentSectionList = value[0].filter(x => x.parentStudent == student.dbId);
                    this.vm.selectedStudentFeeReceiptList = value[1].filter(x => x.parentStudent == student.dbId);
                    this.vm.selectedStudentDiscountList = value[2].filter(x => x.parentStudent == student.dbId);
                    this.vm.tcList = value[3].filter(x => x.parentStudent == student.dbId);
                    
                    student.deleteDisabledReason = {};
                    
                    student.deleteDisabledReason["hasMultipleSessions"] = this.vm.selectedStudentSectionList.length > 1;
                    
                    student.deleteDisabledReason["hasFeeReceipt"] = this.vm.selectedStudentFeeReceiptList.find((feeReceipt) => {
                        return (
                            feeReceipt.parentStudent == student.dbId &&
                        feeReceipt.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                        feeReceipt.cancelled == false
                        );
                    }) != undefined;
                    
                    student.deleteDisabledReason["hasDiscount"] = this.vm.selectedStudentDiscountList.find((discount) => {
                        return (
                            discount.parentStudent == student.dbId && 
                            discount.parentSession == this.vm.user.activeSchool.currentSessionDbId &&
                            discount.cancelled == false
                            );
                    }) != undefined;
                        
                    student.deleteDisabledReason["hasTC"] = this.selectedStudentHasTc(student);
                    
                    let isDeletable = !student.deleteDisabledReason["hasMultipleSessions"] &&
                    !student.deleteDisabledReason["hasFeeReceipt"] &&
                    !student.deleteDisabledReason["hasDiscount"] &&
                    !student.deleteDisabledReason["hasTC"]
                    ;
                    
                    student.isDeletablechecked = true;
                    student.isDeletable = isDeletable;

                });
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    selectedStudentHasTc(student): boolean {
        return this.vm.tcList.find((tc) => {
            return (
                tc.parentStudent == student.dbId &&
                tc.cancelledBy == null
            );
        }) != undefined
    }

    deleteStudent(studentList): void {
        let studentIdList = [];
        studentList.forEach((student) => {
            studentIdList.push(student.dbId);
        });

        let student_data = {
            id: studentIdList.join(','),
        };

        this.vm.isLoading = true;

        this.vm.studentService.deleteObject(this.vm.studentService.student, student_data).then(
            (value) => {
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    deleteSelectedStudents(): void {
        this.vm.isLoading = true;
        
        let deletableStudentIdList = [];
        
        this.vm.studentFullProfileList.forEach((student) => {
            if(student.show && student.selectProfile && student.isDeletable) {
                deletableStudentIdList.push(student.dbId);
            }
        });

        this.vm.studentFullProfileList.filter((x) => {
            let flag = true;
            deletableStudentIdList.forEach((id) => {
                flag = flag && (id != x.dbId);
            })
            return flag;
        });

        let student_data = {
            id: deletableStudentIdList.join(','),
        };

        this.vm.studentService.deleteObjectList(this.vm.studentService.student, student_data).then(
            (value) => {
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
