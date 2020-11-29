
import {CreateTestComponent} from './create-test.component';

import { TEST_TYPE_LIST } from '../../../../classes/constants/test-type';

export class CreateTestServiceAdapter {



    /* These are newly created properties*/


    examTypeList :any;

    classSectionSubjectList:  Array<{
                'className':any,
                'classId':any,
                'sectionList': Array<{
                    'sectionName':any,
                    'sectionId':any,
                    'selected':boolean,
                    'subjectList':Array<{
                        'subjectName':any,
                        'subjectId':any
                    }>
                }>
            }>;
    classListForTest :any;
    sectionListForTest :any;

    uniqueClassList :any;
    uniqueSetionList :any;

    commonSubjectList :Array<{
        'subjectId':any,
        'subjectName':any,
        'classList':Array<{
            'className' :any,
            'classId' : any
        }>,
        'sectionList':Array<{
            'sectionName':any,
            'sectionId':any
        }>
    }>;


    toBeDeletedTestList:any = [];

    copyNewTestList: any= [];

    























    /*Above are newly created variables */



























    vm: CreateTestComponent;

    test_type_list = TEST_TYPE_LIST;

    constructor() {}

    // Data
    examinationList: any;
    classList: any;
    sectionList: any;
    subjectList: any;

    testList: any;
    classSubjectList: any;

    

    student_mini_profile_list: any;


    initializeAdapter(vm: CreateTestComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        this.vm.isInitialLoading = true;

        let request_examination_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };


