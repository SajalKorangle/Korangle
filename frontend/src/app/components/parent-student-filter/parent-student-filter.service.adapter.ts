import { ParentStudentFilterComponent } from './parent-student-filter.component';

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
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        let student_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            fields__korangle:
                'id,profileImage,name,fathersName,motherName,mobileNumber,secondMobileNumber,scholarNumber,address,currentBusStop,rte,parentTransferCertificate',
        };

        if (!this.vm.studentTcGenerated) {
            student_section_data['parentStudent__parentTransferCertificate'] = 'null__korangle';
            student_data['parentTransferCertificate'] = 'null__korangle';
        }

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
        ]).then(
            (value) => {
                this.vm.classList = value[0];
                this.vm.sectionList = value[1];
                this.vm.studentSectionList = value[2];

                this.populateStudentList(value[3]);
                this.populateMobileNumberList();
                this.sortStudentList('name');

                this.vm.handleDataLoading();

                this.vm.handleOnStudentListLoading(false);
            },
            (error) => {
                this.vm.handleOnStudentListLoading(false);
            }
        );
    }

    populateStudentList(studentList: any): void {
        let tempStudentIdList = this.vm.studentSectionList.map((a) => a.parentStudent);
        this.vm.studentList = studentList.filter((student) => {
            return tempStudentIdList.includes(student.id);
        });
    }

    populateMobileNumberList(): void {
        this.vm.mobileNumberList = this.vm.studentList.map((a) => a.mobileNumber);
        this.vm.mobileNumberList.concat(this.vm.studentList.map((a) => a.secondMobileNumber));
        this.vm.mobileNumberList = this.vm.mobileNumberList.filter((item, index) => {
            return item != null && this.vm.mobileNumberList.indexOf(item) == index;
        });
    }

    sortStudentList(item: any) {
        this.vm.studentList = this.vm.studentList.sort(function(a: any, b: any) {
            return (a[item].toLowerCase() > b[item].toLowerCase()) ? 1 : ((a[item].toLowerCase() < b[item].toLowerCase()) ? -1 : 0);
        });
    }
}
