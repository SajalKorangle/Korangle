
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
    updateOrderNumber(){
        if(this.vm.selectedLayout == null || this.vm.selectedLayout == undefined) return;

        this.vm.selectedLayout.selectedStudentDetailsHeader.forEach((key,index)=>{
            this.vm.selectedLayout.layout[key] = index+1;
        });

    }

    createNewLayout(){
        if(this.vm.selectedLayout == null || this.vm.selectedLayout == undefined) return;
        if(this.vm.selectedLayout.layout.id != 0) return;

        if(this.vm.selectedLayout.layout.name == '' || this.vm.isNameUnqiue(this.vm.selectedLayout, this.vm.layoutList) == false){
            alert('Layout Name must be unique and not empty');
            return;
        }

        this.updateOrderNumber();
        this.vm.isLoading = true;

        let request_data = this.vm.selectedLayout.layout;
        Object.keys(request_data).forEach(key=>{
            if(typeof request_data[key] == 'number' && request_data[key] == 0){
                delete request_data[key];
            }
            if(typeof request_data[key] == 'string' && request_data[key] == ''){
                delete request_data[key];
            }
        });

        this.vm.customReportCardService.createObject(this.vm.customReportCardService.layout,request_data).then(
            value=>{
                console.log(value);
                this.vm.selectedLayout.layout.id = value.id;
                this.vm.layoutList.push(value);
                
                this.vm.selectedLayout.layoutExamColumnList.forEach(item=>{
                    this.vm.layoutExamColumnList.push(item);
                });

                this.vm.selectedLayout.layoutGradeList.forEach(item=>{
                    this.vm.layoutGradeList.push(item);
                });

                this.vm.selectedLayout.layoutSubGradeList.forEach(item=>{
                    this.vm.layoutSubGradeList.push(item);
                });

                this.createLayoutExamColumnsAndLayoutGrades();
                
            },
            error => {
                this.vm.isLoading = false;
            }
        );

    }


    // Updating or saving a new layout
    updateLayout(){
        if(this.vm.selectedLayout == null || this.vm.selectedLayout == undefined) return;
        
        // Check if name is unique
        if(this.vm.selectedLayout.layout.name == '' || this.vm.isNameUnqiue(this.vm.selectedLayout, this.vm.layoutList) == false){
            alert('Layout Name must be unique and not empty');
            return;
        }
        
        this.updateOrderNumber();
        this.vm.isLoading = true;

        let request_data = this.vm.selectedLayout.layout;

        let service_list = [];

        service_list.push(this.vm.customReportCardService.updateObject(this.vm.customReportCardService.layout, request_data));

        // Delete existing layout exams columns data
        let request_layout_exam_column_delete_data = this.vm.layoutExamColumnList.filter(item=>{
            return item.parentLayout == this.vm.selectedLayout.layout.id;
        });
        if(request_layout_exam_column_delete_data.length != 0){
            service_list.push(this.vm.customReportCardService.deleteObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column_delete_data))
        }

        // Delete existing layout grade data
        // Deleting this will also delete the layout sub grade data because of cascade property
        let request_layout_grade_delete_data = this.vm.layoutGradeList.filter(item=>{
            return item.parentLayout == this.vm.selectedLayout.layout.id;
        });

        if(request_layout_grade_delete_data.length != 0){
            service_list.push(this.vm.customReportCardService.deleteObjectList(this.vm.customReportCardService.layout_grade, request_layout_grade_delete_data))
        }


        Promise.all(service_list).then(
            value=>{

                // Sync the data
                this.vm.layoutExamColumnList = this.vm.layoutExamColumnList.filter(item=>{
                    return item.parentLayout != this.vm.selectedLayout.layout.id;
                });

                this.vm.layoutGradeList = this.vm.layoutGradeList.filter(item=>{
                    return item.parentLayout != this.vm.selectedLayout.layout.id;
                });

                this.createLayoutExamColumnsAndLayoutGrades();
            },
            error=>{
                this.vm.isLoading = false;
            }
        );


        return;
          
    }

    createLayoutExamColumnsAndLayoutGrades(){

        // Handle  the orderNumber
        this.vm.selectedLayout.layoutExamColumnList.forEach((item, index)=>{
            item.orderNumber = index + 1;
            item.id = 0;
            item.parentLayout = this.vm.selectedLayout.layout.id;
        });

        this.vm.selectedLayout.layoutGradeList.forEach((item, index)=>{
            item.orderNumber = index + 1;
            item.id = 0;
            item.parentLayout = this.vm.selectedLayout.layout.id;
        });

        let request_layout_exam_column_create_data = this.vm.selectedLayout.layoutExamColumnList;
        let request_layout_grade_create_data = this.vm.selectedLayout.layoutGradeList;

        Promise.all([
            this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_exam_column,request_layout_exam_column_create_data),
            this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_grade,request_layout_grade_create_data),
        ]).then(
            value=>{


                // Sync with the list present here
                value[0].forEach(item=>{
                    this.vm.layoutExamColumnList.push(item);
                    this.vm.selectedLayout.layoutExamColumnList.forEach(layoutExam=>{
                        if(layoutExam.parentExamination == item.parentExamination && layoutExam.parentLayout == item.parentLayout){
                            layoutExam.id = item.id;
                        }
                    });
                });

                value[1].forEach(item=>{
                    this.vm.layoutGradeList.push(item);
                    this.vm.selectedLayout.layoutGradeList.forEach(layoutGrade=>{
                        if(layoutGrade.parentGrade == item.parentGrade && layoutGrade.parentLayout == item.parentLayout){
                            layoutGrade.id = item.id;
                        }
                    });
                });

                this.createLayoutSubGrades(value[1]);

            },
            error=>{

            }
        );


    }

    createLayoutSubGrades(layoutGradeList){
        if(layoutGradeList.length == 0 || this.vm.selectedLayout.layoutSubGradeList.length == 0){
            this.vm.resetCurrentLayout();
            alert('Task successfull');
            this.vm.isLoading = false;

            return;
        }

        let request_layout_sub_grade_create_data = this.vm.selectedLayout.layoutSubGradeList.map((layoutSubGrade, index)=>{
            
            layoutSubGrade.id = 0;

            let subGrade_id = layoutSubGrade.parentSubGrade;
            let grade_id = this.vm.subGradeList.find(item=>{return item.id == subGrade_id}).parentGrade;
            let layoutGrade = layoutGradeList.find(item=>{
                return item.parentGrade == grade_id && item.parentLayout == this.vm.selectedLayout.layout.id;
            });

            layoutSubGrade.parentLayoutGrade = layoutGrade.id;

            layoutSubGrade.orderNumber = index+1;

            return layoutSubGrade;
        });

        this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_sub_grade, request_layout_sub_grade_create_data).then(
            value=>{


                // Sync with the list present here
                this.vm.selectedLayout.layoutSubGradeList.forEach(layoutSubGrade=>{
                    layoutSubGrade.id = value.find(item=>{
                        return item.parentSubGrade == layoutSubGrade.parentSubGrade && item.parentLayoutGrade == layoutSubGrade.parentLayoutGrade;
                    }).id;                    
                });

                this.vm.resetCurrentLayout();
                alert('Task successfull');
                this.vm.isLoading = false; 
            },
            error=>{

            }
        );
    }


}