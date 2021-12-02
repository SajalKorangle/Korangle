import { DeleteStudentComponent } from './delete-student.component';

export class DeleteStudentHtmlRenderer {
    vm: DeleteStudentComponent;

    constructor() {}

    initializeRenderer(vm: DeleteStudentComponent): void {
        this.vm = vm;
    }

    handleDetailsFromParentStudentFilter(details: any): void {
        this.vm.classList = details.classList;
        this.vm.sectionList = details.sectionList;
    }

    handleStudentListSelection(value): void{
        this.vm.studentFullProfileList.forEach((student) => {
            if(student.dbId == value[0][0].id) {
                this.vm.selectedStudent = student;
            }
        });
    }

    handleClassStudentFilter(value: any): void {
        this.vm.currentClassStudentFilter = value;
        if(this.vm.currentClassStudentFilter === 'Class') {
            this.vm.selectedStudent = null;
        }
        this.handleStudentDisplay();
    }

    handleDeletablityFilter(value: any): void {
        this.vm.currentDeletablityFilter = value;
        this.handleStudentDisplay();
    }

    getParameterValue(student, parameter) {
        try {
            return this.vm.studentParameterValueList.find(
                    (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
                ).value;
        } catch {
            return this.vm.NULL_CONSTANT;
        }
    }

    getFilteredStudentParameterList = () => this.vm.studentParameterList.filter((x) => x.parameterType === 'FILTER');

    getFilteredFilterValues(parameter: any): any {
        if (parameter.filterFilterValues === '') {
            return parameter.filterValues;
        }
        return parameter.filterValues.filter((x) => {
            return x.name.includes(parameter.filterFilterValues);
        });
    }

    getAdmissionSession(admissionSessionDbId: number): string {
        let admissionSession = null;
        this.vm.session_list.every((session) => {
            if (session.id === admissionSessionDbId) {
                admissionSession = session.name;
                return false;
            }
            return true;
        });
        return admissionSession;
    }

    getBusStopName(busStopDbId: any) {
        let stopName = '';
        if (busStopDbId !== null) {
            this.vm.busStopList.forEach((busStop) => {
                if (busStop.id === busStopDbId) {
                    stopName = busStop.stopName;
                    return;
                }
            });
        }
        return stopName;
    }

    unselectAllClasses(): void {
        this.vm.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = false;
            });
        });
        this.handleStudentDisplay();
    }

    selectAllClasses(): void {
        this.vm.classSectionList.forEach((classs) => {
            classs.sectionList.forEach((section) => {
                section.selected = true;
            });
        });
        this.handleStudentDisplay();
    }

    selectAllColumns(): void {
        Object.keys(this.vm.columnFilter).forEach((key) => {
            this.vm.columnFilter[key] = true;
        });
        this.vm.studentParameterList.forEach((item) => {
            item.show = true;
        });
    }

    unSelectAllColumns(): void {
        Object.keys(this.vm.columnFilter).forEach((key) => {
            this.vm.columnFilter[key] = false;
        });
        this.vm.studentParameterList.forEach((item) => {
            item.show = false;
        });
    }

    selectAllStudents(): void {
       this.vm.studentFullProfileList.forEach((student) => {
            if (student.show && student.isDeletable) {
                student.selectProfile = true;
            }
        });
    }

    unselectAllStudents(): void {
       this.vm.studentFullProfileList.forEach((student) => {
            if (student.show && student.isDeletable) {
                student.selectProfile = false;
            }
        });
    }

    getSelectedStudents() {
        let count = 0;
        this.vm.studentFullProfileList.forEach((student) => {
            if (student.show && student.selectProfile) {
                ++count;
            }
        });
        return count;
    }

    getDeletableStudents() {
        let count = 0;
        this.vm.studentFullProfileList.forEach((student) => {
            if (student.show && student.isDeletable) {
                ++count;
            }
        });
        return count;
    }

    showSectionName(classs: any): boolean {
        let sectionLength = 0;
        classs.sectionList.every((section) => {
            if (section.containsStudent) {
                ++sectionLength;
            }
            if (sectionLength > 1) {
                return false;
            } else {
                return true;
            }
        });
        return sectionLength > 1;
    }

    handleStudentDisplay(): void {
        let serialNumber = 0;
        this.vm.displayStudentNumber = 0;

        this.vm.studentFullProfileList.forEach((student) => {

            /* Class Section Check */
            if (!student.sectionObject.selected) {
                student.show = false;
                return;
            }

            /* Age Check */
            if (this.vm.asOnDate) {
                let age = student.dateOfBirth
                    ? Math.floor((new Date(this.vm.asOnDate).getTime() - new Date(student.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
                    : null;
                if (this.vm.minAge != '' && this.vm.minAge != null && !isNaN(this.vm.minAge)) {
                    if (!age) {
                        student.show = false;
                        return;
                    } else if (age < this.vm.minAge) {
                        student.show = false;
                        return;
                    }
                }
                if (this.vm.maxAge != '' && this.vm.maxAge != null && !isNaN(this.vm.maxAge)) {
                    if (!age) {
                        student.show = false;
                        return;
                    } else if (age > this.vm.maxAge) {
                        student.show = false;
                        return;
                    }
                }
            }

            /* Category Check */
            if (
                !(this.vm.scSelected && this.vm.stSelected && this.vm.obcSelected && this.vm.generalSelected) &&
                !(!this.vm.scSelected && !this.vm.stSelected && !this.vm.obcSelected && !this.vm.generalSelected)
            ) {
                if (student.category === null || student.category === '') {
                    student.show = false;
                    return;
                }
                switch (student.category) {
                    case 'SC':
                        if (!this.vm.scSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'ST':
                        if (!this.vm.stSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'OBC':
                        if (!this.vm.obcSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Gen.':
                        if (!this.vm.generalSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Gender Check */
            if (
                !(this.vm.maleSelected && this.vm.femaleSelected && this.vm.otherGenderSelected) &&
                !(!this.vm.maleSelected && !this.vm.femaleSelected && !this.vm.otherGenderSelected)
            ) {
                if (student.gender === null || student.gender === '') {
                    student.show = false;
                    return;
                }
                switch (student.gender) {
                    case 'Male':
                        if (!this.vm.maleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Female':
                        if (!this.vm.femaleSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                    case 'Other':
                        if (!this.vm.otherGenderSelected) {
                            student.show = false;
                            return;
                        }
                        break;
                }
            }

            /* Admission Filter Check */
            if (!this.vm.newAdmission && student.admissionSessionDbId === this.vm.user.activeSchool.currentSessionDbId) {
                student.show = false;
                return;
            } else if (!this.vm.oldAdmission && student.admissionSessionDbId !== this.vm.user.activeSchool.currentSessionDbId) {
                student.show = false;
                return;
            }

            /* RTE Filter Check */
            if (
                !(
                    (this.vm.yesRTE && student.rte === 'YES') ||
                    (this.vm.noRTE && student.rte === 'NO') ||
                    (this.vm.noneRTE && student.rte != 'YES' && student.rte != 'NO')
                )
            ) {
                /*
                 First we are checking for which conditions student should be visible then we are applying a 'NOT'
                 to the whole to get student invisible condition
                 */
                student.show = false;
                return;
            }

            // Transfer Certiicate Check
            if (!((this.vm.noTC && !student.parentTransferCertificate && !student.newTransferCertificate)
                || (this.vm.yesTC && (student.parentTransferCertificate || student.newTransferCertificate)))) {
                student.show = false;
                return;
            }

            // Custom filters check
            for (let x of this.getFilteredStudentParameterList()) {
                let flag = x.showNone;
                x.filterValues.forEach((filter) => {
                    flag = flag || filter.show;
                });
                if (flag) {
                    let parameterValue = this.getParameterValue(student, x);
                    if (parameterValue === this.vm.NULL_CONSTANT && x.showNone) {
                    } else if (
                        !x.filterValues
                            .filter((filter) => filter.show)
                            .map((filter) => filter.name)
                            .includes(parameterValue)
                    ) {
                        student.show = false;
                        return;
                    }
                }
            }

            // Deletability Filter check
            if(this.vm.currentDeletablityFilter == this.vm.deletablitySelectList[1]) {
                if(!student.isDeletable){
                    student.show = false;
                    return;
                }
            }
            if(this.vm.currentDeletablityFilter == this.vm.deletablitySelectList[2]) {
                if(student.isDeletable){
                    student.show = false;
                    return;
                }
            }

            ++this.vm.displayStudentNumber;
            student.show = true;
            student.selectProfile = false;
            student.serialNumber = ++serialNumber;
        });
    }

}
