import { SchoolFeeRule } from 'app/services/modules/fees/models/school-fee-rule';
import { UpdateViaExcelComponent } from './update-via-excel.component';

export class UpdateViaExcelServiceAdapter {
    vm: UpdateViaExcelComponent;

    constructor() { }

    initializeAdapter(vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        this.vm.isLoading = true;

        const student_section_data = {
            parentStudent__parentTransferCertificate: 'null__korangle',
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
        };

        const request_fee_type_data = {
            parentSchool: this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.feeService.getObjectList(this.vm.feeService.fee_type, request_fee_type_data),
        ]).then(
            (value) => {
                this.vm.classList = value[1];
                this.vm.divisionList = value[2];
                this.prepareFeeType(value[3]);

                //structuring for student's class and division
                this.structuringForStudents(value[1], value[2]);

                let student_data = {
                    id__in: value[0].map((ss) => ss.parentStudent),
                    fields__korangle: 'id,name,fathersName,scholarNumber',
                };

                let student_fee_data = {
                    parentStudent__in: value[0].map((s) => s.parentStudent),
                    parentSession: this.vm.user.activeSchool.currentSessionDbId,
                };

                Promise.all([
                    this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
                    this.vm.feeService.getObjectList(this.vm.feeService.student_fees, student_fee_data),
                ]).then((value2) => {
                    value[0].forEach((ss) => {
                        ss['student'] = value2[0].find((student) => student.id === ss.parentStudent); // storing student data inside student session data
                    });
                    this.vm.studentSectionList = value[0];

                    //Populate Students
                    this.populateStudents(value[0]);

                    //storing fee of students
                    this.populateStructuredStudentsFee(value2[1]);

                    this.vm.isLoading = false;
                });
            },
            (error) => {
                console.log(error);
                this.vm.isLoading = false;
            }
        );
    }

    prepareFeeType(feeTypeList: any): void {
        this.vm.feeTypeList = feeTypeList.sort((a, b) => a.orderNumber - b.orderNumber);
        feeTypeList
            .sort((a, b) => a.orderNumber - b.orderNumber)
            .forEach((feeType, index) => {
                feeTypeList[index].checked = false;
                this.vm.feeTypeIdMappedByFeeTypeName[feeType.name] = feeType.id;
            });
    }

    structuringForStudents(classList: any, divisionList: any): void {
        // structure: {classsid: {divisionId: [student1,...], ...}, ...}
        let classIds = classList.map((c) => c.id);
        let divisionIds = divisionList.map((d) => d.id);

        classIds.forEach((classId) => {
            this.vm.studentListMappedByClassIdDivisionId[classId] = {};
            this.vm.classDivisionSelectionMappedByClassIdDivisionId[classId] = {};
            divisionIds.forEach((divisionId) => {
                this.vm.studentListMappedByClassIdDivisionId[classId][divisionId] = []; // students will be filled while populating
                this.vm.classDivisionSelectionMappedByClassIdDivisionId[classId][divisionId] = false; // default selection false
            });
        });
    }

    populateStudents(studentSectionList: any): void {
        studentSectionList.forEach((studentSelection) => {
            let ClassId, DivisionId;
            ClassId = studentSelection.parentClass;
            DivisionId = studentSelection.parentDivision;
            this.vm.studentListMappedByClassIdDivisionId[ClassId][DivisionId].push(studentSelection);
        });
        this.vm.studentsCount = studentSectionList.length;

        // Removing empty divisions
        this.vm.classList.forEach((Class) => {
            this.vm.divisionList.forEach((Division) => {
                if (this.vm.studentListMappedByClassIdDivisionId[Class.id][Division.id].length === 0) {
                    delete this.vm.studentListMappedByClassIdDivisionId[Class.id][Division.id];
                    delete this.vm.classDivisionSelectionMappedByClassIdDivisionId[Class.id][Division.id];
                }
            });
        });
    }

    populateStructuredStudentsFee(studentFeeList: any): void {
        studentFeeList.forEach((studentFee) => {
            if (!this.vm.studentFeeListMappedByStudentIdFeeTypeId[studentFee.parentStudent]) {
                this.vm.studentFeeListMappedByStudentIdFeeTypeId[studentFee.parentStudent] = {};
            }
            this.vm.studentFeeListMappedByStudentIdFeeTypeId[studentFee.parentStudent][studentFee.parentFeeType] = studentFee;
        });
    }

    uploadStudentFeeData() {
        this.vm.isLoading = true;

        let request_school_fee_rule_data = {
            parentFeeType__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            korangle__fields: 'id,parentFeeType,ruleNumber',
        };

        // Getting already existing School Fee Rules from backend, for rule number.
        this.vm.feeService.getObjectList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data).then(
            (schoolFeeRuleListBackend) => {
                // Preparing student fee & school fee rules for uploading
                let studentFeeListToBeUploaded = [];
                let schoolFeeRuleListToBeUploaded = [];
                //create list of usefulFeeTypes in the form (feeName-month, index)
                let excelFeeColumnList = this.vm.usefulFeeTypeExcelColumnIndexList.map((value) => [this.vm.excelDataFromUser[0][value], value]);

                //Start traversing uploaded data rows
                this.vm.excelDataFromUser.slice(1).forEach((uploadedRow, rowIndex) => {
                    let student_id = uploadedRow[0];
                    excelFeeColumnList.forEach((feeColumn) => {
                        let feeTypeId = this.vm.feeTypeIdMappedByFeeTypeName[feeColumn[0].split("-")[0]];

                        //checking if student_id, feeTypeId, Installment type is not present, because if it is present we dont have to upload it
                        if (
                            !(
                                this.vm.studentFeeListMappedByStudentIdFeeTypeId[student_id] &&
                                this.vm.studentFeeListMappedByStudentIdFeeTypeId[student_id][feeTypeId] &&
                                this.vm.studentFeeListMappedByStudentIdFeeTypeId[student_id][feeTypeId][feeColumn[0].split("-")[1] + "Amount"]
                            ) &&
                            this.vm.excelDataFromUser[rowIndex + 1][feeColumn[1]] != 0 //checking if fee amount is not empty
                        ) {
                            let studentFee;

                            //Start checking if feeType for a particular student has already been added to studentFeeListToBeUploaded 
                            studentFee = studentFeeListToBeUploaded.find(e => e.parentStudent == student_id && e.parentFeeType == feeTypeId);
                            if (studentFee) {
                                //add installment to feeType that has already been added to studentFeeListToBeUploaded
                                studentFee[feeColumn[0].split("-")[1] + "Amount"] = this.vm.excelDataFromUser[rowIndex + 1][feeColumn[1]];
                                return;
                            }
                            else {
                                studentFee = {};
                            }
                            //End checking if feeType for a particular student has already been added to studentFeeListToBeUploaded 

                            //Create studentFee
                            studentFee['parentStudent'] = student_id;
                            studentFee['parentSchoolFeeRule'] = null; // We will populate this after we have created the school fee rule in backend.
                            studentFee['parentFeeType'] = feeTypeId;
                            studentFee['parentSession'] = this.vm.user.activeSchool.currentSessionDbId;
                            studentFee['isAnnually'] = false;
                            studentFee[feeColumn[0].split("-")[1] + "Amount"] = this.vm.excelDataFromUser[rowIndex + 1][feeColumn[1]];
                            studentFeeListToBeUploaded.push(studentFee);
                            if (
                                schoolFeeRuleListToBeUploaded.find((schoolFeeRule) => {
                                    return schoolFeeRule.parentFeeType === feeTypeId;
                                }) === undefined
                            ) {
                                // Calculating rule number
                                let schoolFeeRuleListBackendFilteredByFeeTypeId = schoolFeeRuleListBackend.filter(
                                    (item) => item.parentFeeType == feeTypeId
                                );
                                
                                //create SchoolFeeRule
                                let newSchoolFeeRule = new SchoolFeeRule();
                                newSchoolFeeRule.parentSession = this.vm.user.activeSchool.currentSessionDbId;
                                // If there's a student added through add student page, it will see that whether there's a school fee rule
                                // that is valid for this student and then the student will get attached to that rule
                                // now to stop current rule to be attached like that I have made isClassFilter = true but I am not adding any class as per se
                                // So, this fee rule will not be applicable for any added student.
                                newSchoolFeeRule.isClassFilter = true;
                                newSchoolFeeRule.isBusStopFilter = false;
                                newSchoolFeeRule.onlyNewAdmission = false;
                                newSchoolFeeRule.includeRTE = false;
                                newSchoolFeeRule.isAnnually = false;

                                newSchoolFeeRule.name = 'Excel Sheet - ' + new Date();
                                newSchoolFeeRule.parentFeeType = feeTypeId;
                                newSchoolFeeRule.ruleNumber =
                                    schoolFeeRuleListBackendFilteredByFeeTypeId.length > 0
                                        ? Math.max.apply(
                                            Math,
                                            schoolFeeRuleListBackendFilteredByFeeTypeId.map((item) => item.ruleNumber)
                                        ) + 1
                                        : 1;

                                schoolFeeRuleListToBeUploaded.push(newSchoolFeeRule);
                            }
                        }
                    });
                });
                //End traversing uploaded data rows

                if (schoolFeeRuleListToBeUploaded.length > 0) {
                    // Creating School Fee Rules
                    this.vm.feeService.createObjectList(this.vm.feeService.school_fee_rules, schoolFeeRuleListToBeUploaded).then(
                        (schoolFeeRuleListCreated) => {
                            studentFeeListToBeUploaded.forEach((studentFee) => {
                                studentFee.parentSchoolFeeRule = schoolFeeRuleListCreated.find(
                                    (schoolFeeRule) => schoolFeeRule.parentFeeType == studentFee.parentFeeType
                                ).id;
                            });

                            // Creating Student Fees
                            this.vm.feeService.createObjectList(this.vm.feeService.student_fees, studentFeeListToBeUploaded).then(
                                (studentFeeListCreated) => {
                                    // this.initializeData();
                                    this.populateStructuredStudentsFee(studentFeeListCreated);
                                    this.vm.clearExcelData();

                                    alert('Data Upload Successful');

                                    this.vm.isUploadable = false;
                                    this.vm.isLoading = false;
                                },
                                (error) => {
                                    this.vm.isUploadable = false;
                                    this.vm.isLoading = false;
                                }
                            ); // this.vm.feeService.createList(this.vm.feeService.student_fees, studentFeeListToBeUploaded).then(studentFeeListCreated => {
                        },
                        (error) => {
                            this.vm.isUploadable = false;
                            this.vm.isLoading = false;
                        }
                    ); // this.vm.feeService.createList(this.vm.feeService.school_fee_rules, schoolFeeRuleListToBeUploaded).then(schoolFeeRuleListCreated => {
                } else {
                    alert('No Fee Data To Upload');
                    this.vm.clearExcelData();
                    this.vm.isUploadable = false;
                    this.vm.isLoading = false;
                }
            },
            (error) => {
                this.vm.isUploadable = false;
                this.vm.isLoading = false;
            }
        );
    }
}
