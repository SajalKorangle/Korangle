import { DeleteStudentComponent } from './delete-student.component';
import { CommonFunctions } from '@classes/common-functions';
import { Query } from '@services/generic/query';

export class DeleteStudentServiceAdapter {
    vm: DeleteStudentComponent;

    constructor() {}

    initializeAdapter(vm: DeleteStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        
        this.vm.isLoading = true;
        
        const classQuery = new Query()
            .filter({})
            .getObjectList({ class_app: 'Class' });

        const divisionQuery = new Query()
            .filter({})
            .getObjectList({ class_app: 'Division' });

        const studentParameterQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ student_app: 'StudentParameter' });

        const studentParameterValueQuery = new Query()
            .filter({ parentStudent__parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ student_app: 'StudentParameterValue' });

        const busStopQuery = new Query()
            .filter({ parentSchool: this.vm.user.activeSchool.dbId })
            .getObjectList({ school_app: 'BusStop' });

        const sessionQuery = new Query()
            .filter({})
            .getObjectList({ school_app: 'Session' });

        const transferCertificateNewQuery = new Query()
            .filter({
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                status__in: ['Generated', 'Issued'],
            })
            .getObjectList({ tc_app: 'TransferCertificateNew' });

        const studentSectionQuery = new Query()
            .filter({ parentSession: this.vm.user.activeSchool.currentSessionDbId })
            .getObjectList({ student_app: 'StudentSection' });
            
        const student_full_profile_request_data = {
                schoolDbId: this.vm.user.activeSchool.dbId,
                sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };
    
        Promise.all([
            classQuery,
            divisionQuery,
            studentParameterQuery,
            studentParameterValueQuery,
            busStopQuery,
            sessionQuery, 
            transferCertificateNewQuery,
            studentSectionQuery,
            this.vm.studentOldService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),
        ]).then(
            (value) => {
                // console.log(value);
                value[0].forEach((classs) => {
                    classs.sectionList = [];
                    value[1].forEach((section) => {
                        classs.sectionList.push(CommonFunctions.getInstance().copyObject(section));
                    });
                });
                this.vm.initializeClassSectionList(value[0]);
                this.vm.studentParameterList = value[2].map((x) => ({
                    ...x,
                    filterValues: JSON.parse(x.filterValues).map((x2) => ({ name: x2, show: false })),
                    showNone: false,
                    filterFilterValues: '',
                }));
                this.vm.studentParameterValueList = value[3];
                this.vm.studentParameterDocumentList = this.vm.studentParameterList.filter((x) => x.parameterType == 'DOCUMENT');
                this.vm.studentParameterOtherList = this.vm.studentParameterList.filter((x) => x.parameterType !== 'DOCUMENT');
                this.vm.busStopList = value[4];
                this.vm.session_list = value[5];
                this.vm.backendData.tcList = value[6];
                this.vm.studentList = value[7];
                this.vm.initializeStudentFullProfileList(value[8]);        
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
    
    checkDeletability(studentList: any): any {
        
        this.vm.isLoading = true;
        
        let studentIdList = [];
        studentList.forEach((student) => {
            studentIdList.push(student.dbId);
        });

        const studentSectionQuery = new Query()
            .filter({ parentStudent__in: studentIdList })
            .getObjectList({ student_app: 'StudentSection' });

        const feeReceiptQuery = new Query()
            .filter({ 
                parentStudent__in: studentIdList,
                cancelled: 'False',
            })
            .getObjectList({ fees_third_app: 'FeeReceipt' });

        const discountQuery = new Query()
            .filter({ 
                parentStudent__in: studentIdList,
                cancelled: 'False',
            })
            .getObjectList({ fees_third_app: 'Discount' });

        const transferCertificateNewQuery = new Query()
            .filter({
                parentSession: this.vm.user.activeSchool.currentSessionDbId,
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                status__in: ['Generated', 'Issued'],
            })
            .getObjectList({ tc_app: 'TransferCertificateNew' });

        Promise.all([
            studentSectionQuery,
            feeReceiptQuery,
            discountQuery,
            transferCertificateNewQuery,
        ]).then(
            (value) => {
                // console.log(value);

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
                    
                    student.isDeletable = isDeletable;
                    if(!isDeletable) {
                        let msg="The student can't be deleted due to the following reason(s) - \n";
                        if(student.deleteDisabledReason["hasMultipleSessions"]) {
                            msg = msg + "Student is registered in multiple sessions.\n";
                        }
                        if(student.deleteDisabledReason["hasFeeReceipt"]) {
                            msg = msg + "Fee Receipt/s have been issued for the student.\n";
                        }
                        if(student.deleteDisabledReason["hasDiscount"]) {
                            msg = msg + "Discount/s have been issued for the student.\n";
                        }
                        if(student.deleteDisabledReason["hasTC"]) {
                            msg = msg + "TC is already generated.\n";
                        }
                        student['nonDeletableMessage'] = msg;
                    }

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

    deleteSelectedStudents(): void {
        this.vm.isLoading = true;
        
        let deletableStudentIdList = [];

        if(this.vm.currentClassStudentFilter == 'Class') {
            this.vm.studentFullProfileList.forEach((student) => {
                if(student.show && student.selectProfile && student.isDeletable) {
                    deletableStudentIdList.push(student.dbId);
                }
            });
        }
        else if(this.vm.currentClassStudentFilter == 'Student') {
            deletableStudentIdList.push(this.vm.selectedStudent.dbId);
        }
        
        if(deletableStudentIdList.length == 0) {
            this.vm.isLoading = false;
            return;
        }

        this.vm.studentFullProfileList = this.vm.studentFullProfileList.filter((x) => {
            let flag = true;
            deletableStudentIdList.forEach((id) => {
                flag = flag && (id != x.dbId);
            })
            return flag;
        });
        
        this.vm.htmlRenderer.handleStudentDisplay();

        const deletestudentQuery = new Query()
            .filter({ id__in: deletableStudentIdList})
            .deleteObjectList({ student_app: 'Student' });

        deletestudentQuery.then(
            (value) => {
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        )
    }
}
