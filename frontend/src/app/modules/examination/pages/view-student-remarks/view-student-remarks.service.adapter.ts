import { ViewStudentRemarksComponent } from './view-student-remarks.component';

export class ViewStudentRemarksServiceAdapter {
    vm: ViewStudentRemarksComponent;

    constructor() {}

    initializeAdapter(vm: ViewStudentRemarksComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        const examination_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, examination_data), // 2
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data), // 3
        ]).then(
            (value) => {
                this.populateExaminationList(value[2]);

                this.vm.studentSectionList = value[3];

                const request_student_data = {
                    id__in: this.vm.studentSectionList
                        .map((item) => {
                            return item.parentStudent;
                        })
                        .join(),
                    fields__korangle: 'id,profileImage,name',
                };

                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(
                    (value_student) => {
                        this.vm.studentList = value_student;

                        this.vm.studentSectionList.forEach((item) => {
                            item['student'] = value_student.find((item_student) => {
                                return item_student.id === item.parentStudent;
                            });
                        });

                        this.vm.isInitialLoading = false;
                    },
                    (error) => {
                        this.vm.isInitialLoading = false;
                    }
                );

                this.populateClassSectionList(value[0], value[1]);
            },
            (error) => {
                this.vm.isInitialLoading = false;
            }
        );
    }

    populateExaminationList(examinationList: any): void {
        this.vm.examinationList = examinationList;
        if (examinationList.length > 0) {
            this.vm.htmlAdapter.selectedExamination = this.vm.examinationList[0];
        }
    }

    populateClassSectionList(classList: any, sectionList: any): void {
        classList.forEach((classs) => {
            sectionList.forEach((section) => {
                if (
                    this.vm.studentSectionList.find((item) => {
                        return item.parentClass === classs.id && item.parentDivision === section.id;
                    }) !== undefined
                ) {
                    this.vm.classSectionList.push({
                        class: classs,
                        section: section,
                    });
                }
            });
        });

        if (this.vm.classSectionList.length > 0) {
            this.vm.htmlAdapter.handleClassSectionSelection(this.vm.classSectionList[0]);
        }
    }

    getStudentRemarkDetails(): void {
        const student_remark_data = {
            parentExamination: this.vm.htmlAdapter.selectedExamination.id,
            parentStudent__in: this.vm.htmlAdapter.filteredSortedStudentSectionList.map((item) => item.parentStudent).join(','),
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.student_examination_remarks, student_remark_data),
        ]).then(
            (value) => {
                this.vm.studentRemarkList = value[0];
                this.vm.isLoading = false;
                this.vm.htmlAdapter.showStudentList = true;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
