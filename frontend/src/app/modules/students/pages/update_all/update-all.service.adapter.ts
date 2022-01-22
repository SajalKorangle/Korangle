import { UpdateAllComponent } from './update-all.component';
import { CommonFunctions } from '@classes/common-functions';
import { CommonFunctions as CommonFunctionsRecordActivity } from '@modules/common/common-functions';

export class UpdateAllServiceAdapter {
    vm: UpdateAllComponent;

    constructor() {}

    initializeAdapter(vm: UpdateAllComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        const student_full_profile_request_data = {
            schoolDbId: this.vm.user.activeSchool.dbId,
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };
        const class_section_request_data = {
            sessionDbId: this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isLoading = true;
        Promise.all([
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.studentOldService.getStudentFullProfileList(student_full_profile_request_data, this.vm.user.jwt),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter, {
                parentSchool: this.vm.user.activeSchool.dbId,
            }),
            this.vm.studentService.getObjectList(this.vm.studentService.student_parameter_value, {
                parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            }),
        ]).then(
            (value) => {
                this.vm.isLoading = false;
                this.vm.classList = value[0];
                value[0].forEach((classs) => {
                    classs.sectionList = [];
                    value[1].forEach((section) => {
                        classs.sectionList.push(CommonFunctions.getInstance().copyObject(section));
                    });
                });
                this.vm.initializeClassSectionList(value[0]);
                this.vm.initializeStudentFullProfileList(value[2]);
                this.vm.studentParameterList = value[3].map((x) => ({ ...x, filterValues: JSON.parse(x.filterValues) }));
                this.vm.studentParameterValueList = value[4];
                console.log('student list: ', value[2]);
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    updateStudentField(key: any, student: any, newValue: any, inputType: any): void {
        console.log(key, student, newValue, inputType);
        if (student[key] != newValue) {
            // console.log('Prev Value: ' + student[key] + ', New Value: ' + newValue);
            // console.log('Type of prev: ' + typeof student[key] + ', Type of new: ' + typeof newValue);
            const data = {
                id: student['dbId'],
            };
            if (key == 'category') {
                data['newCategoryField'] = newValue;
            } else if (key == 'mobileNumber') {
                if (newValue.toString().length !== 10 && newValue.toString().length !== 0) {
                    if (student.mobileNumber != null) {
                        alert('Mobile number should be 10 digits!');
                    }
                    (<HTMLInputElement>document.getElementById(student.dbId.toString() + key.toString())).value = student.mobileNumber;
                    return;
                } else {
                    if (newValue.toString().length == 0) {
                        newValue = null;
                    }
                    data['mobileNumber'] = newValue;
                }
            } else if (key == 'secondMobileNumber') {
                if (newValue.toString().length !== 10 && newValue.toString().length !== 0) {
                    if (student.secondMobileNumber != null) {
                        alert('Alternate Mobile number should be 10 digits!');
                    }
                    (<HTMLInputElement>document.getElementById(student.dbId.toString() + key.toString())).value =
                        student.secondMobileNumber;
                    return;
                } else {
                    if (newValue.toString().length == 0) {
                        newValue = null;
                    }
                    data['secondMobileNumber'] = newValue;
                }
            } else if (key == 'familySSMID') {
                if (newValue.toString().length !== 8 && newValue.toString().length !== 0) {
                    if (student.familySSMID != null) {
                        alert('familySSMID should be 8 digits!');
                    }
                    (<HTMLInputElement>document.getElementById(student.dbId.toString() + key.toString())).value = student.familySSMID;
                    return;
                } else {
                    if (newValue.toString().length == 0) {
                        newValue = null;
                    }
                    data['familySSMID'] = newValue;
                }
            } else if (key == 'childSSMID') {
                if (newValue.toString().length !== 9 && newValue.toString().length !== 0) {
                    if (student.childSSMID != null) {
                        alert('childSSMID should be 9 digits!');
                    }
                    (<HTMLInputElement>document.getElementById(student.dbId.toString() + key.toString())).value = student.childSSMID;
                    return;
                } else {
                    if (newValue.toString().length == 0) {
                        newValue = null;
                    }
                    data['childSSMID'] = newValue;
                }
            } else if (key == 'aadharNum') {
                if (newValue.toString().length !== 12 && newValue.toString().length !== 0) {
                    if (student.aadharNum != null) {
                        alert('Aadhar number should be 12 digits!');
                    }
                    (<HTMLInputElement>document.getElementById(student.dbId.toString() + key.toString())).value = student.aadharNum;
                    return;
                } else {
                    if (newValue.toString().length == 0) {
                        newValue = null;
                    }
                    data['aadharNum'] = newValue;
                }
            } else if (key == 'religion') {
                data['newReligionField'] = newValue;
            }
            else if (key == 'dateOfAdmission') {
                if (newValue == '') {
                    newValue = null;
                }
                data[key] = newValue;
            }
            else if (key == 'dateOfBirth') {
                if (newValue == '') {
                    newValue = null;
                }
                data[key] = newValue;
            } else {
                data[key] = newValue;
            }

            document.getElementById(key + student.dbId).classList.add('updatingField');
            if (inputType === 'text' || inputType === 'number' || inputType === 'date') {
                (<HTMLInputElement>document.getElementById(student.dbId + key)).disabled = true;
            } else if (inputType === 'list') {
            }
            this.vm.studentService.partiallyUpdateObject(this.vm.studentService.student, data).then(
                (response) => {
                    if (response != 'Updation failed') {
                        student[key] = newValue;
                        document.getElementById(key + student.dbId).classList.remove('updatingField');
                        if (inputType === 'text' || inputType === 'number' || inputType === 'date') {
                            (<HTMLInputElement>document.getElementById(student.dbId + key)).disabled = false;
                        } else if (inputType === 'list') {
                        }

                        let parentEmployee = this.vm.user.activeSchool.employeeId;
                        let moduleName = this.vm.user.section.title;
                        let taskName = this.vm.user.section.subTitle;
                        let moduleList = this.vm.user.activeSchool.moduleList;
                        let actionString = " updated " + key + " of " + student.name;
                        CommonFunctionsRecordActivity.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);
                    } else {
                        alert('Not able to update ' + key + ' for value: ' + newValue);
                    }
                },
                (error) => {
                    alert('Server Error: Contact Admin');
                }
            );
        }
    }

    updateParameterValue = (student, parameter, value) => {
        let promise = null;

        let student_parameter_value = this.vm.studentParameterValueList.find(
            (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
        );

        if (!student_parameter_value) {
            if (value !== this.vm.NULL_CONSTANT) {
                student_parameter_value = { parentStudentParameter: parameter.id, value: value, parentStudent: student.dbId };
                promise = this.vm.studentService.createObject(this.vm.studentService.student_parameter_value, student_parameter_value);
            } else {
                return;
            }
        } else if (student_parameter_value.value !== value) {
            student_parameter_value.value = value;
            promise = this.vm.studentService.updateObject(this.vm.studentService.student_parameter_value, student_parameter_value);
        } else {
            return;
        }

        document.getElementById(parameter.id + '-' + student.dbId).classList.add('updatingField');
        if (parameter.type === this.vm.parameter_type_list[0]) {
            (<HTMLInputElement>document.getElementById(student.dbId + '-' + parameter.id)).disabled = true;
        }

        promise.then(
            (val) => {
                this.vm.studentParameterValueList = this.vm.studentParameterValueList.filter((x) => x.id !== val.id);
                this.vm.studentParameterValueList.push(val);

                document.getElementById(parameter.id + '-' + student.dbId).classList.remove('updatingField');
                if (parameter.type === this.vm.parameter_type_list[0]) {
                    (<HTMLInputElement>document.getElementById(student.dbId + '-' + parameter.id)).disabled = false;
                }
            },
            (error) => {
                alert('Failed to update value');
            }
        );
    }

    check_document(value): boolean {
        let type = value.type;
        if (type !== 'image/jpeg' && type !== 'image/jpg' && type !== 'image/png' && type != 'application/pdf') {
            alert('Uploaded File should be either in jpg,jpeg,png or in pdf format');
            return false;
        } else {
            if (value.size / 1000000.0 > 5) {
                alert('File size should not exceed 5MB');
                return false;
            } else {
                return true;
            }
        }
    }

    updateParameterDocumentValue = (student, parameter, value) => {
        let promise = null;
        console.log(value.target.files);
        let check = this.check_document(value.target.files[0]);
        if (check == true) {
            let text = document.getElementById(student.dbId + '-' + parameter.id + '-text');
            text.innerHTML = 'Updating...';
            let icon = document.getElementById(student.dbId + '-' + parameter.id + '-icon');
            let student_parameter_document_value = this.vm.studentParameterValueList.find(
                (x) => x.parentStudent === student.dbId && x.parentStudentParameter === parameter.id
            );
            let data = new FormData();
            data.append('parentStudentParameter', parameter.id);
            data.append('parentStudent', student.dbId);
            data.append('document_value', value.target.files[0]);
            data.append('document_size', value.target.files[0].size);
            if (!student_parameter_document_value) {
                promise = this.vm.studentService.createObject(this.vm.studentService.student_parameter_value, data);
            } else {
                data.append('id', student_parameter_document_value.id);
                promise = this.vm.studentService.updateObject(this.vm.studentService.student_parameter_value, data);
            }
            promise.then(
                (val) => {
                    if (val) {
                        this.vm.studentParameterValueList = this.vm.studentParameterValueList.filter((x) => x.id !== val.id);
                        this.vm.studentParameterValueList.push(val);
                        document.getElementById(parameter.id + '-' + student.dbId).classList.remove('updatingField');
                        text.innerHTML = '';
                    } else {
                        text.innerHTML = '';
                    }
                },
                (error) => {
                    alert('Failed to update value');
                    text.innerHTML = '';
                }
            );
        } else {
            document.getElementById(student.dbId + '-' + parameter.id + '-text').innerHTML = '';
        }
    }
}
