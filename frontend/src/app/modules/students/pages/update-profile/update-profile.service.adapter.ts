import { UpdateProfileComponent } from './update-profile.component';
import { toInteger } from 'lodash';
import { CommonFunctions } from '@modules/common/common-functions';
import { Query } from '@services/generic/query';

export class UpdateProfileServiceAdapter {
    vm: UpdateProfileComponent;

    constructor() { }

    initializeAdapter(vm: UpdateProfileComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        this.vm.isLoading = true;
        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {
                parentSchool: this.vm.user.activeSchool.dbId,
            }),

            this.vm.schoolService.getObjectList(this.vm.schoolService.bus_stop, {
                parentSchool: this.vm.user.activeSchool.dbId,
            }),

            new Query().getObjectList({school_app: 'Session'}),
        ]).then(
            (value) => {
                this.vm.studentParameterList = value[0].map((x) => ({ ...x, filterValues: JSON.parse(x.filterValues) }));
                // this.vm.studentParameterValueList = value[1];
                this.vm.busStopList = value[1];
                this.vm.sessionList = value[2];
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    dataURLtoFile(dataurl, filename) {
        try {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);

            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }

            return new File([u8arr], filename, { type: mime });
        } catch (e) {
            return null;
        }
    }

    updateProfile(): void {
        if (this.vm.currentStudent.currentBusStop == 0) {
            this.vm.currentStudent.currentBusStop = null;
        }
        if (this.vm.currentStudent.admissionSession == 0) {
            this.vm.currentStudent.admissionSession = null;
        }
        if (
            this.vm.currentStudent.familySSMID &&
            this.vm.currentStudent.familySSMID.toString().length !== 0 &&
            this.vm.currentStudent.familySSMID.toString().length !== 8
        ) {
            alert('Number of digits in Family SSMID should be 8');
            return;
        }

        if (
            this.vm.currentStudent.mobileNumber &&
            this.vm.currentStudent.mobileNumber.toString().length !== 0 &&
            this.vm.currentStudent.mobileNumber.toString().length !== 10
        ) {
            alert('mobile number should be of 10 digits!');
            return;
        }
        if (
            this.vm.currentStudent.secondMobileNumber &&
            this.vm.currentStudent.secondMobileNumber.toString().length !== 0 &&
            this.vm.currentStudent.secondMobileNumber.toString().length !== 10
        ) {
            alert('alternate mobile number should be of l0 digits!');
            return;
        }

        if (
            this.vm.currentStudent.childSSMID &&
            this.vm.currentStudent.childSSMID.toString().length !== 0 &&
            this.vm.currentStudent.childSSMID.toString().length !== 9
        ) {
            alert('Number of digits in Child SSMID should be 9');
            return;
        }
        if (
            this.vm.currentStudent.aadharNum &&
            this.vm.currentStudent.aadharNum.toString().length !== 0 &&
            this.vm.currentStudent.aadharNum.toString().length !== 12
        ) {
            alert('Number of digits in Aadhar No. should be 12');
            return;
        }

        this.vm.isLoading = true;
        let service_list = [];

        const student_form_data = new FormData();
        const data = { ...this.vm.currentStudent, content: JSON.stringify(this.vm.currentStudent.content) };
        console.log(data);
        Object.keys(data).forEach((key) => {
            if (key === 'profileImage') {
                if (this.vm.profileImage !== null) {
                    student_form_data.append(key, this.dataURLtoFile(this.vm.profileImage, 'profileImage.jpeg'));
                }
            } else {
                if (data[key] == this.vm.NULL_CONSTANT) {
                    student_form_data.append(key, '');
                } else {
                    student_form_data.append(key, data[key]);
                }
            }
        });

        service_list.push(this.vm.studentService.updateObject(this.vm.studentService.student, student_form_data));

        if (
            this.vm.selectedStudentSection.rollNumber != this.vm.currentStudentSection.rollNumber &&
            this.vm.currentStudent.id == this.vm.currentStudentSection.parentStudent
        ) {
            service_list.push(this.vm.studentService.updateObject(this.vm.studentService.student_section, this.vm.currentStudentSection));
        } else {
            service_list.push(Promise.resolve(null));
        }

        let generateList = [];
        let updateList = [];
        this.vm.currentStudentParameterValueList.forEach((x) => {
            x.parentStudent = this.vm.selectedStudent.id;
        });
        this.vm.studentParameterList.forEach((parameter) => {
            if (this.vm.htmlRenderer.checkCustomFieldChanged(parameter)) {
                let temp_obj = this.vm.currentStudentParameterValueList.find((x) => x.parentStudentParameter === parameter.id);
                if (temp_obj) {
                    const data = { ...temp_obj };
                    const form_data = new FormData();
                    Object.keys(data).forEach((key) => {
                        if (data[key]) {
                            if (key == 'document_name' || key == 'document_size') {
                            } else if (key == 'document_value') {
                                form_data.append(key, this.dataURLtoFile(data[key], data['document_name']));
                                form_data.append('document_size', data['document_size']);
                            } else {
                                form_data.append(key, data[key]);
                            }
                        } else {
                            form_data.append(key, '');
                        }
                    });
                    if (temp_obj.id) {
                        updateList.push(form_data);
                    } else if (!temp_obj.id) {
                        generateList.push(form_data);
                    }
                }
            }
        });

        if (generateList.length) {
            generateList.forEach((x) => {
                service_list.push(this.vm.studentService.createObject(this.vm.studentService.student_parameter_value, x));
            });
        }

        if (updateList.length) {
            updateList.forEach((x) => {
                service_list.push(this.vm.studentService.updateObject(this.vm.studentService.student_parameter_value, x));
            });
        }

        if (this.vm.deleteList.length) {
            this.vm.deleteList.forEach((x) => {
                service_list.push(this.vm.studentService.deleteObject(this.vm.studentService.student_parameter_value, { id: x.id }));
            });
        }

        Promise.all(service_list).then(
            (value) => {
                Object.keys(value[0]).forEach((key) => {
                    this.vm.selectedStudent[key] = value[0][key];
                });
                this.vm.currentStudent = this.vm.commonFunctions.copyObject(this.vm.selectedStudent);
                if (
                    this.vm.selectedStudentSection.rollNumber != this.vm.currentStudentSection.rollNumber &&
                    this.vm.currentStudent.id == this.vm.currentStudentSection.parentStudent
                ) {
                    Object.keys(value[1]).forEach((key) => {
                        this.vm.selectedStudentSection[key] = value[1][key];
                    });
                    this.vm.currentStudentSection = this.vm.commonFunctions.copyObject(this.vm.selectedStudentSection);
                }
                if (generateList.length) {
                    value.slice(2, 2 + generateList.length).forEach((item) => {
                        this.vm.studentParameterValueList.push(item);
                    });
                }

                if (updateList.length) {
                    value.slice(2 + generateList.length, 2 + generateList.length + updateList.length).forEach((item) => {
                        this.vm.studentParameterValueList = this.vm.studentParameterValueList.filter((x) => x.id !== item.id);
                        this.vm.studentParameterValueList.push(item);
                    });
                }

                if (this.vm.deleteList.length) {
                    value
                        .slice(
                            2 + generateList.length + updateList.length,
                            2 + generateList.length + updateList.length + this.vm.deleteList.length
                        )
                        .forEach((item) => {
                            this.vm.studentParameterValueList = this.vm.studentParameterValueList.filter((x) => x.id !== toInteger(item));
                        });
                }

                this.vm.currentStudentParameterValueList = [];
                this.vm.studentParameterValueList
                    .filter((x) => x.parentStudent === this.vm.currentStudent.id)
                    .forEach((item) => {
                        this.vm.currentStudentParameterValueList.push(this.vm.commonFunctions.copyObject(item));
                    });

                this.vm.deleteList = [];
                this.vm.profileImage = null;
                alert('Student: ' + this.vm.selectedStudent.name + ' updated successfully');

                let parentEmployee = this.vm.user.activeSchool.employeeId;
                let moduleName = this.vm.user.section.title;
                let taskName = this.vm.user.section.subTitle;
                let moduleList = this.vm.user.activeSchool.moduleList;
                let actionString = " updated student profile of " + this.vm.selectedStudent.name;
                CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.profileImage = null;
                this.vm.isLoading = false;
            }
        );
    }

    getStudentProfile(studentId: any): void {
        this.vm.isLoading = true;
        let service_list = [];
        service_list.push(
            this.vm.studentService.getObject(this.vm.studentService.student, {
                id: studentId,
            })
        );
        service_list.push(
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {
                parentStudent: studentId,
            })
        );
        Promise.all(service_list).then((value) => {
            this.vm.currentStudent = this.vm.commonFunctions.copyObject(value[0]);
            Object.keys(value[0]).forEach((key) => {
                this.vm.selectedStudent[key] = value[0][key];
            });
            this.vm.currentStudentSection = this.vm.commonFunctions.copyObject(this.vm.selectedStudentSection);

            // Copying the student parameter values for reference
            this.vm.studentParameterValueList = value[1];
            this.vm.currentStudentParameterValueList = [];
            this.vm.studentParameterValueList
                .filter((x) => x.parentStudent === studentId)
                .forEach((item) => {
                    if (item.document_value) {
                        let document_name = item.document_value.split('/');
                        document_name = document_name[document_name.length - 1];
                        item.document_name = document_name;
                    }
                });

            this.vm.studentParameterValueList
                .filter((x) => x.parentStudent === studentId)
                .forEach((item) => {
                    this.vm.currentStudentParameterValueList.push(this.vm.commonFunctions.copyObject(item));
                });
            this.vm.isLoading = false;
        });
    }
}
