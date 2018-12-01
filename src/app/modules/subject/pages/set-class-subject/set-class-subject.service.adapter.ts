
import {SetClassSubjectComponent} from './set-class-subject.component';

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
            sessionId: this.vm.user.activeSchool.currentSessionDbId,
            schoolId: this.vm.user.activeSchool.dbId,
        };

        let request_student_section_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.classService.getClassList(this.vm.user.jwt),
            this.vm.classService.getSectionList(this.vm.user.jwt),
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),
            this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            this.vm.studentService.getStudentMiniProfileList(request_student_section_data, this.vm.user.jwt),
            this.vm.schoolService.getSessionList(this.vm.user.jwt),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
        ]).then( value => {
            this.classList = value[0];
            this.sectionList = value[1];
            this.classSubjectList = value[2];
            this.studentSubjectList = value[3];
            this.studentSectionList = value[4];
            this.sessionList = value[5];
            this.subjectList = value[6];
            this.populateClassSectionSubjectList();
            this.populateSessionListAndSelectedSession();
            this.populateSubjectList();
            this.populateClassSectionStudentSubjectList();
            this.vm.isSessionLoading =false;
        }, error => {
            this.vm.isSessionLoading = false;
        });
    }

    populateClassSectionSubjectList(): void {
        this.vm.classSectionSubjectList = [];
        this.classList.forEach(classs => {
            let tempClass = {};
            Object.keys(classs).forEach(key => {
                tempClass[key] = classs[key];
            });
            tempClass['sectionList'] = [];
            this.sectionList.forEach(section => {
                let tempSection = {};
                Object.keys(section).forEach(key => {
                    tempSection[key] = section[key];
                });
                tempSection['subjectList'] = [];
                this.classSubjectList.forEach(classSubject => {
                    if (classSubject.parentClass === tempClass['dbId']
                        && classSubject.parentDivision === tempSection['id']) {
                        let tempSubject = {};
                        Object.keys(classSubject).forEach(key => {
                            tempSubject[key] = classSubject[key];
                        });
                        tempSection['subjectList'].push(tempSubject);
                    }
                });
                tempClass['sectionList'].push(tempSection);
            });
            tempClass['selectedSection'] = tempClass['sectionList'][0]
            this.vm.classSectionSubjectList.push(tempClass);
        });
        this.vm.selectedClass = this.vm.classSectionSubjectList[0];
    }

    populateSessionListAndSelectedSession(): void {
        this.vm.sessionList = this.sessionList;
        this.vm.sessionList.forEach(session => {
            if (session.dbId === this.vm.user.activeSchool.currentSessionDbId) {
                this.vm.selectedSession = session;
            }
        });
    }

    populateSubjectList(): void {
        this.vm.subjectList = this.subjectList;
    }

    populateClassSectionStudentSubjectList(): void {
        this.classSectionStudentSubjectList = [];
        this.classList.forEach(classs => {
            let tempClass = {};
            Object.keys(classs).forEach(key => {
                tempClass[key] = classs[key];
            });
            tempClass['sectionList'] = [];
            this.sectionList.forEach(section => {
                let tempSection = {};
                Object.keys(section).forEach(key => {
                    tempSection[key] = section[key];
                });
                tempSection['subjectList'] = [];
                tempSection['studentList'] = [];
                this.classSubjectList.forEach(classSubject => {
                    if (classSubject.parentClass === tempClass['dbId']
                        && classSubject.parentDivision === tempSection['id']) {
                        let tempSubject = {};
                        Object.keys(classSubject).forEach(key => {
                            tempSubject[key] = classSubject[key];
                        });
                        tempSection['subjectList'].push(tempSubject);
                    }
                });
                this.studentSectionList.forEach(studentSection => {
                    if (studentSection.classDbId === tempClass['dbId']
                        && studentSection.sectionDbId === tempSection['id']) {
                        let tempStudent = {};
                        Object.keys(studentSection).forEach(key => {
                            tempStudent[key] = studentSection[key];
                        });
                        tempStudent['subjectList'] = [];
                        this.studentSubjectList.forEach(studentSubject => {
                            if (studentSubject.parentStudent === studentSection.dbId) {
                                let tempSubject = {};
                                Object.keys(studentSubject).forEach(key => {
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

        this.vm.isLoading = true;

        let class_subject_data = {
            'parentClass': this.vm.selectedClass.dbId,
            'parentDivision': this.vm.selectedClass.selectedSection.id,
            'parentSession': this.vm.selectedSession.dbId,
            'parentSubject': this.vm.selectedSubject.id,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let student_subject_data = this.prepareStudentSubjectDataToAdd();

        Promise.all([
            this.vm.subjectService.createClassSubject(class_subject_data, this.vm.user.jwt),
            this.vm.subjectService.createStudentSubjectList(student_subject_data, this.vm.user.jwt),
        ]).then(value => {
            alert('Subject added in class successfully');
            this.addSubjectInClassSectionSubjectList(value[0]);
            this.addSubjectInClassSectionStudentSubjectList(value[0], value[1]);
            this.vm.selectedSubject = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    prepareStudentSubjectDataToAdd(): any {
        let data = [];
        this.classSectionStudentSubjectList.every(classs => {
            if (classs.dbId === this.vm.selectedClass.dbId) {
                classs.sectionList.every(section => {
                    if (section.id === this.vm.selectedClass.selectedSection.id) {
                        section.studentList.forEach(student => {
                            let shouldBeAdded = true;
                            student.subjectList.every(studentSubject => {
                                if (studentSubject.parentSubject === this.vm.selectedSubject.id) {
                                    shouldBeAdded = false;
                                    return false;
                                }
                                return true;
                            });
                            if (shouldBeAdded) {
                                let tempData = {
                                    'parentStudent': student.dbId,
                                    'parentSession': this.vm.selectedSession.dbId,
                                    'parentSubject': this.vm.selectedSubject.id,
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
        this.classSectionStudentSubjectList.every(classs => {
            if (classs.dbId === classSubject.parentClass) {
                classs.sectionList.every(section => {
                    if (section.id === classSubject.parentDivision) {
                        section['subjectList'].push(classSubject);
                        section['studentList'].forEach(student => {
                            studentSubjectList.every(studentSubject => {
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
        })
    }

    addSubjectInClassSectionSubjectList(classSubject: any): void {
        this.vm.classSectionSubjectList.every(classs => {
            if (classs.dbId === classSubject.parentClass) {
                classs.sectionList.every(section => {
                    if (section.id === classSubject.parentDivision) {
                        section['subjectList'].push(classSubject);
                        return false;
                    }
                    return true;
                });
                return false;
            }
            return true;
        })
    }

    // Remove Subject
    removeSubject(subject: any): void {

        this.vm.isLoading = true;

        let class_subject_data = subject.id;

        let student_subject_data = this.prepareStudentSubjectDataToRemove(subject);

        Promise.all([
            this.vm.subjectService.deleteClassSubject(class_subject_data, this.vm.user.jwt),
            ((student_subject_data.length>0)?this.vm.subjectService.deleteStudentSubjectList(student_subject_data, this.vm.user.jwt):''),
        ]).then(value => {
            alert('Subject removed from class successfully');
            this.removeSubjectFromClassSectionSubjectList(subject.parentClass, subject.parentDivision, subject.parentSubject);
            this.removeSubjectFromClassSectionStudentSubjectList(subject.parentClass, subject.parentDivision, subject.parentSubject);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });
    }

    prepareStudentSubjectDataToRemove(subject: any): any {
        let data = [];
        this.classSectionStudentSubjectList.every(classs => {
            if (classs.dbId === subject.parentClass) {
                classs.sectionList.every(section => {
                    if (section.id === subject.parentDivision) {
                        section.studentList.forEach(student => {
                            student.subjectList.every(studentSubject => {
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
        this.classSectionStudentSubjectList.every(classs => {
            if (classs.dbId === classId) {
                classs.sectionList.every(section => {
                    if (section.id === sectionId) {
                        section['subjectList'] = section['subjectList'].filter(subject => {
                            if (subject.parentSubject === subjectId) {
                                return false;
                            }
                            return true;
                        });
                        section['studentList'].forEach(student => {
                            student['subjectList'] = student['subjectList'].filter(subject => {
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
        })
    }

    removeSubjectFromClassSectionSubjectList(classId: any, sectionId: any, subjectId: any): void {
        this.vm.classSectionSubjectList.every(classs => {
            if (classs.dbId === classId) {
                classs.sectionList.every(section => {
                    if (section.id === sectionId) {
                        section['subjectList'] = section['subjectList'].filter(subject => {
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
        })
    }

}