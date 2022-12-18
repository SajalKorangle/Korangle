import { UpdateViaExcelComponent } from './update-via-excel.component';
import { Query } from '@services/generic/query';
import { ClassSection } from './update-via-excel.models';


export class UpdateViaExcelServiceAdapter {
    vm: UpdateViaExcelComponent;

    constructor() { }

    initializeAdapter(vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }

    /* Initialize Data */
    async initializeData() {
        this.vm.isLoading = true;

        const student_section_filter = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const classQuery = new Query()
            .getObjectList({class_app: 'Class'});

        const divisionQuery = new Query()
            .getObjectList({class_app: 'Division'});

        const studentSectionQuery = new Query()
            .filter(student_section_filter)
            .getObjectList({student_app: 'StudentSection'});

        let studentSectionList = [];
        let classList = [];
        let sectionList = [];
        [
            classList,   // 0
            sectionList,   // 1
            studentSectionList,   // 3
        ] = await Promise.all([
            classQuery,   // 0
            divisionQuery,   // 1
            studentSectionQuery,   // 3
        ]);

        // Starts :- Initialize Class Section List
        classList.forEach((classs) => {
            let filteredSectionList = sectionList.filter((section) => {
                return studentSectionList.find(studentSection => 
                        studentSection.parentClass == classs.id && studentSection.parentDivision == section.id
                    ) != undefined;
            });
            if (filteredSectionList.length > 0) {
                this.vm.htmlAdapter.classSectionList.push({
                    id: classs.id,
                    name: classs.name,
                    sectionList: filteredSectionList.map(section => {
                        return {
                            id: section.id,
                            name: section.name,
                            selected: false,
                        };
                    }),
                    showSectionNameInDropdown: filteredSectionList.length > 1,
                });
            }
        });
        // Ends :- Initialize Class Section List

        this.vm.isLoading = false;
    }
    // Ends: initializeData()

}
