import {GenerateIdCardComponent} from './generate-id-card.component'

export class GenerateIdCardServiceAdapter {

    vm: GenerateIdCardComponent

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateIdCardComponent): void {
        this.vm = vm
    }

    // initialize data
    initializeData(): void {
        this.vm.isLoading = true
        const fetch_student_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        }
        const fetch_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId
        }
        const fetch_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        }
        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student, fetch_student_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, fetch_student_section_data),
            this.vm.idCardService.getObjectList(this.vm.idCardService.id_card_layout, fetch_layouts_data)
        ]).then(data => {
            this.vm.classList = data[0]
            this.vm.sectionList = data[1]
            this.vm.studentList = data[2]
            this.vm.studentSectionList = data[3]
            this.vm.populateClassSectionList(data[0], data[1])
            this.vm.layoutList = data[4]
            this.vm.isLoading = false
        }, error => {
            this.vm.isLoading = false
        })
    }

}