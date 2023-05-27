import { AddStudentComponent } from './add-student.component';
import { CommonFunctions } from '@modules/common/common-functions';

export class AddStudentServiceAdapter {
    vm: AddStudentComponent;

    constructor() { }

    initializeAdapter(vm: AddStudentComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let schoolId = this.vm.user.activeSchool.dbId;
        let sessionId = this.vm.user.activeSchool.currentSessionDbId;

        let bus_stop_list = {
            parentSchool: schoolId,
        };

        let bus_stop_query_parameters = {
            filter: {
                parentSchool: schoolId,
            },
            order_by: [
                'kmDistance'
            ]
        };

        let student_parameter_query_parameters = {
            filter: {
                parentSchool: this.vm.user.activeSchool.dbId
            }
        };

        Promise.all([
            this.vm.genericService.getObjectList({class_app: "Class"}, {}), // 0
            this.vm.genericService.getObjectList({class_app: "Division"}, {}), // 1
            this.vm.genericService.getObjectList({school_app: "BusStop"}, bus_stop_query_parameters), // 2
            this.vm.genericService.getObjectList({school_app: "Session"}, {}), // 3
            this.vm.genericService.getObjectList({student_app: "StudentParameter"}, student_parameter_query_parameters) // 4
        ]).then(
            (value) => {
                this.vm.classList = value[0];
                this.vm.sectionList = value[1];
                this.vm.busStopList = value[2];
                this.vm.sessionList = value[3];
                this.vm.studentParameterList = value[4].map((x) => ({ ...x, filterValues: JSON.parse(x.filterValues) }));

                this.vm.initializeVariable();

                if (this.vm.studentParameterList) {
                    for (let i = 0; i < this.vm.studentParameterList.length; i++) {
                        if (this.vm.studentParameterList[i].parameterType == "DOCUMENT") {
                            this.vm.showToolTip.push(false);
                            this.vm.height.push(120);
                        }
                    }
                }
                this.vm.isLoading = false;
            },
            (error) => {
                this.vm.isLoading = false;
            }
        );
    }

    getBankDetails() {
        if (this.vm.newStudent.bankIfscCode.length < 11) {
            return;
        }
        this.vm.bankService.getDetailsFromIFSCCode(this.vm.newStudent.bankIfscCode.toString()).then((value) => {
            this.vm.newStudent.bankName = value;
        });
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

    createNewStudent(): void {
        if (this.vm.newStudent.name == null || this.vm.newStudent.name == '') {
            alert('Name should be populated');
            return;
        }

        if (this.vm.newStudent.fathersName == null || this.vm.newStudent.fathersName == '') {
            alert("Father's name should be populated");
            return;
        }

        if (this.vm.newStudent.mobileNumber != null && this.vm.newStudent.mobileNumber.toString().length != 10) {
            alert('Mobile number should be 10 digits');
            return;
        }

        if (this.vm.newStudent.secondMobileNumber != null && this.vm.newStudent.secondMobileNumber.toString().length != 10) {
            alert('Mobile number should be 10 digits');
            return;
        }

        if (this.vm.newStudent.childSSMID != null && this.vm.newStudent.childSSMID.toString().length != 9) {
            alert('Child SSMID should be 9 digits');
            return;
        }

        if (this.vm.newStudent.familySSMID != null && this.vm.newStudent.familySSMID.toString().length != 8) {
            alert('Family SSMID should be 8 digits');
            return;
        }

        if (this.vm.newStudent.aadharNum != null && this.vm.newStudent.aadharNum.toString().length != 12) {
            alert('Aadhar No. should be 12 digits');
            return;
        }

        this.vm.isLoading = true;

        if (this.vm.newStudent.dateOfBirth == '') {
            this.vm.newStudent.dateOfBirth = null;
        }

        if (this.vm.newStudent.dateOfAdmission == '') {
            this.vm.newStudent.dateOfAdmission = null;
        }

        const student_form_data = new FormData();
        const data = { ...this.vm.newStudent };
        Object.keys(data).forEach((key) => {
            if (key === 'profileImage') {
                if (this.vm.profileImage) {
                    student_form_data.append(key, this.dataURLtoFile(this.vm.profileImage, 'profileImage.jpeg'));
                }
            } else {
                if (data[key] !== null) {
                    student_form_data.append(key, data[key]);
                }
            }
        });

        let parentEmployee = this.vm.user.activeSchool.employeeId;
        let moduleName = this.vm.user.section.title;
        let taskName = this.vm.user.section.subTitle;
        let moduleList = this.vm.user.activeSchool.moduleList;
        let actionString = " admitted " + this.vm.newStudent.name;

        this.vm.studentService.createObject(this.vm.studentService.student, student_form_data).then(
            (value) => {
                this.vm.newStudentSection.parentStudent = value.id;
                this.vm.isLoading = true;

                this.vm.currentStudentParameterValueList = this.vm.currentStudentParameterValueList.filter((x) => {
                    return x.value !== this.vm.nullValue;
                });
                this.vm.currentStudentParameterValueList.forEach((x) => {
                    x.parentStudent = value.id;
                });

                let form_data_list = [];
                this.vm.studentParameterList.forEach((parameter) => {
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
                            }
                        });
                        form_data_list.push(form_data);
                    }
                });
                Promise.all(
                    form_data_list.map((x) =>
                        this.vm.studentService.createObject(this.vm.studentService.student_parameter_value, x)
                    )
                ).then(
                    async (valueTwo) => {
                        await this.vm.studentService.createObject(this.vm.studentService.student_section, this.vm.newStudentSection);
                        alert('Student admitted successfully');

                        this.vm.initializeVariable();

                        CommonFunctions.createRecord(parentEmployee, moduleName, taskName, moduleList, actionString);
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
}