        //data to request for examination list type for current school id and session id
        let request_examination_data_new = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        }

        let request_student_mini_profile_data = {
            'schoolDbId': this.vm.user.activeSchool.dbId,
            'sessionDbId': this.vm.user.activeSchool.currentSessionDbId,
        };

        let request_class_section_subject_data = {
            'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            'schoolList': [this.vm.user.activeSchool.dbId],
        };


        //data to request for class and section and subject having atleast one subject in current schoolId and sessionId
        let request_class_section_subject_data_new = {
            'parentSession':this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        }
        console.log(request_class_section_subject_data_new);
        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination,request_examination_data),
            this.vm.classService.getObjectList(this.vm.classService.classs,{}),
            this.vm.classService.getObjectList(this.vm.classService.division,{}),
            this.vm.subjectService.getSubjectList(this.vm.user.jwt),
            this.vm.subjectService.getClassSubjectList(request_class_section_subject_data,this.vm.user.jwt),
            this.vm.studentService.getStudentMiniProfileList(request_student_mini_profile_data, this.vm.user.jwt),

            //fetch the exam list type
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination,request_examination_data_new),
            //fetch class and section present in this school and session
            this.vm.subjectNewService.getObjectList(this.vm.subjectNewService.class_subject,request_class_section_subject_data_new),

        ]).then(value => {
            this.examinationList = value[0];
            this.classList = value[1];
            this.sectionList = value[2];
            this.subjectList = value[3];

            console.log("Exam list is below");
            console.log(value[6]);
            this.examTypeList  = value[6];

            console.log("class, section and subjects are below");
            console.log(value[7]);
            //this.classSectionSubjectList = value[7];
            this.classSectionSubjectList = [];

            value[7].forEach(item => {
                
                var classIndex = this.classSectionSubjectList.findIndex(data =>data.classId === item.parentClass);
                var sectionIndex =-1,subjectIndex=-1;
                if(classIndex != -1)
                {
                    sectionIndex = this.classSectionSubjectList[classIndex].sectionList.findIndex(section => section.sectionId === item.parentDivision);

                    if(sectionIndex != -1)
                    {
                        subjectIndex = this.classSectionSubjectList[classIndex].sectionList[sectionIndex].subjectList.findIndex(subject => subject.subjectId === item.parentSubject);
                    }
                }

                
                    let tempSubject = {
                        'subjectName' : this.getSubjectName(item.parentSubject),
                        'subjectId' : item.parentSubject
                    }

                    let tempSubjectList=[];
                    tempSubjectList.push(tempSubject);

                    let tempSection = {
                        'sectionName' : this.getSectionName(item.parentDivision),
                        'sectionId' : item.parentDivision,
                        'selected' : false,
                        'subjectList':tempSubjectList
                    }

                    let tempSectionList = [];
                    tempSectionList.push(tempSection);


                    let tempClass = {
                        'className' : this.getClassName(item.parentClass),
                        'classId' : item.parentClass,
                        'sectionList':tempSectionList,
                    }
                
                if(classIndex === -1)
                {
                    this.classSectionSubjectList.push(tempClass);
                }
                else if(sectionIndex === -1)
                {
                    this.classSectionSubjectList[classIndex].sectionList.push(tempSection);
                }
                else if(subjectIndex === -1)
                {
                    this.classSectionSubjectList[classIndex].sectionList[sectionIndex].subjectList.push(tempSubject);
                }
               

            });

            console.log("List created after nesting class section subject ");
            console.log(this.classSectionSubjectList);
            

            //sort the classSection list
            this.classSectionSubjectListSort();
            console.log("List after Sorting...");
            console.log(this.classSectionSubjectList);





            
            // this.classSectionSubjectList = value[4];
            const map = new Map();
            value[4].forEach(item => {
                
                let key = item.parentClass + "|" + item.parentDivision;
                if(!map.has(key)){
                    map.set(key, true);    // set any value to Map
                    this.vm.classSectionSubjectList.push({
                        'class': this.getClassName(item.parentClass),
                        'sec': this.getSectionName(item.parentDivision)
                    });
                }
            });


            this.student_mini_profile_list = value[5];
          
            this.populateExaminationClassSectionList();
            this.vm.subjectList = this.subjectList;  
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });

        /*this.vm.examinationService.getObjectList(this.vm.examinationService.examination,request_examination_data).then(value => {
            this.vm.examinationList = value;
            this.vm.isInitialLoading = false;
        }, error => {
            this.vm.isInitialLoading = false;
        });*/
    }
    // resultSelection = [];
    // popuateClassSectionSubjectList()
    // {
    //     const map = new Map();
    //     for (const item of this.classSectionSubjectList) {
    //         let key = item.parentClass + "|" + item.parentDivision;
    //         if(!map.has(key)){
    //             map.set(key, true);    // set any value to Map
    //             this.resultSelection.push({
    //                 'class': this.getClassName(item.parentClass),
    //                 'sec': this.getSectionName(item.parentDivision)
    //             });
    //         }
    //     }
    // }
    
    



    populateExaminationClassSectionList(): void {
        this.vm.examinationClassSectionList = [];
        this.examinationList.forEach(examination => {
            let tempExamination = {};
            Object.keys(examination).forEach(key => {
                tempExamination[key] = examination[key];
            });
            tempExamination['classList'] = [];
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
                    tempSection['testList'] = [];
                    tempClass['sectionList'].push(tempSection);
                });
                tempClass['selectedSection'] = tempClass['sectionList'][0];
                tempExamination['classList'].push(tempClass);   
                
            });
            tempExamination['selectedClass'] = tempExamination['classList'][0];          
            this.vm.examinationClassSectionList.push(tempExamination);
        });
        this.vm.selectedExamination = this.vm.examinationClassSectionList[0];
    }


    //Get Test and Subject Details New
    getTestAndSubjectDetailsNew(): void {
        
        this.vm.isLoading = true;
        this.vm.enableUpdateButton = false;
        this.makeDataReadyForGet();

        let totalNumberOfListRequired = this.classListForTest.length;

        let request_subject_data = {

            'parentSession': [this.vm.user.activeSchool.currentSessionDbId],
            'parentSchool': [this.vm.user.activeSchool.dbId],
            'parentClass__in': this.classListForTest.join(','),
            'parentDivision__in': this.sectionListForTest.join(','),

        }

        Promise.all([
            this.vm.subjectNewService.getObjectList(this.vm.subjectNewService.class_subject,request_subject_data)
        ]).then(value =>{

            this.commonSubjectList = [];

            value[0].forEach(item => {

                var subIdx = this.commonSubjectList.findIndex(sub => sub.subjectId === item.parentSubject);

                let tempClass = {
                    'className' : this.getClassName(item.parentClass),
                    'classId' : item.parentClass
                }

                let tempSection = {
                    'sectionName' : this.getSectionName(item.parentDivision),
                    'sectionId'  : item.parentDivision,
                }

                let tempClassList = [];  tempClassList.push(tempClass);
                let tempSectionList = [];  tempSectionList.push(tempSection);



                if(subIdx != -1)
                {
                    this.commonSubjectList[subIdx].classList.push(tempClass);
                    this.commonSubjectList[subIdx].sectionList.push(tempSection);
                }
                else
                {
                    let tempSub = {
                        'subjectName' : this.getSubjectName(item.parentSubject),
                        'subjectId' : item.parentSubject,
                        'classList' : tempClassList,
                        'sectionList' : tempSectionList

                    }
                    this.commonSubjectList.push(tempSub);
                }

                
            });
            this.populateSubjectList();


            var findOne = this.commonSubjectList.findIndex(item => item.classList.length != totalNumberOfListRequired);

            if(findOne === -1)
            {
                this.getTestAndSubjectDetails();
            }
            else
            {
                alert("Selected classes and section have different subject");
                this.vm.isLoading = false;
                return ;
            }

        },
        error =>{
            this.vm.isLoading = false;
        })

    }

    //Get Test And Subject Details
    getTestAndSubjectDetails(): void {

        this.vm.isLoading = true;
        console.log(this.classSectionSubjectList);
        

        let request_test_data_list = {
            'parentExamination': this.vm.selectedExamination.id,
            'parentClass__in': this.classListForTest.join(','),
            'parentDivision__in': this.sectionListForTest.join(','),

        }

        let request_test_data = {
            /*'examinationId': this.vm.selectedExamination.id,
            'classId': this.vm.selectedExamination.selectedClass.id,
            'sectionId': this.vm.selectedExamination.selectedClass.selectedSection.id,*/
            'parentExamination': this.vm.selectedExamination.id,
            'parentClass': this.vm.selectedExamination.selectedClass.id,
            'parentDivision': this.vm.selectedExamination.selectedClass.selectedSection.id,
        };

        let request_class_subject_data = {
            /*'classId': this.vm.selectedExamination.selectedClass.id,
            'sectionId': this.vm.selectedExamination.selectedClass.selectedSection.id,
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
            'schoolId': this.vm.user.activeSchool.dbId,*/
            'classList': [this.vm.selectedExamination.selectedClass.id],
            'sectionList': [this.vm.selectedExamination.selectedClass.selectedSection.id],
            'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
            'schoolList': [this.vm.user.activeSchool.dbId],
        };

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_data),
            this.vm.subjectService.getClassSubjectList(request_class_subject_data, this.vm.user.jwt),

            //fetch test list
            this.vm.examinationService.getObjectList(this.vm.examinationService.test_second,request_test_data_list),
        ]).then(value => {


            //test list obtained...
            console.log("Test list fetched...");
            console.log(value[2]);

            this.vm.newTestList = [];
            value[2].forEach(test => {

                var subIdx = this.vm.newTestList.findIndex(sub =>sub.subjectId === test.parentSubject && sub.testType === test.testType && sub.maximumMarks === test.maximumMarks);

                var classIdx = -1, sectionIdx = -1;

                if(subIdx != -1)
                {
                    classIdx = this.vm.newTestList[subIdx].classList.findIndex(cl => cl.classId === test.parentClass);

                    if(classIdx != -1)
                    {
                        sectionIdx = this.vm.newTestList[subIdx].classList[classIdx].sectionList.findIndex(sec => sec.sectionId === test.parentDivision);
                    }
                }


                let tempSection = {
                    'sectionName' : this.getSectionName(test.parentDivision),
                    'sectionId' : test.parentDivision,
                    'testId' : test.id,
                   
                }

                let tempSectionList = [];
                tempSectionList.push(tempSection);


                let tempClass = {
                    'className' : this.getClassName(test.parentClass),
                    'classId' : test.parentClass,
                    'sectionList':tempSectionList,
                }
                let tempClassList = [];
                tempClassList.push(tempClass);

                let tempSubject = {
                    'parentExamination' : test.parentExamination,
                    'deleted':false,
                    'subjectId':test.parentSubject,
                    'subjectName':this.getSubjectName(test.parentSubject),
                    'testType':test.testType,
                    'newTestType' :test.testType,
                    'maximumMarks':test.maximumMarks,
                    'newMaximumMarks' :test.maximumMarks,
                    'classList' : tempClassList,
                }
               


               
            
                if(subIdx === -1)
                {
                    this.vm.newTestList.push(tempSubject);
                }
                else if(classIdx === -1)
                {
                    this.vm.newTestList[subIdx].classList.push(tempClass);
                }
                else if(sectionIdx === -1)
                {
                    this.vm.newTestList[subIdx].classList[classIdx].sectionList.push(tempSection);
                }





            });


            console.log("Test listed created in nested fashion...");
            console.log(this.vm.newTestList);
            this.copyNewTestList = this.vm.newTestList;
            if(this.vm.newTestList.length === 0)
            {
                this.vm.createTestFromTemplate();
            }

            

            let student_id_list = this.getStudentIdListForSelectedItems();

            let request_student_test_data = {
                'studentList': student_id_list,
                'subjectList': [],
                'examinationList': [this.vm.selectedExamination.id],
                'testTypeList': [],
                'marksObtainedList': [],
            };

            let request_student_subject_data = {
                'studentList': student_id_list,
                'sessionList': [this.vm.user.activeSchool.currentSessionDbId],
                'subjectList': [],
            };

            Promise.all([
                this.vm.examinationOldService.getStudentTestList(request_student_test_data, this.vm.user.jwt),
                this.vm.subjectService.getStudentSubjectList(request_student_subject_data, this.vm.user.jwt),
            ]).then(value2 => {

                this.classSubjectList = value[1];
                this.addTestListToExaminationList(value[0]);
                this.addStudentTestListToExaminationList(value2[0], true);
                this.addStudentSubjectListToExaminationList(value2[1]);
                this.vm.selectedSubject = null;
                this.vm.selectedTestType = null;
                this.vm.showTestDetails = true;
                this.vm.isLoading = false;

            });

        }, error => {
            this.vm.isLoading =false;
        });

    }

    getStudentIdListForSelectedItems(): any {
        let idList = [];
        this.student_mini_profile_list.forEach(item => {
            if (item.classDbId === this.vm.selectedExamination.selectedClass.id
                && item.sectionDbId === this.vm.selectedExamination.selectedClass.selectedSection.id) {
                idList.push(item.dbId);
            }
        });
        return idList;
    }

    addTestListToExaminationList(testList: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.testList = [];
        testList.forEach(test => {
            this.addTestToTestList(test);
        });
    }

    addStudentTestListToExaminationList(studentTestList: any, initial: boolean): void {
        if (initial) {
            this.vm.selectedExamination.selectedClass.selectedSection['studentTestList'] = [];
        }
        studentTestList.forEach(item => {
            let tempItem = {};
            Object.keys(item).forEach(key => {
                tempItem[key] = item[key];
            });
            this.vm.selectedExamination.selectedClass.selectedSection.studentTestList.push(tempItem);
        })
    }

    addStudentSubjectListToExaminationList(studentSubjectList: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection['studentSubjectList'] = [];
        studentSubjectList.forEach(item => {
            let tempItem = {};
            Object.keys(item).forEach(key => {
                tempItem[key] = item[key];
            });
            this.vm.selectedExamination.selectedClass.selectedSection.studentSubjectList.push(tempItem);
        });
    }

    populateSubjectList(): void {
        this.vm.subjectList = [];
        this.commonSubjectList.forEach(item => {
            let tempSubject = {
                'id': item.subjectId,
                'name': item.subjectName,
            };
            this.vm.subjectList.push(tempSubject);
        });
    }

    //Create Test New
    createTestNew(parentClass:any, parentDivision:any): void {

        if (this.vm.selectedSubject === null) {
            alert('Subject should be selected');
            return;
        }

        

        if (this.vm.selectedTestType === 0) {
            this.vm.selectedTestType = null;
        }

        if (!this.isOnlyGrade(this.vm.selectedSubject.id)
            && (!this.vm.selectedMaximumMarks || this.vm.selectedMaximumMarks < 1)) {
            alert('Invalid Maximum Marks');
            return;
        }

        if (this.isOnlyGrade(this.vm.selectedSubject.id)) {
            this.vm.selectedMaximumMarks = 100;
        }

       
        



       

        let data = {
            'parentExamination': this.vm.selectedExamination.id,
            'parentClass': parentClass,
            'parentDivision':parentDivision,
            'parentSubject': this.vm.selectedSubject.id,
            'startTime':"2019-07-01T11:30:00+05:30",
            'endTime':"2019-07-01T13:30:00+05:30",
            'testType': this.vm.selectedTestType,
            'maximumMarks': this.vm.selectedMaximumMarks,
        };



        //Logic to check for test already or not...

        let testAlreadyAdded = false;

        this.vm.newTestList.forEach(test => {
            if(test.subjectId === data.parentSubject && test.testType === data.testType)
            {
                test.classList.forEach(cll => {
                        if(cll.classId === data.parentClass)
                        {
                        cll.sectionList.forEach(secc => {
                            if(secc.sectionId === data.parentDivision)
                            {
                                console.log("a test is found with same parameter...");
                                console.log(test);
                                testAlreadyAdded = true;
                                
                            }
                            
                        }) 
                        }
                })
            }
        })

        if (testAlreadyAdded) {
            alert('Similar Test is already in the template');
            return;
        }

        this.vm.isLoading = true;
        


        Promise.all([
            this.vm.examinationService.createObject(this.vm.examinationService.test_second, data),
        ]).then(value => {
            this.addTestToNewTestList(value[0]);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }
    //Create Test
    createTest(): void {

        if (this.vm.selectedSubject === null) {
            alert('Subject should be selected');
            return;
        }

        

        if (this.vm.selectedTestType === 0) {
            this.vm.selectedTestType = null;
        }

        if (!this.isOnlyGrade(this.vm.selectedSubject.id)
            && (!this.vm.selectedMaximumMarks || this.vm.selectedMaximumMarks < 1)) {
            alert('Invalid Maximum Marks');
            return;
        }

        if (this.isOnlyGrade(this.vm.selectedSubject.id)) {
            this.vm.selectedMaximumMarks = 100;
        }

        let testAlreadyAdded = false;

        

        



        this.vm.selectedExamination.selectedClass.selectedSection.testList.every(item => {
            if (item.parentSubject == this.vm.selectedSubject.id && item.testType == this.vm.selectedTestType) {
                testAlreadyAdded = true;
                return false;
            }
            return true;
        });

        if (testAlreadyAdded) {
            alert('Test Already created for this subject and type');
            return;
        }

        this.vm.isLoading = true;

        let data = {
            'parentExamination': this.vm.selectedExamination.id,
            'parentClass': this.vm.selectedExamination.selectedClass.id,
            'parentDivision': this.vm.selectedExamination.selectedClass.selectedSection.id,
            'parentSubject': this.vm.selectedSubject.id,
            'startTime': this.getDateTime(this.vm.selectedDate, this.vm.selectedStartTime),
            'endTime': this.getDateTime(this.vm.selectedDate, this.vm.selectedEndTime),
            'testType': this.vm.selectedTestType,
            'maximumMarks': this.vm.selectedMaximumMarks,
        };

        let student_test_data = this.prepareStudentTestDataToAdd();

        Promise.all([
            this.vm.examinationService.createObject(this.vm.examinationService.test_second, data),
            this.vm.examinationOldService.createStudentTestList(student_test_data, this.vm.user.jwt),
        ]).then(value => {
            this.addTestToTestList(value[0]);
            this.addStudentTestListToExaminationList(value[1], false);
            this.vm.selectedSubject = null;
            this.vm.selectedTestType = null;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    prepareStudentTestDataToAdd(): any {
        let student_test_list = [];
        this.vm.selectedExamination.selectedClass.selectedSection.studentSubjectList.forEach(item => {
            if (item.parentSubject === this.vm.selectedSubject.id) {
                let tempData = {
                    'parentStudent': item.parentStudent,
                    'parentExamination': this.vm.selectedExamination.id,
                    'parentSubject': item.parentSubject,
                    'testType': this.vm.selectedTestType,
                    'marksObtained': 0,
                };
                student_test_list.push(tempData);
            }
        });
        return student_test_list;
    }

    getDateTime(selectedDate: any, selectedTime: any): any {
        return selectedDate+'T'+selectedTime+':00+05:30';
    }


    addTestToNewTestList(test:any): void {

        var subIdx = this.vm.newTestList.findIndex(sub =>sub.subjectId === test.parentSubject && sub.testType === test.testType && sub.maximumMarks === test.maximumMarks);

                var classIdx = -1, sectionIdx = -1;

                if(subIdx != -1)
                {
                    classIdx = this.vm.newTestList[subIdx].classList.findIndex(cl => cl.classId === test.parentClass);

                    if(classIdx != -1)
                    {
                        sectionIdx = this.vm.newTestList[subIdx].classList[classIdx].sectionList.findIndex(sec => sec.sectionId === test.parentDivision);
                    }
                }


                let tempSection = {
                    'sectionName' : this.getSectionName(test.parentDivision),
                    'sectionId' : test.parentDivision,
                    'testId' : test.id,
                   
                }

                let tempSectionList = [];
                tempSectionList.push(tempSection);


                let tempClass = {
                    'className' : this.getClassName(test.parentClass),
                    'classId' : test.parentClass,
                    'sectionList':tempSectionList,
                }
                let tempClassList = [];
                tempClassList.push(tempClass);

                let tempSubject = {
                    'parentExamination' : test.parentExamination,
                    'deleted':false,
                    'subjectId':test.parentSubject,
                    'subjectName':this.getSubjectName(test.parentSubject),
                    'testType':test.testType,
                    'newTestType' :test.testType,
                    'maximumMarks':test.maximumMarks,
                    'newMaximumMarks' :test.maximumMarks,
                    'classList' : tempClassList,
                }

                if(subIdx === -1)
                {
                    this.vm.newTestList.push(tempSubject);
                }
                else if(classIdx === -1)
                {
                    this.vm.newTestList[subIdx].classList.push(tempClass);
                }
                else if(sectionIdx === -1)
                {
                    this.vm.newTestList[subIdx].classList[classIdx].sectionList.push(tempSection);
                }
    }
    

    addTestToTestList(test: any): void {
        let tempTest = {};
        Object.keys(test).forEach(key => {
            tempTest[key] = test[key];
        });
        tempTest['subjectName'] = this.getSubjectName(test.parentSubject) + ((test.testType!=null)?' - '+test.testType:'');
        tempTest['testType'] = test.testType;
        tempTest['onlyGrade'] = this.isOnlyGrade(test.parentSubject);
        tempTest['newDate'] = this.vm.formatDate(test.startTime, '');
        tempTest['newStartTime'] = this.extractTime(test.startTime);
        console.log(tempTest);
        tempTest['newEndTime'] = this.extractTime(test.endTime);
        tempTest['newMaximumMarks'] = test.maximumMarks;
        tempTest['newTestType'] = test.testType;
        this.vm.selectedExamination.selectedClass.selectedSection.testList.push(tempTest);
    }

    extractTime(dateStr: any): any {
        let d = new Date(dateStr);

        let hour = ((d.getHours()<10)?'0':'') + d.getHours();
        let minute = '' + d.getMinutes();

        return hour+":"+minute;
    }

    getSubjectName(subjectId: any): any {
        let result = '';
        this.subjectList.every(subject => {
            if (subject.id === subjectId) {
                result = subject.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getClassName(classId: any): any {
        let result = '';
        this.classList.every(item => {
            if (item.id === classId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    getSectionName(sectionId: any): any {
        let result = '';
        this.sectionList.every(item => {
            if (item.id === sectionId) {
                result = item.name;
                return false;
            }
            return true;
        });
        return result;
    }

    isOnlyGrade(subjectId: any): boolean {
        let result = false;
        this.classSubjectList.every(item => {
            if (item.parentSubject === subjectId) {
                if(item.onlyGrade) {
                    result = true;
                }
                return false;
            }
            return true;
        });
        return result;
    }


    //Reset the test list view if not updated

    resetList(): void {

        this.getTestAndSubjectDetails();
        this.vm.enableUpdateButton =false;
        
    }

    //Delete Test New
    deleteTestNew(test: any, index: any): void {

        this.vm.isLoading = true;
        test.deleted =true;
        this.vm.isLoading = false;
    }
    //Delete Test
    deleteTest(test: any): void {
        this.vm.isLoading = true;

        let student_test_data = this.prepareStudentTestDataToRemove(test);

        let service_list = [];
        service_list.push(this.vm.examinationService.deleteObject(this.vm.examinationService.test_second, test));

        if (student_test_data.length > 0) {
            service_list.push(this.vm.examinationOldService.deleteStudentTestList(student_test_data, this.vm.user.jwt));
        }

        Promise.all(service_list).then(value => {
            this.removeTestFromTestList(test);
            if (student_test_data.length > 0) {
                this.removeStudentTestFromTestList(test);
            }
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

        /*this.vm.examinationOldService.deleteTest(test.id, this.vm.user.jwt).then(value => {
            this.removeTestFromTestList(test);
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });*/
    }

    //Delete test and update the backend
    deleteAndUpdate(): void {

    }

    prepareStudentTestDataToRemove(test): any {
        let student_test_id_list = [];
        this.vm.selectedExamination.selectedClass.selectedSection.studentTestList.forEach(item => {
            if (item.parentSubject === test.parentSubject &&
                item.testType === test.testType) {
                student_test_id_list.push(item.id);
            }
        });
        return student_test_id_list.join();
    }

    removeTestFromTestList(test: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.testList =
            this.vm.selectedExamination.selectedClass.selectedSection.testList.filter(item => {
                if (item.id === test.id) {
                    return false;
                }
                return true;
            });
    }

    removeStudentTestFromTestList(test: any): void {
        this.vm.selectedExamination.selectedClass.selectedSection.studentTestList =
            this.vm.selectedExamination.selectedClass.selectedSection.studentTestList.filter(item => {
                if (item.parentSubject === test.parentSubject &&
                    item.testType === test.testType) {
                    return false;
                }
                return true;
            });
    }

    //Update Test List New
    updateTestNew(): void {

        this.vm.isLoading = true;
        //Update the test list if any value changed in any of the test from test list
        this.vm.newTestList.forEach(test => {

            test.classList.forEach(cl => {
            
                cl.sectionList.forEach(sec => {
                    
                    let data = {
                        'id': sec.testId,
                        'parentExamination': test.parentExamination,
                        'parentClass': cl.classId,
                        'parentDivision': sec.sectionId,
                        'parentSubject': test.subjectId,
                        'startTime': "2019-07-01T11:30:00+05:30",
                        'endTime':  "2019-07-01T13:30:00+05:30",
                        'testType': test.newTestType,
                        'maximumMarks': test.newMaximumMarks,
                    };

                    //if test id is null that means it is from template and has to be created in backend
                    if(data.id === null)
                    {       
                        if(test.deleted)
                        {
                            console.log("delted from template");
                            this.getTestAndSubjectDetails();
                        }

                        else
                        {
                            console.log("id is null so test is being created");
                        
                            Promise.all([
                                this.vm.examinationService.createObject(this.vm.examinationService.test_second, data),
                            ]).then(value => {
                                this.getTestAndSubjectDetails();
                                this.vm.isLoading = false;
                                this.vm.selectedMaximumMarks = null;
                                
                            }, error => {
                                this.vm.isLoading = false;
                            });
                        }
                        
                        
                    }
                    
                    //if deleted
                    else if(test.deleted)
                    {   
                        console.log("A delete request for");
                        console.log(test);
                        Promise.all([
                            this.vm.examinationService.deleteObject(this.vm.examinationService.test_second, data)
                        ]).then(value => {
                            this.vm.isLoading = false;
                            console.log("Deleted Test");
                            console.log(value[0]);
                            this.getTestAndSubjectDetails();
                        },error =>{
                            console.log("Delete Test failed");
                            this.vm.isLoading =false;
                        })
                    }

                    //if updated
                    else if((test.newMaximumMarks != test.maximumMarks) || (test.newTestType != test.testType))
                    {
                        Promise.all([
                            this.vm.examinationService.updateObject(this.vm.examinationService.test_second, data)
                        ]).then(value => {

                            this.vm.isLoading = false;
                            console.log("Test Updated")
                            this.getTestAndSubjectDetails();
                        }, error => {
                            this.vm.isLoading = false;
                        });
                    }

            
                    
                });
            });
            

            

           
        })
        this.vm.enableUpdateButton = false;
        this.vm.isLoading = false;



    }

    // Update Test
    updateTest(test: any): void {

        if (test.newDate === null) {
            alert('Date should be selected');
            return;
        }

        if ((!test.newMaximumMarks || test.newMaximumMarks < 1)) {
            alert('Invalid Maximum Marks');
            return;
        }

        this.vm.isLoading = true;

        let data = {
            'id': test.id,
            'parentExamination': test.parentExamination,
            'parentClass': test.parentClass,
            'parentDivision': test.parentDivision,
            'parentSubject': test.parentSubject,
            'startTime': this.getDateTime(test.newDate, test.newStartTime),
            'endTime': this.getDateTime(test.newDate, test.newEndTime),
            'testType': test.newTestType,
            'maximumMarks': test.newMaximumMarks,
        };

        Promise.all([
            this.vm.examinationService.updateObject(this.vm.examinationService.test_second, data)
        ]).then(value => {
            test.startTime = value[0].startTime;
            test.endTime = value[0].endTime;
            test.maximumMarks = value[0].maximumMarks;
            test.testType = value[0].testType;
            this.vm.isLoading = false;
            this.getTestAndSubjectDetails();
        }, error => {
            this.vm.isLoading = false;
        });

    }









    /* These are newly created functions*/

    //Sort the nested list
    classSectionSubjectListSort()
    {
        this.classSectionSubjectList.forEach(cl => {
            cl.sectionList.sort(function(a,b){
                return a.sectionId - b.sectionId;
            })
        });

        this.classSectionSubjectList.sort(function(a,b){
            return a.classId - b.classId;
        })
    }


    //Store the selected  Class and Section list to get the test list
    makeDataReadyForGet():void{

        this.classListForTest = [];
        this.sectionListForTest = [];
        this.classSectionSubjectList.forEach(cl => {
            cl.sectionList.forEach(sec => {
                if(sec.selected)
                {
                    this.classListForTest.push(cl.classId);
                    this.sectionListForTest.push(sec.sectionId);
                    
                }
            });
        });

        for(let i=0;i<this.classListForTest.length;i++)
        {
            this.vm.showSelectedClassAndSection.push({
                'className':this.getClassName(this.classListForTest[i]),
                'sectionName':this.getSectionName(this.sectionListForTest[i])
            })
        }
       
    }


    findAnyDuplicate(tempTest :any,value:any) : boolean {
        var ans = false;

       tempTest.classList.forEach(cl => {
           cl.sectionList.forEach(sec => {
               this.vm.newTestList.forEach(test => {
                   if(test.subjectId === tempTest.subjectId && test.testType === value)
                   {
                       test.classList.forEach(cll => {
                            if(cll.classId === cl.classId)
                            {
                               cll.sectionList.forEach(secc => {
                                   if(secc.sectionId === sec.sectionId && secc.testId != sec.testId)
                                   {
                                       console.log("a test is found with same parameter...");
                                       console.log(test);
                                       ans = true;
                                       
                                   }
                                   
                               }) 
                            }
                       })
                   }
               })
           });
       });


       return ans;
    }



}
