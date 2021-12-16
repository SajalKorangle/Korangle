import { DeleteStudentComponent } from './delete-student.component';

export class DeleteStudentHtmlRenderer {
    vm: DeleteStudentComponent;

    constructor() {}

    initializeRenderer(vm: DeleteStudentComponent): void {
        this.vm = vm;
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

}
