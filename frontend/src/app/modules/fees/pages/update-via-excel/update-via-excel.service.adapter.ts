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
            console.log('update via excel adapter value data: ', value);
            this.vm.classList = value[1];
            this.vm.divisionList = value[2];
            this.populateFeeType(value[3]);
            
            //structuring for student's class and division
            this.structuringForStudents(value[1], value[2]);

            let student_data = {
                'id__in': value[0].map(ss => ss.parentStudent),
                'fields__korangle': 'id,name,fathersName,scholarNumber',
            };
            
            Promise.all([
                this.vm.studentService.getObjectList(this.vm.studentService.student, student_data),
            ]).then(value2 => {
                this.vm.studentList = value2[0];  //check if we can avoid this

                let student_fee_data = {
                    'parentStudent__in': value2[0].map(s=>s.id),
                    'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                };
                this.vm.feeService.getList(this.vm.feeService.student_fees, student_fee_data).then(value3 => {
                    value[0].forEach(ss => {
                        ss['student'] = value2[0].find(student => student.id === ss.parentStudent);   // storing student data inside student session data
                    }); 

                    //Populate Students
                    this.populateStudents(value[0]); 
                    
                    //storing fee of students
                    this.populateStructuredStudentsFeeExist(value3);

                    this.vm.isLoading = false;
                })
            })
        }, error => {
                console.log(error);
                this.vm.isLoading = false;
        });

    }

    getSchoolFeeRuleData(): any {
        let request_school_fee_rule_data = {
            'parentFeeType__parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId
        };
        
        return this.vm.feeService.getList(this.vm.feeService.school_fee_rules, request_school_fee_rule_data);
    }

    newSchoolFeeRule(name, parentFeeTypeDbId, ruleNuber ) {
        let newSchoolFeeRule = new SchoolFeeRule();
        newSchoolFeeRule.parentSession = this.vm.user.activeSchool.currentSessionDbId;
        newSchoolFeeRule.isClassFilter = false;
        newSchoolFeeRule.isBusStopFilter = false;
        newSchoolFeeRule.onlyNewAdmission = false;
        newSchoolFeeRule.includeRTE = false;
        newSchoolFeeRule.isAnnually = true;

        newSchoolFeeRule.name = name;
        newSchoolFeeRule.parentFeeType = parentFeeTypeDbId;
        newSchoolFeeRule.ruleNumber = ruleNuber;
        return newSchoolFeeRule;
    }

    uploadedStudentFeePreProcessing() { 
        this.vm.removePreviousFeeDataFromSheet();
        
        return this.getSchoolFeeRuleData().then(value => {
            let schoolFeeRuleList = {}; // format: {feeTypeId: schoolFeeRule, ...}; it will be returned for creating studentFee
            value.forEach(schoolFeeRule => {
                schoolFeeRuleList[schoolFeeRule.parentFeeType] = schoolFeeRule;
            });

            let Data = [];  // to be uploaded 
            this.vm.filteredColumns.slice(5).forEach(col => {
                let feeType = this.vm.feeTypeList[col-5];
                if (!schoolFeeRuleList[feeType.id]) {   //  create new school fee rule if dosen't already exists for a particular fee type
                    let newFeeRule = this.newSchoolFeeRule(feeType.name + '-SheetUpload', feeType.id, 1);
                    Data.push(newFeeRule);
                }
            });

            if (Data.length > 0) {
                return this.vm.feeService.createList(this.vm.feeService.school_fee_rules, Data).then(schoolFeeRules => {
                    schoolFeeRules.forEach(schoolFeeRule => {
                        schoolFeeRuleList[schoolFeeRule.id] = schoolFeeRule;
                    });
                    return schoolFeeRuleList;
                })
            }
            else
                return schoolFeeRuleList;
        });
    }

    uploadStudentFeeData() {
        this.vm.isLoading = true;
        this.uploadedStudentFeePreProcessing().then(SchoolFeeRuleObject => {
            let Data = [];  //  to be uploaded
            this.vm.filteredColumns.slice(5).forEach(col => {
                let feeType = this.vm.feeTypeList[col - 5];
                let schoolFeeRule = SchoolFeeRuleObject[feeType.id];
                this.vm.uploadedData.slice(1).forEach(rowStudent => {
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
                    Data.push(newStudentFee);
                })                
            });

            if(Data.length>0)
                this.vm.feeService.createList(this.vm.feeService.student_fees, Data).then((uploadedFeeData) => {
                    this.vm.isUploadable = false;
                    this.vm.isLoading = false;
                    alert('Data Upload Successful');
                    this.vm.clearExcelData();
                });
            else {
                this.vm.isUploadable = false;
                this.vm.isLoading = false;
                alert('No Fee Data To Upload');
            }  
        })
    }

    populateFeeType(feeTypeList: any): void{
        this.vm.feeTypeList = feeTypeList.sort((a, b) => a.orderNumber - b.orderNumber);
    }

    structuringForStudents(classList: any, divisionList: any): void {   // structure: {classsid: {divisionId: [student1,...], ...}, ...}
        let classIds = classList.map(c => c.id);
        let divisionIds = divisionList.map(d => d.id);

        classIds.forEach(classId => {
            this.vm.structuredStudent[classId] = {};
            this.vm.structuredSelection[classId] = {};
            divisionIds.forEach(divisionId => {
                this.vm.structuredStudent[classId][divisionId] = [];    // students will be filled whilt populating
                this.vm.structuredSelection[classId][divisionId] = false;   // default selection false
            });
        });
    }
    
    populateStudents(studentSectionList: any): void {
        studentSectionList.forEach(studentSelection => {
            let ClassId, DivisionId;
            ClassId = studentSelection.parentClass;
            DivisionId = studentSelection.parentDivision;
            this.vm.structuredStudent[ClassId][DivisionId].push(studentSelection);
        });
        this.vm.studentsCount = studentSectionList.length;

        // Removing empty divisions
        this.vm.classList.forEach(Class => {
            this.vm.divisionList.forEach(Division => {
                if (this.vm.structuredStudent[Class.id][Division.id].length === 0) {
                    delete this.vm.structuredStudent[Class.id][Division.id];
                    delete this.vm.structuredSelection[Class.id][Division.id];
                }
            })
          })
    }

    populateStructuredStudentsFeeExist(studentFeeList: any): void{
        studentFeeList.forEach(studentFee => {
            if (this.vm.structuredStudentFeeExist[studentFee.parentStudent])
                this.vm.structuredStudentFeeExist[studentFee.parentStudent].push(studentFee);
            else
                this.vm.structuredStudentFeeExist[studentFee.parentStudent] = [studentFee];
        });
    }

}