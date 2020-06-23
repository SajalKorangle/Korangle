import {ManageLayoutsComponent} from './manage-layouts.component';

export class ManageLayoutsServiceAdapter {

    vm: ManageLayoutsComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ManageLayoutsComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        const id_card_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        }
        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            korangle__count: '0,1'
        };
        Promise.all([
            this.vm.idCardService.getObjectList(this.vm.idCardService.id_card_layout, id_card_layouts_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {})
        ]).then(data => {
            this.vm.idCardLayoutList = data[0];
            this.vm.idCardLayoutList.forEach(item => {
                item.content = JSON.parse(item.content)
            })
            this.vm.data.studentSectionList = data[1]
            this.vm.data.classList = data[2]
            this.vm.data.divisionList = data[3];

            const request_student_data = {
                id: this.vm.data.studentSectionList[0].parentStudent,
            }
            this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(value => {
                this.vm.data.studentList = value;
                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            })
        })
    }

    createOrUpdateLayout = () => {
        // this.vm.isLoading = true
        let data = {...this.vm.currentLayout, content: JSON.stringify(this.vm.currentLayout.content)}
        let form_data = new FormData()
        Object.keys(data).forEach(key => {
            // if(key==="background"){
                form_data.append(key, data[key])
            // }else{
            //     form_data.append(key, new Blob([data[key]], {
            //         type: 'application/json'
            //     }));
            // }
            
        })
        let req = null;
        if (!this.vm.currentLayout.id){
            req = this.vm.idCardService.createObject(this.vm.idCardService.id_card_layout, data)
        }else{
            req = this.vm.idCardService.updateObject(this.vm.idCardService.id_card_layout, form_data)
        }
        req.then(data => {
            this.vm.currentLayout = {...data, content: JSON.parse(data.content)}
            console.log(this.vm.currentLayout)
            this.vm.isLoading = false
        }, error => {
            this.vm.isLoading = false
        })
    }

}