import { GenerateIdCardComponent } from './generate-id-card.component';
import { StudentCustomParameterStructure } from '@modules/id-card/class/constants';

export class GenerateIdCardServiceAdapter {
    vm: GenerateIdCardComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateIdCardComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true;
        const fetch_student_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const fetch_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };
        const fetch_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        const student_parameter_value_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
        };
        Promise.all([
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 0
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 1
            this.vm.genericService.getObjectList({student_app: 'Student'}, {filter: fetch_student_data}), // 2
            this.vm.genericService.getObjectList({student_app: 'StudentSection'}, {filter: fetch_student_section_data}), // 3
            this.vm.idCardService.getObjectList(this.vm.idCardService.id_card_layout, fetch_layouts_data), // 4
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}), // 5
            this.vm.genericService.getObjectList({student_app: 'StudentParameter'}, {filter: student_parameter_data}), // 6
            this.vm.genericService.getObjectList({student_app: 'StudentParameterValue'}, {filter: student_parameter_value_data}), // 7
        ]).then(
            (data) => {
                this.vm.classList = data[0];
                this.vm.sectionList = data[1];
                this.vm.studentList = data[2];
                this.vm.studentSectionList = data[3];
                this.vm.populateClassSectionList(data[0], data[1]);
                this.vm.layoutList = data[4];
                this.vm.sessionList = data[5];
                this.vm.studentParameterList = data[6];
                this.vm.studentParameterValueList = data[7];
                this.populateParameterListWithStudentCustomField();

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateParameterListWithStudentCustomField(): void {
        this.vm.studentParameterList.forEach((studentParameter) => {
            this.vm.parameterList.push(StudentCustomParameterStructure.getStructure(studentParameter.id));
        });
    }
}
