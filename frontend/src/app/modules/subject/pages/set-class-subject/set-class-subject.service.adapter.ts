import { SetClassSubjectComponent } from './set-class-subject.component';

export class SetClassSubjectServiceAdapter {
    vm: SetClassSubjectComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;
    classSubjectList: any;
    studentSubjectList: any;
    studentSectionList: any;
    subjectList: any;
    sessionList: any;
    employeeList: any;

    classSectionStudentSubjectList: any;

    initializeAdapter(vm: SetClassSubjectComponent): void {
        this.vm = vm;
    }

    // initialize Data
    initializeData(): void {
        this.vm.isSessionLoading = true;

        let request_student_subject_data = {
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
        };

        let request_class_subject_data = {
            sessionList: [this.vm.user.activeSchool.currentSessionDbId],
            schoolList: [this.vm.user.activeSchool.dbId],
        };

        let request_student_section_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_employee_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.genericService.getObjectList({class_app: 'Class'}, {}), // 0
            this.vm.genericService.getObjectList({class_app: 'Division'}, {}), // 1
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            this.vm.studentService.getStudentMiniProfileList(request_student_section_data, this.vm.user.jwt),
            this.vm.genericService.getObjectList({school_app: 'Session'}, {}),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.employeeService.getEmployeeMiniProfileList(request_employee_data, this.vm.user.jwt),
        ]).then(
            (value) => {
                this.classList = value[0];
                this.sectionList = value[1];
                this.classSubjectList = value[2];
                this.studentSubjectList = value[3];
                this.studentSectionList = value[4];
                this.sessionList = value[5];
                this.subjectList = value[6];
                this.employeeList = value[7];
                this.populateClassSectionSubjectList();
                this.populateSessionListAndSelectedSession();
                this.populateSubjectList();
                this.populateClassSectionStudentSubjectList();
                this.populateEmployeeList();
                this.vm.isSessionLoading = false;
            },
            (error) => {
                this.vm.isSessionLoading = false;
            }
        );
    }

    populateEmployeeList(): void {
        this.vm.employeeList = this.employeeList.filter((employee) => {
            return employee.dateOfLeaving === null;
        });
    }

    populateClassSectionSubjectList(): void {
        this.vm.classSectionSubjectList = [];
        this.classList.forEach((classs) => {
            let tempClass = {};
            Object.keys(classs).forEach((key) => {
                tempClass[key] = classs[key];
            });
            tempClass['sectionList'] = [];
            this.sectionList.forEach((section) => {
                let tempSection = {};
                Object.keys(section).forEach((key) => {
                    tempSection[key] = section[key];
                });
                tempSection['subjectList'] = [];
                this.classSubjectList.forEach((classSubject) => {
                    if (classSubject.parentClass === tempClass['id'] && classSubject.parentDivision === tempSection['id']) {
                        let tempSubject = {};

                        Object.keys(classSubject).forEach((key) => {
                            tempSubject[key] = classSubject[key];
                        });
                        tempSubject['newEmployee'] = this.getEmployee(tempSubject['parentEmployee']);
                        tempSubject['newOrderNumber'] = tempSubject['orderNumber'];
                        tempSubject['newMainSubject'] = tempSubject['mainSubject'];
                        tempSubject['newOnlyGrade'] = tempSubject['onlyGrade'];

                        tempSection['subjectList'].push(tempSubject);
                    }
                });
                tempClass['sectionList'].push(tempSection);
            });
            tempClass['selectedSection'] = tempClass['sectionList'][0];
            this.vm.classSectionSubjectList.push(tempClass);
        });
        this.vm.selectedClass = this.vm.classSectionSubjectList[0];
    }

    getEmployee(employeeId: number): any {
        let result = null;
        this.employeeList.every((employee) => {
            if (employee.id === employeeId) {
                result = employee;
                return false;
            }
            return true;
        });
        return result;
    }

    populateSessionListAndSelectedSession(): void {
        this.vm.sessionList = this.sessionList;
        this.vm.sessionList.forEach((session) => {
            if (session.id === this.vm.user.activeSchool.currentSessionDbId) {
                this.vm.selectedSession = session;
            }
        });
    }

    populateSubjectList(): void {
        this.vm.subjectList = this.subjectList;
    }

    populateClassSectionStudentSubjectList(): void {
        this.classSectionStudentSubjectList = [];
        this.classList.forEach((classs) => {
            let tempClass = {};
            Object.keys(classs).forEach((key) => {
                tempClass[key] = classs[key];
            });
            tempClass['sectionList'] = [];
            this.sectionList.forEach((section) => {
                let tempSection = {};
                Object.keys(section).forEach((key) => {
                    tempSection[key] = section[key];
                });
                tempSection['studentList'] = [];
                this.studentSectionList.forEach((studentSection) => {
                    if (studentSection.classDbId === tempClass['id'] && studentSection.sectionDbId === tempSection['id']) {
                        let tempStudent = {};
                        Object.keys(studentSection).forEach((key) => {
                            tempStudent[key] = studentSection[key];
                        });
                        tempStudent['subjectList'] = [];
                        this.studentSubjectList.forEach((studentSubject) => {
                            if (studentSubject.parentStudent === studentSection.dbId) {
                                let tempSubject = {};
                                Object.keys(studentSubject).forEach((key) => {
                                    tempSubject[key] = studentSubject[key];
                                });
                                tempStudent['subjectList'].push(tempSubject);
                            }
                        });
                        tempSection['studentList'].push(tempStudent);
                    }
                });
                tempClass['sectionList'].push(tempSection);
            });
            this.classSectionStudentSubjectList.push(tempClass);
        });
    }

    // Handle Session Change
    handleSessionChange(): void {
        alert('Functionality yet to be implemented');
    }

    // Add Subject
    addSubject(): void {
        if (this.vm.selectedSubject === null) {
            alert('Subject should be selected');
            return;
        }

        if (this.vm.selectedEmployee === null) {
            alert('Employee should be selected');
            return;
        }

        this.vm.isLoading = true;

        if (this.vm.orderNumber == null) {
            this.vm.orderNumber = 0;
        }

        let class_subject_data = {
            parentClass: this.vm.selectedClass.id,
            parentDivision: this.vm.selectedClass.selectedSection.id,
            parentSession: this.vm.selectedSession.id,
            parentSubject: this.vm.selectedSubject.id,
            parentSchool: this.vm.user.activeSchool.dbId,
            parentEmployee: this.vm.selectedEmployee.id,
            orderNumber: this.vm.orderNumber,
            mainSubject: this.vm.mainSubject,
            onlyGrade: this.vm.onlyGrade,
        };

        let student_subject_data = this.prepareStudentSubjectDataToAdd();

        Promise.all([
            this.vm.subjectService.createClassSubject(class_subject_data, this.vm.user.jwt),
            this.vm.subjectService.createStudentSubjectList(student_subject_data, this.vm.user.jwt),
        ]).then(
            (value) => {
                alert('Subject added in class successfully');
                this.addSubjectInClassSectionSubjectList(value[0]);
                this.addSubjectInClassSectionStudentSubjectList(value[0], value[1]);
                this.vm.selectedSubject = null;
                this.vm.selectedEmployee = null;
                this.vm.orderNumber = 0;
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    prepareStudentSubjectDataToAdd(): any {
        let data = [];
        this.classSectionStudentSubjectList.every((classs) => {
            if (classs.id === this.vm.selectedClass.id) {
                classs.sectionList.every((section) => {
                    if (section.id === this.vm.selectedClass.selectedSection.id) {
                        section.studentList.forEach((student) => {
                            let shouldBeAdded = true;
                            student.subjectList.every((studentSubject) => {
                                if (studentSubject.parentSubject === this.vm.selectedSubject.id) {
                                    shouldBeAdded = false;
                                    return false;
                                }
                                return true;
                            });
                            if (shouldBeAdded) {
                                let tempData = {
                                    parentStudent: student.dbId,
                                    parentSession: this.vm.selectedSession.id,
                                    parentSubject: this.vm.selectedSubject.id,
                                };
                                data.push(tempData);
                            }
                        });
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        return data;
    }

    addSubjectInClassSectionStudentSubjectList(classSubject: any, studentSubjectList): void {
        this.classSectionStudentSubjectList.every((classs) => {
            if (classs.id === classSubject.parentClass) {
                classs.sectionList.every((section) => {
                    if (section.id === classSubject.parentDivision) {
                        section['studentList'].forEach((student) => {
                            studentSubjectList.every((studentSubject) => {
                                if (student.dbId === studentSubject.parentStudent) {
                                    student.subjectList.push(studentSubject);
                                    return false;
                                }
                                return true;
                            });
                        });
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
    }

    addSubjectInClassSectionSubjectList(classSubject: any): void {
        this.vm.classSectionSubjectList.every((classs) => {
            if (classs.id === classSubject.parentClass) {
                classs.sectionList.every((section) => {
                    if (section.id === classSubject.parentDivision) {
                        let tempSubject = {};

                        Object.keys(classSubject).forEach((key) => {
                            tempSubject[key] = classSubject[key];
                        });
                        tempSubject['newEmployee'] = this.getEmployee(tempSubject['parentEmployee']);
                        tempSubject['newOrderNumber'] = tempSubject['orderNumber'];
                        tempSubject['newMainSubject'] = tempSubject['mainSubject'];
                        tempSubject['newOnlyGrade'] = tempSubject['onlyGrade'];

                        section['subjectList'].push(tempSubject);
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
    }

    // Remove Subject
    removeSubject(subject: any): void {
        if (confirm('Are you sure ? removing the subject will remove all its corresponding tutorial videos')) {
            this.vm.isLoading = true;

            let class_subject_data = subject.id;

            let student_subject_data = this.prepareStudentSubjectDataToRemove(subject);

            Promise.all([
                this.vm.subjectService.deleteClassSubject(class_subject_data, this.vm.user.jwt),
                student_subject_data.length > 0
                    ? this.vm.subjectService.deleteStudentSubjectList(student_subject_data, this.vm.user.jwt)
                    : '',
            ]).then(
                (value) => {
                    alert('Subject removed from class successfully');
                    this.removeSubjectFromClassSectionSubjectList(subject.parentClass, subject.parentDivision, subject.parentSubject);
                    this.removeSubjectFromClassSectionStudentSubjectList(
                        subject.parentClass,
                        subject.parentDivision,
                        subject.parentSubject
                    );
                    this.vm.isLoading = false;
                },
                (error) => {
                    this.vm.isLoading = false;
                }
            );
        }
    }

    prepareStudentSubjectDataToRemove(subject: any): any {
        let data = [];
        this.classSectionStudentSubjectList.every((classs) => {
            if (classs.id === subject.parentClass) {
                classs.sectionList.every((section) => {
                    if (section.id === subject.parentDivision) {
                        section.studentList.forEach((student) => {
                            student.subjectList.every((studentSubject) => {
                                if (studentSubject.parentSubject === subject.parentSubject) {
                                    data.push(studentSubject.id);
                                    return false;
                                }
                                return true;
                            });
                        });
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
        return data.join();
    }

    removeSubjectFromClassSectionStudentSubjectList(classId: any, sectionId: any, subjectId: any): void {
        this.classSectionStudentSubjectList.every((classs) => {
            if (classs.id === classId) {
                classs.sectionList.every((section) => {
                    if (section.id === sectionId) {
                        section['studentList'].forEach((student) => {
                            student['subjectList'] = student['subjectList'].filter((subject) => {
                                if (subject.parentSubject === subjectId) {
                                    return false;
                                }
                                return true;
                            });
                        });
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
    }

    removeSubjectFromClassSectionSubjectList(classId: any, sectionId: any, subjectId: any): void {
        this.vm.classSectionSubjectList.every((classs) => {
            if (classs.id === classId) {
                classs.sectionList.every((section) => {
                    if (section.id === sectionId) {
                        section['subjectList'] = section['subjectList'].filter((subject) => {
                            if (subject.parentSubject === subjectId) {
                                return false;
                            }
                            return true;
                        });
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        });
    }

    // Update Subject
    updateSubject(subject: any): void {
        let data = {
            id: subject.id,
            parentClass: subject.parentClass,
            parentDivision: subject.parentDivision,
            parentSession: subject.parentSession,
            parentSubject: subject.parentSubject,
            parentSchool: subject.parentSchool,
            parentEmployee: subject.newEmployee.id,
            orderNumber: subject.newOrderNumber,
            mainSubject: subject.newMainSubject,
            onlyGrade: subject.newOnlyGrade,
        };

        this.vm.isLoading = true;

        Promise.all([this.vm.subjectService.updateClassSubject(data, this.vm.user.jwt)]).then(
            (value) => {
                alert('Subject updated in class successfully');
                subject.parentEmployee = subject.newEmployee.id;
                subject.orderNumber = subject.newOrderNumber;
                subject.mainSubject = subject.newMainSubject;
                subject.onlyGrade = subject.newOnlyGrade;
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }
}
