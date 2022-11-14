import { ManageStudentSessionsComponent } from "./manage-student-sessions.component";
import { cloneDeep } from "lodash";

export class ManageStudentSessionsServiceAdapter {
    vm: ManageStudentSessionsComponent;
    originalStudentSessionList: {
        hasFeeReceipt: boolean,
        id?: number,
        isNewSession: boolean,
        parentClass: {
            id?: number,
            name: string,
            orderNumber: number
        },
        parentDivision: {
            id?: number,
            name: string,
            orderNumber: number
        },
        parentSession: {
            endDate: Date,
            id?: number,
            name: string,
            orderNumber: number,
            startDate: Date
        }
    }[] = [];

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
            this.vm.genericService.getObjectList({ student_app: 'StudentSection' }, {  //   3 - get all student's class and section in the currently active school
                filter: {
                    parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                    parentStudent: this.vm.selectedStudent.id
                },
                fields_list: ['parentClass', 'parentDivision', 'parentSession']
            }),
            this.vm.genericService.getObjectList({ fees_third_app: 'FeeReceipt' }, { //     4 - get all the non cancelled fee receipts for the student in current school
                filter: {
                    parentStudent: this.vm.selectedStudent.id,
                    parentSchool: this.vm.user.activeSchool.dbId,
                    cancelled: false
                }
            })
        ]);

        this.vm.sessionList = value[0];
        this.vm.classList = value[1];
        this.vm.sectionList = value[2];
        this.vm.studentSessionList = value[3];
        this.vm.feeReceiptList = value[4];


        this.prepareStudentSessionList();

        this.originalStudentSessionList = cloneDeep(this.vm.studentSessionList);

        this.vm.isLoading = false;
    }
    // END: initialization of data

    // START: populate the studentSessionList 
    prepareStudentSessionList(): void {
        // assigning values to each classSection in studentSessionList
        this.vm.studentSessionList.forEach((classSection) => {
            classSection.parentClass = this.vm.classList.find((classObj) => classObj.id == classSection.parentClass);
            classSection.parentDivision = this.vm.sectionList.find((sectionObj) => sectionObj.id == classSection.parentDivision);
            classSection.parentSession = this.vm.sessionList.find((sessionObj) => sessionObj.id == classSection.parentSession);
            classSection.hasFeeReceipt = false;
            classSection.isNewSession = false;
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

    // START: saving the changed data to the database
    async saveSessions() {
        this.vm.isLoading = true;

        let updateSessionList: {
            id?: number,
            parentStudent: number,
            parentClass?: number,
            parentDivision?: number,
            parentSession?: number
        }[] = [];
        let addSessionList: {
            parentStudent: number,
            parentClass?: number,
            parentDivision?: number,
            parentSession?: number
        }[] = [];

        // TODO: Calculate Delete Session List, Update Session List and Add Session List
        // then call the services
        // After that update the originalStudentSessionList

        // deleting all the objects that have been deleted and saving the changes to the database
        this.originalStudentSessionList.forEach(async(originalSession) => {
            let foundSession = this.vm.studentSessionList.find((session) => session.id == originalSession.id);
            if(!foundSession) {
                await this.vm.genericService.deleteObjectList({ student_app: 'StudentSection' }, {
                    filter: {
                        id: originalSession.id
                    }
                });
            }
        });

        // filling the addSessionList (for new sessions) and updateSessionList(for changes in previously existing sessions)
        this.vm.studentSessionList.forEach((session) => {
            if(session.isNewSession) {
                addSessionList.push({
                    parentStudent: this.vm.selectedStudent.id,
                    parentClass: session.parentClass.id,
                    parentDivision: session.parentDivision.id,
                    parentSession: session.parentSession.id
                });
            } else {
                updateSessionList.push({
                    id: session.id,
                    parentStudent: this.vm.selectedStudent.id,
                    parentClass: session.parentClass.id,
                    parentDivision: session.parentDivision.id,
                    parentSession: session.parentSession.id,
                });
            }
        });

        // saving the updated sessions to the database
        if(updateSessionList.length > 0) {
            await this.vm.genericService.updateObjectList({ student_app: 'StudentSection' }, updateSessionList);
        }

        // saving the new sessions to the database
        if(addSessionList.length > 0) {
            await this.vm.genericService.createObjectList({ student_app: 'StudentSection' }, addSessionList);
        }

        this.vm.isLoading = false;
    }
    // END: saving the changed data to the database

}