
import {UpdateMarksComponent} from './update-marks.component';

import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';

export class UpdateMarksServiceAdapter {

    vm: UpdateMarksComponent;

    test_type_list = TEST_TYPE_LIST;
    student_section_data_list: any;
    student_data_list: any;

    constructor() {}

    // Data
    examinationList: any;
    classList: any;
    sectionList: any;
    subjectList: any;
    testList: any;
    classSubjectList: any;

    student_mini_profile_list: any = [];


    initializeAdapter(vm: UpdateMarksComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;
        this.vm.isUpdated = false;
        let request_examination_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        let request_class_subject_data = {
            'parentEmployee': this.vm.user.activeSchool.employeeId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };


        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
            this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_data),
        ]).then(value => {

            this.examinationList = value[0];
            this.classList = value[1];
            this.sectionList = value[2];
            this.subjectList = value[3];
            this.classSubjectList = value[4];

            
            let classes=[],sections=[];
            value[4].forEach(classSubject => {
                classes.push(classSubject.parentClass);
                sections.push(classSubject.parentDivision);
            });

            let request_student_section_data = {
                'parentStudent__parentSchool' :this.vm.user.activeSchool.dbId,
                'parentClass__in': classes,
                'parentDivision__in': sections,
                'parentSession': this.vm.user.activeSchool.currentSessionDbId
            }

            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data).then(value => {
                this.student_section_data_list = value;



                let studentInThisClassSection = [];
                this.student_section_data_list.forEach(studentSection => {
                    studentInThisClassSection.push(studentSection.parentStudent);
                })

                let request_student_mini_profile_data_new = {
                    'id__in': studentInThisClassSection.join(','),
                    'fields__korangle': 'id,name,fathersName,profileImage,gender,scholarNumber,parentTransferCertificate'
                };

                this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_mini_profile_data_new).then(value => {
                    this.student_data_list = value;

                    this.student_data_list.forEach(student => {
                        this.student_section_data_list.forEach(stud_sec => {
    
                            if (stud_sec.parentStudent === student.id) {
                                let data = {
                                    dbId: student.id,
                                    name: student.name,
                                    fatherName: student.fatherName,
                                    gender: student.gender,
                                    profileImage: student.profileImage,
                                    scholarNumber: student.scholarNumber,
                                    parentTransferCertificate: student.parentTransferCertificate,
                                    classDbId: stud_sec.parentClass,
                                    className: this.getClassName(stud_sec.parentClass),
                                    sectionDbId: stud_sec.parentDivision,
                                    sectionName: this.getSectionName(stud_sec.parentDivision),
                                    studentSectionDbId: stud_sec.id,
                                    rollNumber: stud_sec.rollNumber
                                }
                                this.vm.student_mini_profile_list.push(data);
                                this.student_mini_profile_list.push(data);
    
                            }
                        });
                    });



                    let service_list = [];

                    let examination_id_list = this.getExaminationIdList();
        
                    this.classSubjectList.forEach(item => {
        
                        let request_class_test_data = {
                            /*'examinationId': this.vm.selectedExamination.id,
                            'classId': this.vm.selectedExamination.selectedClass.id,
                            'sectionId': this.vm.selectedExamination.selectedClass.selectedSection.id,*/
                            'parentExamination__in': examination_id_list,
                            'parentClass': item.parentClass,
                            'parentDivision': item.parentDivision,
                            'parentSubject' : item.parentSubject
                        };
        
                        // let request_class_test_data = {
                        //     'examinationList': [examination_id_list],
                        //     'subjectList': [item.parentSubject],
                        //     'classList': [item.parentClass],
                        //     'sectionList': [item.parentDivision],
                        //     'startTimeList': [],
                        //     'endTimeList': [],
                        //     'testTypeList': [],
                        //     'maximumMarksList': [],
                        // };
        
                        service_list.push(this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_class_test_data));
        
                    });
        
                    Promise.all(service_list).then(value => {
        
                        this.testList = [];
        
                        value.forEach(item => {
                            if (item.length > 0) {
                                item.forEach(itemTwo => {
                                    this.testList.push(itemTwo);
                                });
                            }
                        });
        
                        this.populateExaminationClassSectionSubjectList();
                        this.vm.subjectList = this.subjectList;
                        this.vm.isInitialLoading = false;
        
                    });
    
                })
            });


        }, error => {
            this.vm.isInitialLoading = false;
        });

    }
    getSectionName(sectionId: any): any {
        let result = '';
        this.sectionList.every((item) => {
            if (item.id === sectionId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }
    getClassName(classId: any): any {
        let result = '';
        this.classList.every((item) => {
            if (item.id === classId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getStudentIdList(studentList): any {
        let result = [];
        studentList.forEach(student => {
            result.push(student.id);
        });
        return result;
    }

    getExaminationIdList(): any {
        let id_list = [];
        this.examinationList.forEach(item => {
            id_list.push(item.id);
        });
        return id_list;
    }

    populateExaminationClassSectionSubjectList(): void {
        this.vm.examinationClassSectionSubjectList = [];
        this.examinationList.forEach(examination => {
            if (this.isExaminationInTestList(examination)) {

                let tempExamination = this.copyObject(examination);

                tempExamination['classList'] = [];

                this.classList.forEach(classs => {
                    if (this.isExaminationClassInTestList(examination, classs)) {

                        let tempClass = this.copyObject(classs);

                        tempClass['sectionList'] = [];

                        this.sectionList.forEach(section => {
                            if (this.isExaminationClassSectionInTestList(examination, classs, section)) {

                                let tempSection = this.copyObject(section);

                                tempSection['subjectList'] = [];

                                this.subjectList.forEach(subject => {

                                    let testDetails = this.getTestDetails(examination, classs, section, subject);

                                    if (testDetails.length > 0) {

                                        let tempSubject = this.copyObject(subject);

                                        tempSubject['testDetails'] = testDetails;

                                        tempSection['subjectList'].push(tempSubject);

                                    }

                                });

                                tempSection['selectedSubject'] = tempSection['subjectList'][0];

                                tempClass['sectionList'].push(tempSection);

                            }
                        });

                        tempClass['selectedSection'] = tempClass['sectionList'][0];

                        tempExamination['classList'].push(tempClass);

                    }
                });

                tempExamination['selectedClass'] = tempExamination['classList'][0];

                this.vm.examinationClassSectionSubjectList.push(tempExamination);

            }
        });
        this.vm.selectedExamination = this.vm.examinationClassSectionSubjectList[0];


    }

    isExaminationInTestList(examination: any): boolean {
        let result = false;
        this.testList.every(item => {
            if (item.parentExamination === examination.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result
    }

    isExaminationClassInTestList(examination: any, classs: any): boolean {
        let result = false;
        this.testList.every(item => {
            if (item.parentClass === classs.id
                && item.parentExamination === examination.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    isExaminationClassSectionInTestList(examination: any, classs: any, section: any): boolean {
        let result = false;
        this.testList.every(item => {
            if (item.parentExamination === examination.id
                && item.parentClass === classs.id
                && item.parentDivision === section.id) {
                result = true;
                return false;
            }
            return true;
        });
        return result;
    }

    getTestDetails(examination: any, classs: any, section: any, subject: any): any {
        let result = [];
        this.testList.forEach(item => {
            if (item.parentExamination === examination.id
                && item.parentClass === classs.id
                && item.parentDivision === section.id
                && item.parentSubject === subject.id) {
                result.push(item);
            }
        });
        return result.sort((a, b) => {
            if (a.testType === null) {
                return 0;
            } else if (b.testType === null) {
                return 1;
            }
            return a.testType - b.testType;
        });
    }


    // Get Student Test Details
    getStudentTestDetails(): void {

        this.vm.isLoading = true;
        this.vm.isUpdated = false;
        //Prepare the testTypeListInCurrentTest
        let testTypeListInCurrentTest :any = [];
        this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.testDetails.forEach(test => {

            if (testTypeListInCurrentTest.findIndex(tempTestType => tempTestType === test.testType) === -1) {
                testTypeListInCurrentTest.push(test.testType);
            }

        });
        let request_student_test_data = {
            'parentStudent__in': this.getStudentIdListForSelectedItems(),
            'parentSubject': this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.id,
            'parentExamination': this.vm.selectedExamination.id,

        };

        this.vm.examinationService.getObjectList(this.vm.examinationService.student_test, request_student_test_data).then(value2 => {
            this.populateStudentList(value2,testTypeListInCurrentTest);
            this.vm.showTestDetails = true;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })

    }

    getStudentIdListForSelectedItems(): any {
        let id_list = [];
        this.student_mini_profile_list.forEach(item => {
            if (item.classDbId === this.vm.selectedExamination.selectedClass.id
                && item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id) {
                id_list.push(item.dbId);
            }
        });
        return id_list;
    }

    populateStudentList(student_test_list: any,testTypeListInCurrentTest :any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject['studentList'] = [];
        this.student_mini_profile_list.filter(item => {
            if (item.classDbId === this.vm.selectedExamination.selectedClass.id
                && item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id) {
                return true;
            }
            return false;
        }).sort((a,b) => {
            if (a.rollNumber && b.rollNumber) {
                return (a.rollNumber.toString() < b.rollNumber.toString())? -1:1;
            }
            return (b.rollNumber)? -1:1;
        }).forEach(item => {
            let tempItem = {};
            tempItem = this.copyObject(item);
            tempItem['testDetails'] = this.getStudentTestList(tempItem, student_test_list,testTypeListInCurrentTest);
            this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject['studentList'].push(tempItem);
        });
    }

    getStudentTestList(student: any, student_test_list: any,testTypeListInCurrentTest :any): any {
        let result = [];
        testTypeListInCurrentTest.forEach(testType => {
            var studentPresent = false;
            student_test_list.forEach(item => {
                if (item.parentStudent === student.dbId && item.testType === testType) {
                    studentPresent = true;
                    if (item.marksObtained == 0.0) {
                        item.marksObtained = null;
                        item.newMarksObtained = null;
                    }
                    else {
                        var mark = item.marksObtained
                        item['newMarksObtained'] = mark;
                    }

                    result.push(item);
                }

            });
            if (!studentPresent) {
                result.push({
                    id: null,
                    parentStudent: student.dbId,
                    parentSubject: this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.id,
                    parentExamination: this.vm.selectedExamination.id,
                    marksObtained: 0.0,
                    newMarksObtained: 0.0,
                    testType: testType
                })

            }
        });
        return result.sort((a, b) => {
            if (a.testType === null) {
                return 0;
            } else if (b.testType === null) {
                return 1;
            }
            return a.testType - b.testType;
        });
    }


    // Update Student Test Details
    updateStudentTestDetails(): void {

        this.vm.isLoading = true;
        let data = [];

        this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.studentList.forEach(item => {
            item.testDetails.forEach(itemTwo => {
                if (itemTwo.marksObtained == null) {
                    itemTwo.marksObtained = 0.0;
                } else {
                    itemTwo.marksObtained = parseFloat(itemTwo.marksObtained.toString()).toFixed(1);
                }
                if (itemTwo.newMarksObtained != itemTwo.marksObtained)
                data.push(itemTwo);
            });
        });



        let toBeUpdated = [];
        let toBeCreated = [];
        data.forEach(item => {
            item.marksObtained = item.newMarksObtained;
            if (item.id != null) toBeUpdated.push(item);
            else toBeCreated.push(item);
        });

        Promise.all([
            this.vm.examinationService.updateObjectList(this.vm.examinationService.student_test, toBeUpdated),
            this.vm.examinationService.createObjectList(this.vm.examinationService.student_test, toBeCreated)
        ]).then(value => {
            if(value[0]!=null)
            value[0].forEach(test => {
                this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.studentList.forEach(student => {
                    student.testDetails.forEach(studentTest => {
                        if(test.id === studentTest.id)
                        {       
                            if (test.marksObtained == 0.0) {
                                studentTest.newMarksObtained = null;
                            }
                            else {
                                studentTest.newMarksObtained = parseFloat(test.marksObtained.toString()).toFixed(1);
                            } 
                        }
                    });
                    
                })
            });
            if(value[1]!=null)
            value[1].forEach(test => {
                this.vm.selectedExamination.selectedClass.selectedSection.selectedSubject.studentList.forEach(student => {
                    student.testDetails.forEach(studentTest => {
                        if(test.id === studentTest.id)
                        {       
                            if (test.marksObtained == 0.0) {
                                studentTest.newMarksObtained = null;
                            }
                            else {
                                studentTest.newMarksObtained = parseFloat(test.marksObtained.toString()).toFixed(1);
                            } 
                        }
                    });
                    
                })
            });
            this.vm.isUpdated = false;
            this.vm.isLoading = false;

        }, error => {
            this.vm.isLoading = false;
        });

    }

}
