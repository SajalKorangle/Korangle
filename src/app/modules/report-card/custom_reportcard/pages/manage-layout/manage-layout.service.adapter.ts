
import {ManageLayoutComponent} from './manage-layout.component';

export class ManageLayoutServiceAdapter {

    vm: ManageLayoutComponent;

    constructor() {}

    initializeAdapter(vm: ManageLayoutComponent): void {
        this.vm = vm;
    }

    //initialize data
    // Handle the data flow properly
    initializeData(): void {

        let request_layout_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId
        }

        let request_examination_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };
        
        let request_grade_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };
        
        let request_sub_grade_data = {
            'parentGrade__parentSession':this.vm.user.activeSchool.currentSessionDbId,
            'parentGrade__parentSchool':this.vm.user.activeSchool.dbId,
        };

        let request_layout_exam_column_data = {
            'parentLayout__parentSession':this.vm.user.activeSchool.currentSessionDbId,
            'parentLayout__parentSchool':this.vm.user.activeSchool.dbId,
        };

        let request_layout_grade_data = {
            'parentLayout__parentSession':this.vm.user.activeSchool.currentSessionDbId,
            'parentLayout__parentSchool':this.vm.user.activeSchool.dbId,
        };

        let request_layout_sub_grade_data = {
            'parentLayoutGrade__parentLayout__parentSession':this.vm.user.activeSchool.currentSessionDbId,
            'parentLayoutGrade__parentLayout__parentSchool':this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.gradeService.getObjectList(this.vm.gradeService.grade,request_grade_data),
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, request_sub_grade_data),
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout,request_layout_data),
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column_data),
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_grade, request_layout_grade_data),
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_sub_grade, request_layout_sub_grade_data),
        ]).then(
            value=>{
                console.log(value);
                this.vm.examinationList = value[0];
                if(value[0].length == 0){
                    return;
                }
                this.vm.gradeList = value[1];
                this.vm.subGradeList = value[2];
                this.vm.layoutList = value[3];
                this.vm.layoutExamColumnList = value[4];
                this.vm.layoutGradeList = value[5];
                this.vm.layoutSubGradeList = value[6];

                this.vm.isLoading = false;
            },
            error=>{

            }
        );
        
    }


    // Return the position of the key in selectedLayout.studentDetailsHeader
    // if it's show true
    getOrderNumber(key){
        if(this.vm.selectedLayout == null || this.vm.selectedLayout == undefined) return;


        for(let i = 0; i<this.vm.selectedLayout.studentDetailsHeader.length; i++){
            if(this.vm.selectedLayout.studentDetailsHeader[i].key == key){
                if(this.vm.selectedLayout.studentDetailsHeader[i].show == false) return 0;
                return i+1;
            }
        }

        return 0;

    }
    // Updating or saving a new layout
    updateLayout(){
        if(this.vm.selectedLayout == null || this.vm.selectedLayout == undefined) return;
        
        // Check if name is unique
        if(this.vm.selectedLayout.name == '' || this.vm.isNameUnqiue(this.vm.selectedLayout, this.vm.layoutList) == false){
            alert('Layout Name must be unique and not empty');
            return;
        }
        this.vm.isLoading = true;

        if(this.vm.selectedLayout.id == 0){
            let request_data = this.prepareReturnData();
            this.vm.customReportCardService.createObject(this.vm.customReportCardService.layout,request_data).then(
                value=>{
                    this.vm.layoutList.push(value);

                    let request_layout_exam_data = this.vm.currentLayout_LayoutExamColumnList.map((item, index)=>{
                        item.parentLayout = value.id;
                        item.orderNumber = index +1;
                        return item;
                    });

                    let request_layout_grade_data = this.vm.currentLayout_LayoutGradeList.map((item,index)=>{
                        item.parentLayout = value.id;
                        item.orderNumber = index+1;
                        return item;
                    });

                    Promise.all([
                    this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_data),
                    this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_grade, request_layout_grade_data),
                    ]).then(
                        value=>{
                            value[0].forEach(item=>{
                                this.vm.layoutExamColumnList.push(item);
                            });
                            value[1].forEach(item=>{
                                this.vm.layoutGradeList.push(item);
                            });

                            let layoutGradeList = value[1];

                            let request_layout_sub_grade_data = this.vm.currentLayout_LayoutSubGradeList.map(layoutSubGrade=>{
                                
                                let subGrade_id = layoutSubGrade.parentSubGrade;
                                let grade_id = this.vm.subGradeList.find(item=>{return item.id == subGrade_id}).parentGrade;
                                
                                layoutSubGrade.parentLayoutGrade = layoutGradeList.find(layoutGrade=>{
                                    return layoutGrade.parentGrade == grade_id;
                                }).id;

                                return layoutSubGrade;
                            });

                            this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_sub_grade, request_layout_sub_grade_data).then(
                                value=>{
                                    value.forEach(item=>{
                                        this.vm.layoutSubGradeList.push(item);
                                    })
                                    console.log(value);
                                    alert('Layout Created');
                                    this.vm.resetCurrentLayout();
                                    this.vm.isLoading = false;
                                }
                            );

                        },
                        error=>{

                        }
                    );
                },
                error => {
                    alert('Error');
                    console.log(error);
                }
            );
        }else{
            // Updating the data
            let request_data = this.prepareReturnData();
            request_data['id'] = this.vm.selectedLayout.id;

            // Handle the orderNumber
            this.vm.selectedLayout.layoutExamColumnList.forEach((item,index)=>{
                item.orderNumber = index + 1;
            });


            let request_layout_exam_column_create_data = this.vm.selectedLayout.layoutExamColumnList.filter(
                item=>{
                    return item.id == 0;
                }
            );

            let request_layout_exam_column_update_data = this.vm.selectedLayout.layoutExamColumnList.filter(
                item=>{
                    return item.id != 0;
                }
            );

            let request_layout_grade_create_data = this.vm.currentLayout_LayoutGradeList.filter(item=>{
                return item.id == 0;
            });
            let request_layout_grade_update_data = this.vm.currentLayout_LayoutGradeList.filter(item=>{
                return item.id != 0;
            });

            let service_list = [];
            // layout data
            service_list.push(this.vm.customReportCardService.updateObject(this.vm.customReportCardService.layout, request_data));
            // layout exam column data
            service_list.push(this.vm.customReportCardService.updateObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column_update_data));
            service_list.push(this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column_create_data));
            // layout grade data
            service_list.push(this.vm.customReportCardService.updateObjectList(this.vm.customReportCardService.layout_grade, request_layout_grade_update_data))
            service_list.push(this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_grade, request_layout_grade_create_data))
            
            // layout sub grade data
            Promise.all(service_list).then(
                value=>{
                    console.log(value);
                    // updating layout
                    this.vm.layoutList = this.vm.layoutList.map(item=>{
                        if(value[0].id == item.id) return value[0];
                        return item;
                    });

                    // Updating exams
                    this.vm.layoutExamColumnList = this.vm.layoutExamColumnList.map(layoutExam=>{
                        let new_item = value[1].find(item=>{return item.id == layoutExam.id});
                        if(new_item != undefined) return new_item;
                        return layoutExam;
                    });
                    value[2].forEach(item=>{
                        this.vm.layoutExamColumnList.push(item);
                    });

                    // updating grades
                    this.vm.layoutGradeList = this.vm.layoutGradeList.map(layoutGrade=>{
                        let new_item = value[3].find(item=>{return item.id == layoutGrade.id});
                        if(new_item != undefined) return new_item;
                        return layoutGrade;
                    });
                    value[4].forEach(item=>{
                        this.vm.layoutGradeList.push(item);
                    });


                    let request_layout_sub_grade_create_data = this.vm.currentLayout_LayoutSubGradeList.filter(layoutSubGrade=>{
                        if(layoutSubGrade.id == 0) return true;
                        return false;
                    }).map(layoutSubGrade=>{
                        let grade_id = this.vm.subGradeList.find(item=>{return item.id == layoutSubGrade.parentSubGrade}).parentGrade;

                        layoutSubGrade.parentLayoutGrade = this.vm.layoutGradeList.find(item=>{
                            return item.parentLayout == this.vm.selectedLayout.id && item.parentGrade == grade_id;
                        }).id;
                        return layoutSubGrade;
                    });

                    let request_layout_sub_grade_update_data = this.vm.currentLayout_LayoutSubGradeList.filter(layoutSubGrade=>{
                        return layoutSubGrade.id != 0; 
                    });
                    console.log(request_layout_sub_grade_update_data);
                    Promise.all([
                        this.vm.customReportCardService.updateObjectList(this.vm.customReportCardService.layout_sub_grade,request_layout_sub_grade_update_data),
                        this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_sub_grade,request_layout_sub_grade_create_data),
                    ]).then(
                        value_layout_subGrade=>{
                            console.log(value_layout_subGrade);
                            this.vm.layoutSubGradeList = this.vm.layoutSubGradeList.map(layoutSubGrade=>{
                                let new_item = value_layout_subGrade[0].find(item=>{return item.id == layoutSubGrade.id});
                                if(new_item != undefined) return new_item;
                                return layoutSubGrade;
                            });

                            value_layout_subGrade[1].forEach(item=>{
                                this.vm.layoutSubGradeList.push(item);
                            })
                            alert('Layout Updated');
                            this.vm.resetCurrentLayout();
                            this.vm.isLoading = false;
                        },
                        error=>{

                        }
                    );
                },
                error=>{

                }
            );
        }
    }

    prepareReturnData(){
        return {
                'name': this.vm.selectedLayout.name,
                'reportCardHeading': this.vm.selectedLayout.reportCardHeading,
                'parentSchool': this.vm.user.activeSchool.dbId,
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'showStudentName': this.getOrderNumber('showStudentName'),
                'showFatherName': this.getOrderNumber('showFatherName'),
                'showMotherName': this.getOrderNumber('showMotherName'),
                'showRollNo': this.getOrderNumber('showRollNo'),
                'showScholarNo': this.getOrderNumber('showScholarNo'),
                'showDateOfBirth': this.getOrderNumber('showDateOfBirth'),
                'showDateOfBirthInWords': this.getOrderNumber('showDateOfBirthInWords'),
                'showAadharNumber': this.getOrderNumber('showAadharNumber'),
                'showCategory': this.getOrderNumber('showCategory'),
                'showFamilySSMID': this.getOrderNumber('showFamilySSMID'),
                'showChildSSMID': this.getOrderNumber('showChildSSMID'),
                'showClass': this.getOrderNumber('showClass'),
                'showSection': this.getOrderNumber('showSection'),
                'showCaste': this.getOrderNumber('showCaste'),
                'showAttendanceStartDate': this.getOrderNumber('showAttendanceStartDate'),
                'showAttendanceEndDate': this.getOrderNumber('showAttendanceEndDate'),
                'showRemarks': this.getOrderNumber('showRemarks'),
                'showOverallMarks': this.getOrderNumber('showOverallMarks'),
                'showAttendance': this.getOrderNumber('showAttendance'),
                'showResult': this.getOrderNumber('showResult'),
                'showPercentage': this.getOrderNumber('showPercentage'),
                'showPromotedToClass': this.getOrderNumber('showPromotedToClass'),
            };
    }


}