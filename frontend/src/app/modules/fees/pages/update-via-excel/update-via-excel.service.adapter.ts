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
            this.vm.feeTypeColumnIndexMappedByFeeTypeId[feeType.id] = index + this.vm.NUM_OF_COLUMNS_FOR_STUDENT_INFO;
        });
    }

    structuringForStudents(classList: any, divisionList: any): void {   // structure: {classsid: {divisionId: [student1,...], ...}, ...}
        let classIds = classList.map(c => c.id);
        let divisionIds = divisionList.map(d => d.id);

        classIds.forEach(classId => {
            this.vm.studentListMappedByClassDivision[classId] = {};
            this.vm.classDivisionSelectionMappedByClassDivision[classId] = {};
            divisionIds.forEach(divisionId => {
                this.vm.studentListMappedByClassDivision[classId][divisionId] = [];    // students will be filled while populating
                this.vm.classDivisionSelectionMappedByClassDivision[classId][divisionId] = false;   // default selection false
            });
        });
    }

    populateStudents(studentSectionList: any): void {
        studentSectionList.forEach(studentSelection => {
            let ClassId, DivisionId;
            ClassId = studentSelection.parentClass;
            DivisionId = studentSelection.parentDivision;
            this.vm.studentListMappedByClassDivision[ClassId][DivisionId].push(studentSelection);
        });
        this.vm.studentsCount = studentSectionList.length;

        // Removing empty divisions
        this.vm.classList.forEach(Class => {
            this.vm.divisionList.forEach(Division => {
                if (this.vm.studentListMappedByClassDivision[Class.id][Division.id].length === 0) {
                    delete this.vm.studentListMappedByClassDivision[Class.id][Division.id];
                    delete this.vm.classDivisionSelectionMappedByClassDivision[Class.id][Division.id];
                }
            })
        })
    }

    populateStructuredStudentsFeeExist(studentFeeList: any): void{
        studentFeeList.forEach(studentFee => {
            if (this.vm.studentFeeListMappedByStudent[studentFee.parentStudent]) // for handling the case of multiple fee types
                this.vm.studentFeeListMappedByStudent[studentFee.parentStudent].push(studentFee);
            else
                this.vm.studentFeeListMappedByStudent[studentFee.parentStudent] = [studentFee];
        });
    }

    uploadedStudentFeePreProcessing() {

        this.vm.excelDataFromUser.slice(1).forEach((uploadedRow,row) => {
            let [student_id] = uploadedRow;
            if (this.vm.studentFeeListMappedByStudent[student_id]) {
                this.vm.studentFeeListMappedByStudent[student_id].forEach(studentFee => {
                    let feeTypeColumnIndex = this.vm.feeTypeColumnIndexMappedByFeeTypeId[studentFee.parentFeeType];
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

    uploadStudentFeeData() {
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
    }

}
