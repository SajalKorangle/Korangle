import { DesignReportCardComponent } from './design-report-card.component';

export class DesignReportCardGradeAdapter {

    vm: DesignReportCardComponent;

    selectedGrade: any;
    filteredSubGradeList: any;

    constructor() {}

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {

        this.vm = vm;

    }

    getFilteredSubGradeList(): any {
        const gradeId = this.vm.data.subGradeList.find(subGrade => {
            return subGrade.id === this.vm.currentUserHandle.value.subGradeId;
        }).parentGrade;
        return this.vm.data.subGradeList.filter(subGrade => {
            return subGrade.parentGrade === gradeId;
        })
    }

    getGradeId(): any {
        return this.vm.data.subGradeList.find(subGrade => {
            return subGrade.id === this.vm.currentUserHandle.value.subGradeId;
        }).parentGrade;
    }

    setSubGrade(gradeId: any): any {
        this.vm.currentUserHandle.value.subGradeId = this.vm.data.subGradeList.find(subGrade => {
            return subGrade.parentGrade === gradeId;
        }).id;
        this.filteredSubGradeList = this.vm.data.subGradeList.filter(subGrade => {
            return subGrade.parentGrade === gradeId;
        });
    }

}

