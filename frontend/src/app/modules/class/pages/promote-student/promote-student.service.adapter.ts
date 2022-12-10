import { PromoteStudentComponent } from './promote-student.component';

export class PromoteStudentServiceAdapter {
    vm: PromoteStudentComponent;

    constructor() { }

    initializeAdapter(vm: PromoteStudentComponent): void {
        this.vm = vm;
    }

    // initialize data
    async initializeData() {

        this.vm.sessionList = await this.vm.genericService.getObjectList({school_app: 'Session'}, {});

        const fromSessionIndex = this.vm.sessionList.findIndex(session => {
            return session.id == this.vm.user.activeSchool.currentSessionDbId;
        });
        this.vm.fromSessionName = this.vm.sessionList[fromSessionIndex].name;
        this.vm.toSessionName = (fromSessionIndex != this.vm.sessionList.length - 1) ? this.vm.sessionList[fromSessionIndex + 1].name : '';
        this.vm.toSessionId = (fromSessionIndex != this.vm.sessionList.length - 1) ? this.vm.sessionList[fromSessionIndex + 1].id : 0;


        const student_section_list_one = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
        };

        const student_section_list_two = {
            parentSession: this.vm.toSessionId,
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentStudent__parentTransferCertificate: 'null__korangle',
        };

        const tc_data = {
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            parentStudentSection__parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            status__in: ['Generated', 'Issued'],
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}), // 0
            this.vm.classService.getObjectList(this.vm.classService.division, {}), // 1
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list_one), // 2
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_list_two), // 3
            this.vm.tcService.getObjectList(this.vm.tcService.transfer_certificate, tc_data), // 4
        ]).then(
            (value) => {

                this.vm.classList = value[0];
                this.vm.sectionList = value[1];

                this.vm.studentSectionListOne = value[2].filter(
                    (ss) => value[4].find((tc) => tc.parentStudentSection == ss.id) == undefined
                );
                this.vm.studentSectionListTwo = value[3];

                this.populateFromAndToVariables();

                const student_list = [
                    ...new Set(
                        this.vm.studentSectionListOne
                            .map((a) => a.parentStudent)
                            .concat(this.vm.studentSectionListTwo.map((a) => a.parentStudent))
                    ),
                ];

                const iterationCount = Math.ceil(student_list.length / this.vm.STUDENT_LIMITER);
                const service_list = [];
                let loopVariable = 0;
                while (loopVariable < iterationCount) {
                    const temp_id_list = {
                        id__in: student_list
                            .slice(this.vm.STUDENT_LIMITER * loopVariable, this.vm.STUDENT_LIMITER * (loopVariable + 1))
                            .join(),
                    };

                    service_list.push(this.vm.studentService.getObjectList(this.vm.studentService.student, temp_id_list));
                    loopVariable = loopVariable + 1;
                }

                Promise.all(service_list).then(
                    (valueTwo) => {

                        this.vm.studentList = [];
                        let loopVariable = 0;
                        while (loopVariable < iterationCount) {
                            this.vm.studentList = this.vm.studentList.concat(valueTwo[loopVariable]);
                            loopVariable = loopVariable + 1;
                        }

                        this.vm.isLoading = false;
                    },
                    (error) => {
                        this.vm.isLoading = false;
                    }
                );
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    populateFromAndToVariables(): void {
        this.vm.fromSelectedClass = this.vm.classList[0];
        this.vm.fromSelectedSection = this.vm.sectionList[0];
        this.vm.toSelectedClass = this.vm.classList[0];
        this.vm.toSelectedSection = this.vm.sectionList[0];

        const tempStudentIdList = this.vm.studentSectionListTwo.map((a) => a.parentStudent);

        this.vm.unPromotedStudentList = this.vm.studentSectionListOne.filter((studentSection) => {
            return !tempStudentIdList.includes(studentSection.parentStudent);
        });
    }

    // Promote Students
    promoteStudents(): void {
        this.vm.isLoading = true;

        Promise.all([
            this.vm.studentService.createObjectList(this.vm.studentService.student_section, this.vm.newPromotedList),
        ]).then(
            (value) => {
                alert('Students promoted successfully');

                this.handleAfterPromotion(value[0]);

                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    handleAfterPromotion(promotedList: any): void {
        const tempStudentSectionIdList = promotedList.map((a) => a.parentStudent);

        this.vm.unPromotedStudentList = this.vm.unPromotedStudentList.filter((item) => {
            return !tempStudentSectionIdList.includes(item.parentStudent);
        });

        this.vm.studentSectionListTwo = this.vm.studentSectionListTwo.concat(promotedList);

        this.vm.newPromotedList = [];
    }
}
