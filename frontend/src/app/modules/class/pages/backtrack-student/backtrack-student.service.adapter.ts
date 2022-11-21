import { BacktrackStudentComponent } from "./backtrack-student.component";

export class BacktrackStudentServiceAdapter {
    vm: BacktrackStudentComponent;

    constructor() {}

    initializeAdapter(vm: BacktrackStudentComponent): void {
        this.vm = vm;
    }


    async initializeData() {
        this.vm.isLoading = true;
        let value = await Promise.all([
            this.vm.genericService.getObjectList({ class_app: 'Class' }, {}),  //           0 - get all the classes
            this.vm.genericService.getObjectList({ class_app: 'Division' }, {}),  //        1 - get all the sections
            this.vm.genericService.getObjectList({ student_app: 'StudentSection' }, {  //   2 - get all student's class and section in the currently active school
                filter: {
                    parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
                    parentSession: this.vm.user.activeSchool.currentSessionDbId
                },
                fields_list: ['parentStudent__id','parentStudent__admissionSession', 'parentStudent__dateOfAdmission', 'parentStudent__name', 'parentClass', 'parentDivision', 'parentSession']
            })
        ]);

        this.vm.classList = value[0];
        this.vm.sectionList = value[1];

        this.populateClassSectionList(value[2]);

        this.vm.isLoading = false;
    }

    // START :- Populate class section list variable for dropdown
    populateClassSectionList(studentSectionList: any): any {

        this.vm.classSectionList = [];

        // START :- Populate the class section list
        studentSectionList.forEach((studentSection) => {
            if (
                this.vm.classSectionList.find(classSection => {
                    return classSection.class.id == studentSection.parentClass &&
                        classSection.section.id == studentSection.parentDivision;
                }) == undefined
            ) {
                this.vm.classSectionList.push({
                    class: this.vm.classList.find((classObj) => classObj.id == studentSection.parentClass),
                    section: this.vm.sectionList.find((sectionObj) => sectionObj.id == studentSection.parentDivision)
                });
            }
        });
        // End :- Populate the class section list

        // START :- Sort class section list by Class 12, 11, 10... and then Section A,B,C...
        this.vm.classSectionList.sort((a, b) => {
            if(a.class.id > b.class.id) {
                return 1;
            } else if(a.class.id < b.class.id) {
                return -1;
            } else {
                if(a.section.id > b.section.id) {
                    return 1;
                } else if(a.section.id < b.section.id) {
                    return -1;
                } else {
                    return 0;
                }
            }
        });
        // End :- Sort class section list by Class 12, 11, 10... and then Section A,B,C...

    }
    // End :- Populate class section list variable for dropdown

}