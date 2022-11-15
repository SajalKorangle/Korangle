import { ManageStudentSessionsComponent } from "./manage-student-sessions.component";
import { cloneDeep } from "lodash";

export class ManageStudentSessionsServiceAdapter {
    vm: ManageStudentSessionsComponent;

    constructor() {}

    initializeAdapter(vm: ManageStudentSessionsComponent): void {
        this.vm = vm;
    }

    // START: initialization of Data 
    async initializeData() {
        this.vm.isLoading = true;
        let value = await Promise.all([
            this.vm.genericService.getObjectList({ school_app: 'Session' }, {}), //         0 - get all the sessions
            this.vm.genericService.getObjectList({ class_app: 'Class' }, {}),  //           1 - get all the classes
            this.vm.genericService.getObjectList({ class_app: 'Division' }, {}),  //        2 - get all the sections
        ]);

        this.vm.sessionList = value[0];
        this.vm.classList = value[1];
        this.vm.sectionList = value[2];

        await this.initializeSelectedStudentData();

        this.vm.isLoading = false;
    }
    // END: initialization of data

    async initializeSelectedStudentData() {
        this.vm.isLoading = true;
        let value = await Promise.all([
            this.vm.genericService.getObjectList({ student_app: 'StudentSection' }, {  //   0 - get all student's class and section in the currently active school
                filter: {
                    parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                    parentStudent: this.vm.selectedStudent.id
                },
                fields_list: ['parentClass', 'parentDivision', 'parentSession']
            }),
            this.vm.genericService.getObjectList({ fees_third_app: 'FeeReceipt' }, { //     1 - get all the non cancelled fee receipts for the student in current school
                filter: {
                    parentStudent: this.vm.selectedStudent.id,
                    parentSchool: this.vm.user.activeSchool.dbId,
                    cancelled: false
                }
            })
        ]);

        this.vm.backendStudentSessionList = value[0];
        this.vm.feeReceiptList = value[1];

        this.prepareStudentSessionList();
    }

    // START: populate the studentSessionList 
    prepareStudentSessionList(): void {

        this.vm.studentSessionList = [];

        // assigning values to each classSection in studentSessionList
        this.vm.backendStudentSessionList.forEach((backendStudentSessionObject) => {
            this.vm.studentSessionList.push({
                parentClass: this.vm.classList.find((classObj) => classObj.id == backendStudentSessionObject.parentClass),
                parentDivision: this.vm.sectionList.find((sectionObj) => sectionObj.id == backendStudentSessionObject.parentDivision),
                parentSession: this.vm.sessionList.find((sessionObj) => sessionObj.id == backendStudentSessionObject.parentSession),
                hasFeeReceipt: false
            });
        });

        // checking if feeReceipt has already been generated in each classSection
        this.vm.studentSessionList.forEach((classSection) => {
            this.vm.feeReceiptList.forEach((feeReceipt) => {
                if(feeReceipt.parentSession == classSection.parentSession.id) {
                    classSection.hasFeeReceipt = true;
                }
            });
        });

        this.sortStudentSessionListBySessionID();
    }
    // END: populate the studentSessionList 

    // START: sorting the studentsessions by session ID
    sortStudentSessionListBySessionID(): void {
        this.vm.studentSessionList.sort((a, b) => {
            if(a.parentSession.id && b.parentSession.id && a.parentSession.id < b.parentSession.id) {
                return 1;
            } else if(a.parentSession.id && b.parentSession.id && a.parentSession.id > b.parentSession.id) {
                return -1;
            } else {
                return 0;
            }
        });
    }
    // END: sorting the studentsessions by session ID

}