
import {UpdateCceMarksComponent} from './update-cce-marks.component';

import { TEST_TYPE_LIST } from '../../../../../classes/constants/test-type';

export class UpdateCceMarksServiceAdapter {

    vm: UpdateCceMarksComponent;

    constructor() {}

    // Data
    classList: any;
    sectionList: any;

    student_mini_profile_list: any;

    cce_marks_list: any;


    initializeAdapter(vm: UpdateCceMarksComponent): void {
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
        this.vm.isLoading = true;

        let request_student_mini_profile_data = {
            'schoolDbId': this.vm.user.activeSchool.dbId,
            'sessionDbId': this.vm.user.activeSchool.currentSessionDbId,
        };

        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs,{}),
            this.vm.classService.getObjectList(this.vm.classService.division,{}),
            this.vm.studentService.getStudentMiniProfileList(request_student_mini_profile_data, this.vm.user.jwt),
        ]).then(value => {

            this.classList = value[0];
            this.sectionList = value[1];
            this.student_mini_profile_list = value[2].filter(student => {
                return student.parentTransferCertificate == null;
            });

            let request_cce_marks_data = {
                'studentList': this.getStudentIdList(),
                'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            };

            this.vm.examinationOldService.getCCEMarksList(request_cce_marks_data, this.vm.user.jwt).then(valueTwo => {

                this.cce_marks_list = valueTwo;
                this.populateClassStudentCCEMarksList();

                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            });

        }, error => {
            this.vm.isLoading = false;
        });

    }

    getStudentIdList(): any {
        let id_list = [];
        this.student_mini_profile_list.filter(student => {
            return student.className == 'Class - 9' || student.className == 'Class - 11';
        }).forEach(student => {
                id_list.push(student.dbId);
        });
        if (id_list.length === 0) {
            id_list.push(0);
        }
        return id_list;
    }

    populateClassStudentCCEMarksList(): void {
        this.vm.classStudentCCEMarksList = [];
        let filteredStudentList = this.student_mini_profile_list.filter(student => {
            return student.className == 'Class - 9' || student.className == 'Class - 11';
        });
        this.classList.filter(classs => {
            return classs.name == 'Class - 9' || classs.name == 'Class - 11';
        }).forEach(classs => {
            let tempClass = this.copyObject(classs);
            tempClass['sectionList'] = [];
            this.sectionList.forEach(section => {
                let tempSection = this.copyObject(section);
                tempSection['studentList'] = [];
                filteredStudentList.filter(student => {
                    return student.className == tempClass.name && student.sectionName == tempSection.name;
                }).forEach(student => {
                    let tempStudent = this.copyObject(student);
                    tempStudent['cceMarksObject'] = this.getCCEMarksObject(student);
                    tempSection['studentList'].push(tempStudent);
                });
                if (tempSection['studentList'].length > 0) {
                    tempClass['sectionList'].push(tempSection);
                }
            });
            if (tempClass['sectionList'].length > 0) {
                tempClass['selectedSection'] = tempClass['sectionList'][0];
                this.vm.classStudentCCEMarksList.push(tempClass);
            }
        });
        this.vm.selectedClass = this.vm.classStudentCCEMarksList[0];
    }

    getCCEMarksObject(student: any): any {
        let result = {
            'id': 0,
            'parentStudent': student.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'marksObtained': null,
        };
        this.cce_marks_list.filter(item => {
            return item.parentStudent == student.dbId;
        }).forEach(item => {
            if (item.marksObtained == 0.0) {
                item.marksObtained = null;
            }
            result = item;
        });
        return result;
    }


    // Update Student Test Details
    updateCCEMarks(): void {

        let data_to_add = this.getDataToAdd();
        let data_to_update = this.getDataToUpdate();

        this.vm.isLoading = true;

        let serviceList = [];

        if (data_to_add.length > 0) {
            serviceList.push(this.vm.examinationOldService.createCCEMarksList(data_to_add, this.vm.user.jwt));
        }

        if (data_to_update.length > 0) {
            serviceList.push(this.vm.examinationOldService.updateCCEMarksList(data_to_update, this.vm.user.jwt));
        }

        Promise.all(serviceList).then(value => {

            if (data_to_add.length > 0 && data_to_update.length > 0) {
                value[1].forEach(item => {
                    this.cce_marks_list.every(cce_marks => {
                        if (cce_marks.id == item.id) {
                            cce_marks.marksObtained = item.marksObtained;
                            return false;
                        }
                        return true;
                    });
                });
                this.cce_marks_list = this.cce_marks_list.concat(value[0]);
            } else if (data_to_add.length > 0) {
                this.cce_marks_list = this.cce_marks_list.concat(value[0]);
            } else {
                value[0].forEach(item => {
                    this.cce_marks_list.every(cce_marks => {
                        if (cce_marks.id == item.id) {
                            cce_marks.marksObtained = item.marksObtained;
                            return false;
                        }
                        return true;
                    });
                });
            }

            this.vm.selectedClass.selectedSection.studentList.forEach(student => {
                student['cceMarksObject'] = this.getCCEMarksObject(student);
            });
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    getDataToAdd(): any {
        let data = [];
        this.vm.selectedClass.selectedSection.studentList.filter(student => {
            return student.cceMarksObject.id == 0;
        }).forEach(student => {
            if (student.cceMarksObject.marksObtained == null) {
                student.cceMarksObject.marksObtained = 0.0;
            } else {
                student.cceMarksObject.marksObtained = parseFloat(student.cceMarksObject.marksObtained.toString()).toFixed(1);
            }
            data.push(student.cceMarksObject);
        });
        return data;
    }

    getDataToUpdate(): any {
        let data = [];
        this.vm.selectedClass.selectedSection.studentList.filter(student => {
            return student.cceMarksObject.id != 0;
        }).forEach(student => {
            if (student.cceMarksObject.marksObtained == null) {
                student.cceMarksObject.marksObtained = 0.0;
            } else {
                student.cceMarksObject.marksObtained = parseFloat(student.cceMarksObject.marksObtained.toString()).toFixed(1);
            }
            data.push(student.cceMarksObject);
        });
        return data;
    }

}