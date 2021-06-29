import { AddStudentRemarksComponent } from './add-student-remarks.component';

declare const $: any;

export class AddStudentRemarksHtmlAdapter {
    vm: AddStudentRemarksComponent;

    selectedExamination: any;
    selectedClassSection: any;

    showStudentList: any;

    filteredSortedStudentSectionList = [];
    filteredStudentList = [];

    constructor() {}

    initializeAdapter(vm: AddStudentRemarksComponent): void {
        this.vm = vm;
    }

    handleClassSectionSelection(classSection: any): void {
        this.showStudentList = false;
        this.selectedClassSection = classSection;
        this.filteredSortedStudentSectionList = this.vm.studentSectionList
            .filter((studentSection) => {
                return (
                    studentSection.parentClass === this.selectedClassSection.class.id &&
                    studentSection.parentDivision === this.selectedClassSection.section.id
                );
            })
            .sort((a, b) => {
                if (a.rollNumber && b.rollNumber) {
                    return a.rollNumber - b.rollNumber;
                }
            });
    }

    /*getFilteredStudentSectionList(): any {
        return this.vm.studentSectionList.filter(studentSection => {
            return studentSection.parentClass === this.selectedClassSection.class.id
                && studentSection.parentDivision === this.selectedClassSection.section.id;
        }).sort( (a, b) => {
            if (a.rollNumber && b.rollNumber) {
                return a.rollNumber - b.rollNumber;
            }
        });
    }*/

    getTotalStudentsCount(): any {
        return this.filteredSortedStudentSectionList.length;
    }

    getRemarkedStudentsCount(): any {
        return this.vm.studentRemarkList.filter((item) => {
            if (item.remark !== '') {
                return true;
            }
            return false;
        }).length;
    }

    getStudentRemark(studentSection: any): any {
        const item = this.vm.studentRemarkList.find((studentRemark) => {
            return studentRemark.parentStudent === studentSection.parentStudent;
        });
        if (item) {
            return item.remark;
        } else {
            return '';
        }
    }

    isMobile(): boolean {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }
}
