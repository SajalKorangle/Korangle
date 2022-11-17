import { ManageStudentSessionsComponent } from "./manage-student-sessions.component";

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
        let value = await Promise.all([
            // get class and section of all students of this session
            this.vm.genericService.getObjectList({ student_app: 'StudentSection' }, {  //   0
                filter: {
                    parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                    parentStudent: this.vm.selectedStudent.id
                },
                fields_list: ['parentClass', 'parentDivision', 'parentSession']
            }),
            // get all the non cancelled fee receipts for the student in current school
            this.vm.genericService.getObjectList({ fees_third_app: 'FeeReceipt' }, { // 1
                filter: {
                    parentStudent: this.vm.selectedStudent.id,
                    parentSchool: this.vm.user.activeSchool.dbId,
                    cancelled: false
                }
            }),
            // get all the non cancelled discounts for the student in current school
            this.vm.genericService.getObjectList({ fees_third_app: 'Discount' }, { // 2
                filter: {
                    parentStudent: this.vm.selectedStudent.id,
                    parentSchool: this.vm.user.activeSchool.dbId,
                    cancelled: false
                }
            })
        ]);

        this.vm.backendStudentSessionList = value[0];
        this.vm.feeReceiptList = value[1];
        this.vm.discountList = value[2];

        this.prepareStudentSessionList();
    }

    // START: populate the studentSessionList
    prepareStudentSessionList(): void {

        this.vm.studentSessionList = [];

        // assigning values to each classSection in studentSessionList
        this.vm.backendStudentSessionList.forEach((backendStudentSessionObject) => {
            this.vm.studentSessionList.push({
                id: backendStudentSessionObject.id,
                parentClass: this.vm.classList.find((classObj) => classObj.id == backendStudentSessionObject.parentClass),
                parentDivision: this.vm.sectionList.find((sectionObj) => sectionObj.id == backendStudentSessionObject.parentDivision),
                parentSession: this.vm.sessionList.find((sessionObj) => sessionObj.id == backendStudentSessionObject.parentSession),
                hasFeeReceiptOrDiscount: false
            });
        });

        // checking if feeReceipt has already been generated in each classSection
        this.vm.studentSessionList.forEach((classSection) => {
            this.vm.feeReceiptList.forEach((feeReceipt) => {
                if (feeReceipt.parentSession == classSection.parentSession.id) {
                    classSection.hasFeeReceiptOrDiscount = true;
                }
            });
            this.vm.discountList.forEach((discount) => {
                if (discount.parentSession == classSection.parentSession.id) {
                    classSection.hasFeeReceiptOrDiscount = true;
                }
            });
        });

        this.sortStudentSessionListBySessionID();
    }
    // END: populate the studentSessionList

    // START: sorting the studentsessions by session ID
    sortStudentSessionListBySessionID(): void {
        this.vm.studentSessionList.sort((a, b) => {
            if (a.parentSession.id && b.parentSession.id && a.parentSession.id < b.parentSession.id) {
                return 1;
            } else if (a.parentSession.id && b.parentSession.id && a.parentSession.id > b.parentSession.id) {
                return -1;
            } else {
                return 0;
            }
        });
    }
    // END: sorting the studentsessions by session ID

    // START: saving the changed data to the database
    async saveSessions() {
        this.vm.isLoading = true;

        let deleteStudentSessionList: {
            id: number
        }[] = [];
        let updateStudentSessionList: {
            id?: number,
            parentStudent: number,
            parentClass?: number,
            parentDivision?: number,
            parentSession?: number
        }[] = [];
        let addStudentSessionList: {
            parentStudent: number,
            parentClass?: number,
            parentDivision?: number,
            parentSession?: number
        }[] = [];

        // deleting all the objects that have been deleted and saving the changes to the database
        this.vm.backendStudentSessionList.forEach(backendStudentSessionObject => {
            if(this.vm.studentSessionList.find((studentSession) => 
                studentSession.parentSession.id == backendStudentSessionObject.parentSession
            ) == undefined) {
                deleteStudentSessionList.push({id: backendStudentSessionObject.id});
            }
        });

        // filling the addSessionList (for new sessions) and updateSessionList(for changes in previously existing sessions)
        this.vm.studentSessionList.forEach((studentSessionObject) => {
            if(this.vm.dynamicValues.isSessionNew(studentSessionObject)) {
                addStudentSessionList.push({
                    parentStudent: this.vm.selectedStudent.id,
                    parentClass: studentSessionObject.parentClass.id,
                    parentDivision: studentSessionObject.parentDivision.id,
                    parentSession: studentSessionObject.parentSession.id
                });
            } else if (this.vm.dynamicValues.isSessionUpdated(studentSessionObject)) {
                updateStudentSessionList.push({
                    id: studentSessionObject.id,
                    parentStudent: this.vm.selectedStudent.id,
                    parentClass: studentSessionObject.parentClass.id,
                    parentDivision: studentSessionObject.parentDivision.id,
                    parentSession: studentSessionObject.parentSession.id,
                });
            }
        });

        // Deleting the removed student sessions from database
        if (deleteStudentSessionList.length > 0) {
            await this.vm.genericService.deleteObjectList({ student_app: 'StudentSection' }, {
                filter: {
                    id__in: deleteStudentSessionList.map(deleteSession => deleteSession.id)
                }
            });
        }

        // updating student sessions in the database
        if(updateStudentSessionList.length > 0) {
            await this.vm.genericService.updateObjectList({ student_app: 'StudentSection' }, updateStudentSessionList);
        }

        // adding student sessions to the database
        if(addStudentSessionList.length > 0) {
            await this.vm.genericService.createObjectList({ student_app: 'StudentSection' }, addStudentSessionList);
        }

        // Reinitialize Selected Student Data
        await this.initializeSelectedStudentData();

        this.vm.isLoading = false;
    }
    // END: saving the changed data to the database

}