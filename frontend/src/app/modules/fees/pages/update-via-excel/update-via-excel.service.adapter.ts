import { SchoolFeeRule} from 'app/services/modules/fees/models/school-fee-rule';
import { UpdateViaExcelComponent } from './update-via-excel.component';

export class UpdateViaExcelServiceAdapter{
    vm: UpdateViaExcelComponent;

    constructor() { }
    
    initializeAdapter (vm: UpdateViaExcelComponent): void {
        this.vm = vm;
    }

    initializeData(): void {
        this.vm.isLoading = true;

        const student_section_data = {
            'parentStudent__parentTransferCertificate': 'null__korangle',
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        const request_fee_type_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs,{}),
            this.vm.classService.getObjectList(this.vm.classService.division, {}),
            this.vm.feeService.getList(this.vm.feeService.fee_type, request_fee_type_data),
        ]).then(value => {
            this.vm.classList = value[1];
            this.vm.divisionList = value[2];
            this.populateFeeType(value[3]);
            
            //structuring for student's class and division
            this.structuringForStudents(value[1], value[2]);

            let student_data = {
                'id__in': value[0].map(ss => ss.parentStudent),
                'fields__korangle': 'id,name,fathersName,scholarNumber',
            };

            let student_fee_data = {
                'parentStudent__in': value[0].map(s=>s.parentStudent),
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            };
            
            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
                this.vm.feeService.getList(this.vm.feeService.student_fees, student_fee_data)
            ]).then(value2 => {
                
                value[0].forEach(ss => {
                    ss['student'] = value2[0].find(student => student.id === ss.parentStudent);   // storing student data inside student session data
                }); 
                this.vm.studentSectionList = value[0];

                //Populate Students
                this.populateStudents(value[0]); 
                
                //storing fee of students
                this.populateStructuredStudentsFeeExist(value2[1]);

                this.vm.isLoading = false;
            
            })
        }, error => {
                console.log(error);
                this.vm.isLoading = false;
        });

    }

    populateFeeType(feeTypeList: any): void{
        this.vm.feeTypeList = feeTypeList.sort((a, b) => a.orderNumber - b.orderNumber);
        feeTypeList.sort((a, b) => a.orderNumber - b.orderNumber).forEach((feeType, index) => {
            this.vm.feeTypeExcelColumnIndexMappedByFeeTypeId[feeType.id] = index + this.vm.NUM_OF_COLUMNS_FOR_STUDENT_INFO;
            this.vm.feeTypeIdMappedByFeeTypeExcelColumnIndex[index + this.vm.NUM_OF_COLUMNS_FOR_STUDENT_INFO] = feeType.id;
        });
    }

    structuringForStudents(classList: any, divisionList: any): void {   // structure: {classsid: {divisionId: [student1,...], ...}, ...}
        let classIds = classList.map(c => c.id);
        let divisionIds = divisionList.map(d => d.id);

        classIds.forEach(classId => {
            this.vm.studentListMappedByClassIdDivisionId[classId] = {};
            this.vm.classDivisionSelectionMappedByClassIdDivisionId[classId] = {};
            divisionIds.forEach(divisionId => {
                this.vm.studentListMappedByClassIdDivisionId[classId][divisionId] = [];    // students will be filled while populating
                this.vm.classDivisionSelectionMappedByClassIdDivisionId[classId][divisionId] = false;   // default selection false
            });
        });
    }

    populateStudents(studentSectionList: any): void {
        studentSectionList.forEach(studentSelection => {
            let ClassId, DivisionId;
            ClassId = studentSelection.parentClass;
            DivisionId = studentSelection.parentDivision;
            this.vm.studentListMappedByClassIdDivisionId[ClassId][DivisionId].push(studentSelection);
        });
        this.vm.studentsCount = studentSectionList.length;

        // Removing empty divisions
        this.vm.classList.forEach(Class => {
            this.vm.divisionList.forEach(Division => {
                if (this.vm.studentListMappedByClassIdDivisionId[Class.id][Division.id].length === 0) {
                    delete this.vm.studentListMappedByClassIdDivisionId[Class.id][Division.id];
                    delete this.vm.classDivisionSelectionMappedByClassIdDivisionId[Class.id][Division.id];
                }
            })
        })
    }

    populateStructuredStudentsFeeExist(studentFeeList: any): void{
        // Delete below after code review
        /*studentFeeList.forEach(studentFee => {
            if (this.vm.studentFeeListMappedByStudent[studentFee.parentStudent]) // for handling the case of multiple fee types
                this.vm.studentFeeListMappedByStudent[studentFee.parentStudent].push(studentFee);
            else
                this.vm.studentFeeListMappedByStudent[studentFee.parentStudent] = [studentFee];
        });*/
        studentFeeList.forEach(studentFee => {
            if (!this.vm.studentFeeListMappedByStudentIdFeeTypeId[studentFee.parentStudent]) {
                this.vm.studentFeeListMappedByStudentIdFeeTypeId[studentFee.parentStudent] = {};
            }
            this.vm.studentFeeListMappedByStudentIdFeeTypeId[studentFee.parentStudent][studentFee.parentFeeType] = studentFee;
        });
    }

    uploadStudentFeeData() {

        this.vm.isLoading = true;

        let request_school_fee_rule_data = {
            'parentFeeType__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'korangle__fields':  'id,parentFeeType,ruleNumber'
        };

        // Getting already existing School Fee Rules from backend, for rule number.
        this.vm.feeService.getObjectList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data).then(schoolFeeRuleListBackend => {

            // Preparing student fee & school fee rules for uploading
            let studentFeeListToBeUploaded = [];
            let schoolFeeRuleListToBeUploaded = [];

            this.vm.excelDataFromUser.slice(1).forEach((uploadedRow, rowIndex) => {
                let student_id = uploadedRow[0];
                this.vm.usefulFeeTypeExcelColumnIndexList.forEach(colIndex => {
                    let feeTypeId = this.vm.feeTypeIdMappedByFeeTypeExcelColumnIndex[colIndex];
                    if ((!this.vm.studentFeeListMappedByStudentIdFeeTypeId[student_id]
                        || !this.vm.studentFeeListMappedByStudentIdFeeTypeId[student_id][feeTypeId])
                        && this.vm.excelDataFromUser[rowIndex+1][colIndex] != 0) {
                        studentFeeListToBeUploaded.push({
                            'parentStudent': student_id,
                            'parentSchoolFeeRule': null, // We will populate this after we have created the school fee rule in backend.
                            'parentFeeType': feeTypeId,
                            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                            'isAnnually': true,
                            'cleared': false,

                            'aprilAmount': this.vm.excelDataFromUser[rowIndex+1][colIndex],
                        });
                        if (schoolFeeRuleListToBeUploaded.find(schoolFeeRule => {
                            return schoolFeeRule.parentFeeType === feeTypeId;
                        }) === undefined) {

                            // Calculating rule number
                            let schoolFeeRuleListBackendFilteredByFeeTypeId = schoolFeeRuleListBackend.filter(item => item.parentFeeType == feeTypeId);

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
                            newSchoolFeeRule.isAnnually = true;

                            newSchoolFeeRule.name = 'Excel Sheet - ' + (new Date());
                            newSchoolFeeRule.parentFeeType = feeTypeId;
                            newSchoolFeeRule.ruleNumber = schoolFeeRuleListBackendFilteredByFeeTypeId.length > 0 ?
                                Math.max.apply(Math, schoolFeeRuleListBackendFilteredByFeeTypeId.map(item => item.ruleNumber)) + 1 :
                                1;

                            schoolFeeRuleListToBeUploaded.push(newSchoolFeeRule);
                        }
                    }
                });
            });

            console.log(studentFeeListToBeUploaded);
            console.log(schoolFeeRuleListToBeUploaded);
            if (schoolFeeRuleListToBeUploaded.length > 0) {

                // Creating School Fee Rules
                this.vm.feeService.createList(this.vm.feeService.school_fee_rules, schoolFeeRuleListToBeUploaded).then(schoolFeeRuleListCreated => {

                    studentFeeListToBeUploaded.forEach(studentFee => {
                        studentFee.parentSchoolFeeRule
                            = schoolFeeRuleListCreated.find(schoolFeeRule => schoolFeeRule.parentFeeType == studentFee.parentFeeType).id;
                    });

                    // Creating Student Fees
                    this.vm.feeService.createList(this.vm.feeService.student_fees, studentFeeListToBeUploaded).then(studentFeeListCreated => {

                        // this.initializeData();
                        this.populateStructuredStudentsFeeExist(studentFeeListCreated);
                        this.vm.clearExcelData();

                        alert('Data Upload Successful');

                        this.vm.isUploadable = false;
                        this.vm.isLoading = false;

                    }, error => {
                        this.vm.isUploadable = false;
                        this.vm.isLoading = false;
                    }); // this.vm.feeService.createList(this.vm.feeService.student_fees, studentFeeListToBeUploaded).then(studentFeeListCreated => {

                }, error => {
                    this.vm.isUploadable = false;
                    this.vm.isLoading = false;
                }); // this.vm.feeService.createList(this.vm.feeService.school_fee_rules, schoolFeeRuleListToBeUploaded).then(schoolFeeRuleListCreated => {
            } else {
                alert('No Fee Data To Upload');
                this.vm.clearExcelData();
                this.vm.isUploadable = false;
                this.vm.isLoading = false;
            }

        }, error => {
            this.vm.isUploadable = false;
            this.vm.isLoading = false;
        }); // this.vm.feeService.getObjectList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data).then(schoolFeeRuleListBackend => {

    }

    // Delete below after code review.
    /*uploadedStudentFeePreProcessing() {

        this.vm.excelDataFromUser.slice(1).forEach((uploadedRow,row) => {
            let [student_id] = uploadedRow;
            if (this.vm.studentFeeListMappedByStudent[student_id]) {
                this.vm.studentFeeListMappedByStudent[student_id].forEach(studentFee => {
                    let feeTypeColumnIndex = this.vm.feeTypeExcelColumnIndexMappedByFeeTypeId[studentFee.parentFeeType];
                    delete this.vm.excelDataFromUser[row+1][feeTypeColumnIndex]; // What are we deleting here?, Why are we deleting the what?
                });
            }
        });

        let request_school_fee_rule_data = {
            'parentFeeType__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        };

        // What do we need to do to upload student fee data.
        // We have already gotten the student fee rules as of now, during initialize data.
        // If there is a student fee that needs to be uploaded for a particular fee type then,
        // we would have to create school fee rule no matter what with the excel file name, date & time,
        // so that a particular file data can be deleted.
        return this.vm.feeService.getList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data).then(value => {
            // There can be more than one school fee rules for a particular fee type.
            // This doesn't seem right.
            let schoolFeeRuleMappedByFeeTypeId = {}; // format: {feeTypeId: schoolFeeRule, ...}; it will be returned for creating studentFee
            value.forEach(schoolFeeRule => {
                schoolFeeRuleMappedByFeeTypeId[schoolFeeRule.parentFeeType] = schoolFeeRule;
            });

            let schoolFeeRuleToBeUploaded = [];  // to be uploaded
            this.vm.usefulFeeTypeExcelColumnIndexList.forEach(col => {
                let feeType = this.vm.feeTypeList[col-this.vm.NUM_OF_COLUMNS_FOR_STUDENT_INFO];
                if (!schoolFeeRuleMappedByFeeTypeId[feeType.id]) {   //  create new school fee rule if doesn't already exist for a particular fee type
                    let newSchoolFeeRule = new SchoolFeeRule();
                    newSchoolFeeRule.parentSession = this.vm.user.activeSchool.currentSessionDbId;
                    newSchoolFeeRule.isClassFilter = false;
                    newSchoolFeeRule.isBusStopFilter = false;
                    newSchoolFeeRule.onlyNewAdmission = false;
                    newSchoolFeeRule.includeRTE = false;
                    newSchoolFeeRule.isAnnually = true;

                    newSchoolFeeRule.name = feeType.name + '-SheetUpload';
                    newSchoolFeeRule.parentFeeType = feeType.id;
                    newSchoolFeeRule.ruleNumber = 1;
                    schoolFeeRuleToBeUploaded.push(newSchoolFeeRule);
                }
            });

            if (schoolFeeRuleToBeUploaded.length > 0) {
                return this.vm.feeService.createList(this.vm.feeService.school_fee_rules, schoolFeeRuleToBeUploaded).then(schoolFeeRules => {
                    schoolFeeRules.forEach(schoolFeeRule => {
                        schoolFeeRuleMappedByFeeTypeId[schoolFeeRule.parentFeeType] = schoolFeeRule;
                    });
                    return schoolFeeRuleMappedByFeeTypeId;
                })
            }
            else
                return schoolFeeRuleMappedByFeeTypeId;
        });
    }

    uploadStudentFeeDataOld() {
        this.vm.isLoading = true;
        this.uploadedStudentFeePreProcessing().then(SchoolFeeRuleObject => {
            let studentFeeListToBeUploaded = [];  //  to be uploaded
            this.vm.usefulFeeTypeExcelColumnIndexList.forEach(col => {
                let feeType = this.vm.feeTypeList[col - this.vm.NUM_OF_COLUMNS_FOR_STUDENT_INFO];
                let schoolFeeRule = SchoolFeeRuleObject[feeType.id];
                this.vm.excelDataFromUser.slice(1).forEach(rowStudent => {
                    // Why are we parsing with float instead of parsing with int. : Not necessary to check with parseFloat, already handled at the time of sanity check
                    if (!rowStudent[col] || parseFloat(rowStudent[col]) == 0 || isNaN(parseFloat(rowStudent[col]))) //  if cell is empty return
                        return;
                    
                    let student_id = parseInt(rowStudent[0]);
                    let newStudentFee = {   //  Create student Data.push();
                        'parentStudent': student_id,
                        'parentSchoolFeeRule': schoolFeeRule.id,
                        'parentFeeType': feeType.id,
                        'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                        'isAnnually': true,
                        'cleared': false,

                        'aprilAmount': rowStudent[col],                        
                    };
                    studentFeeListToBeUploaded.push(newStudentFee);
                })                
            });

            if(studentFeeListToBeUploaded.length>0)
                this.vm.feeService.createList(this.vm.feeService.student_fees, studentFeeListToBeUploaded).then((uploadedFeeData) => {
                    this.vm.isUploadable = false;
                    this.vm.isLoading = false;
                    alert('Data Upload Successful');
                    this.initializeData();
                    this.vm.clearExcelData();
                });
            else {
                this.vm.isUploadable = false;
                this.vm.isLoading = false;
                alert('No Fee Data To Upload');
                this.vm.clearExcelData();
            }  
        })
    }*/

}
