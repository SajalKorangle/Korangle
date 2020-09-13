import { DesignLayoutComponent } from './design-layout.component';
import { StudentCustomParameterStructure} from '@modules/id-card/class/constants';

export class DesignLayoutServiceAdapter {

    vm: DesignLayoutComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: DesignLayoutComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        const id_card_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        };
        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            korangle__count: '0,9'
        };
        const request_student_parameter_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };
        this.vm.isLoading = true;
        Promise.all([
            this.vm.idCardService.getObjectList(this.vm.idCardService.id_card_layout, id_card_layouts_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, request_student_parameter_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {})
        ]).then(data => {

            this.vm.idCardLayoutList = data[0];
            this.vm.data.studentSectionList = data[1];
            this.vm.data.studentParameterList = data[2];
            this.vm.data.classList = data[3];
            this.vm.data.divisionList = data[4];

            const request_student_data = {
                id__in: this.vm.data.studentSectionList.map(item => item.parentStudent).join(','),
            };
            const request_student_parameter_value_data = {
                parentStudent__in: this.vm.data.studentSectionList.map(item => item.parentStudent).join(','),
            };

            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data),
                this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, request_student_parameter_value_data),
            ]).then(value => {
                this.vm.data.studentList = value[0];
                this.vm.data.studentParameterValueList = value[1];
                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            });

            this.populateStudentCustomFieldParameterList();

        });
    }

    populateStudentCustomFieldParameterList(): void {
        this.vm.data.studentParameterList.forEach(studentParameter => {
            this.vm.parameterList.push(StudentCustomParameterStructure.getStructure(
                studentParameter.id
            ));
        });
    }

    dataURLtoFile(dataurl, filename) {

        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, {type: mime});
        } catch (e) {
            return null;
        }
    }

    createLayout(): void {
        this.vm.isLoading = true;
        const layout_data = { ...this.vm.currentLayout, content: JSON.stringify(this.vm.currentLayout.content) };
        const form_data = new FormData();
        Object.keys(layout_data).forEach(key => {
            if (key === 'background' ) {
                form_data.append(key, this.dataURLtoFile(layout_data[key], 'backgroundImage.jpeg'));
            } else {
                form_data.append(key, layout_data[key]);
            }
        });
        this.vm.idCardService.createObject(this.vm.idCardService.id_card_layout, form_data).then(idCardLayoutValue => {
            this.vm.idCardLayoutList.push(idCardLayoutValue);
            this.vm.chooseLayout(idCardLayoutValue);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    updateLayout(): void {
        this.vm.isLoading = true;
        const layout_data = { ...this.vm.currentLayout, content: JSON.stringify(this.vm.currentLayout.content) };
        const form_data = new FormData();
        Object.keys(layout_data).forEach(key => {
            if (key === 'background' ) {
                const file = this.dataURLtoFile(layout_data[key], 'backgroundImage.jpeg');
                if (file !== null) {
                    form_data.append(key, file);
                }
            } else {
                form_data.append(key, layout_data[key]);
            }
        });
        this.vm.idCardService.partiallyUpdateObject(this.vm.idCardService.id_card_layout, form_data).then(idCardLayoutValue => {
            this.vm.idCardLayoutList = this.vm.idCardLayoutList.filter(item => {
                return item.id !== idCardLayoutValue.id;
            });
            this.vm.idCardLayoutList.push(idCardLayoutValue);
            this.vm.chooseLayout(idCardLayoutValue);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    deleteLayout(): void {
        this.vm.isLoading = true;
        const layout_data = {
            id: this.vm.currentLayout.id,
        };
        this.vm.idCardService.deleteObject(this.vm.idCardService.id_card_layout, layout_data).then(value => {
            this.vm.idCardLayoutList = this.vm.idCardLayoutList.filter(item => {
                return item.id !== layout_data.id;
            });
            this.vm.currentLayout = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

}

