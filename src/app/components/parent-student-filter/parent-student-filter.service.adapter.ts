
import {ParentStudentFilterComponent} from "./parent-student-filter.component";
import {CollectFeeServiceAdapter} from "../../modules/fees/pages/collect-fee/collect-fee-service.adapter";

export class ParentStudentFilterServiceAdapter {

    vm: ParentStudentFilterComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: ParentStudentFilterComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {

        this.vm.handleOnStudentListLoading(true);

        let student_section_data = {
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_data = {
            'parentTransferCertificate': 'null__korangle',
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
        ]).then(value => {

            console.log(value);

            this.vm.classList = value[0];
            this.vm.sectionList = value[1];
            this.vm.studentSectionList = value[2];

            this.populateStudentList(value[3]);
            this.populateMobileNumberList();

            this.vm.handleDataLoading();

            this.vm.handleOnStudentListLoading(false);

        }, error => {
            this.vm.handleOnStudentListLoading(false);
        });

    }

    populateStudentList(studentList: any): void {
        let tempStudentIdList = this.vm.studentSectionList.map(a => a.parentStudent);
        this.vm.studentList = studentList.filter(student => {
            return tempStudentIdList.includes(student.id);
        });
    }

    populateMobileNumberList(): void {

        this.vm.mobileNumberList = this.vm.studentList.map(a => a.mobileNumber);
        this.vm.mobileNumberList.concat(this.vm.studentList.map( a => a.secondMobileNumber));
        this.vm.mobileNumberList = this.vm.mobileNumberList.filter((item, index) => {
            return  item != null && this.vm.mobileNumberList.indexOf(item) == index;
        });

    }

}