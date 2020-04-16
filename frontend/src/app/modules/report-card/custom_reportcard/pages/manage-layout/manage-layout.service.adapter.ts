
import {ManageLayoutComponent} from './manage-layout.component';
import { LayoutSubGradeHandler, LayoutGradeHandler, LayoutExamColumnHandler } from '../../classes/report-card-data';

export class ManageLayoutServiceAdapter {

    vm: ManageLayoutComponent;

    constructor() {}

    initializeAdapter(vm: ManageLayoutComponent): void {
        this.vm = vm;
    }

    //initialize data
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
        const request_student_section_data = {
            parentStudent__parentSchool: this.vm.user.activeSchool.dbId,
            parentSession: this.vm.user.activeSchool.currentSessionDbId,
            korangle__count: '0,1'
        };
        Promise.all([
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout, request_layout_data),
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.gradeService.getObjectList(this.vm.gradeService.grade, request_grade_data),
            this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, request_sub_grade_data),
            this.vm.schoolService.getObjectList(this.vm.schoolService.session, {}),
            this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data),
            this.vm.classService.getObjectList(this.vm.classService.classs, {}),
            this.vm.classService.getObjectList(this.vm.classService.division, {})
        ]).then(value => {
            this.vm.layoutList = value[0];
            this.vm.examinationList = value[1];
            this.vm.gradeList = value[2];
            this.vm.subGradeList = value[3];
            this.vm.sessionList = value[4];
            this.vm.studentSectionList = value[5];
            this.vm.classList = value[6];
            this.vm.divisionList = value[7]
            const request_student_data = {
                id: this.vm.studentSectionList[0].parentStudent,
            }
            this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(value => {
                this.vm.studentList = value;
                this.vm.isLoading = false;
            }, error => {
                this.vm.isLoading = false;
            })
        }, error=>{
                this.vm.isLoading = false;
            }
        );        
    }

    fetchLayoutData = () => {
        this.vm.isLoading = true;
        const request_layout_exam_column = {
            parentLayout: this.vm.currentLayout.id,
            korangle__order: 'orderNumber'
        }
        const request_layout_grade = {
            parentLayout: this.vm.currentLayout.id,
            korangle__order: 'orderNumber'
        }
        const request_layout_sub_grade = {
            parentLayoutGrade__parentLayout: this.vm.currentLayout.id,
            korangle__order: 'orderNumber'
        }
        Promise.all([
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_grade, request_layout_grade),
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column),
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_sub_grade, request_layout_sub_grade),
            
        ]).then(value => {
            console.log(value);
            this.vm.layoutGradeList = value[0];
            this.vm.layoutExamColumnList = value[1];
            this.vm.layoutSubGradeList = value[2];
            this.vm.isLoading = false;
            
        }, error => {
            this.vm.isLoading = false;
        })
    }

    createOrUpdateLayout = () => {
        this.vm.isLoading = true;
        let promise = null;
        if(!this.vm.currentLayout.id){
            promise = this.vm.customReportCardService.createObject(this.vm.customReportCardService.layout, this.vm.currentLayout);
        }else{
            promise = this.vm.customReportCardService.updateObject(this.vm.customReportCardService.layout, this.vm.currentLayout);
        }
        promise.then(layout => {
            this.vm.currentLayout = layout;

            // Handling the LayoutExamColumn
            const exam_column_delete_request_data = {
                parentLayout: this.vm.currentLayout.id
            }
            this.vm.customReportCardService.deleteObjectList(this.vm.customReportCardService.layout_exam_column, exam_column_delete_request_data).then(val => {
                this.vm.layoutExamColumnList.forEach((item, i) => {
                    item.orderNumber = i+1;
                    item.parentLayout = this.vm.currentLayout.id;
                })
                this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_exam_column, this.vm.layoutExamColumnList).then(value => {
                    value.forEach((layout_exam_column, i) => {
                        this.vm.layoutExamColumnList[i] = layout_exam_column;
                    })
                    this.vm.isLoading = false;
                }, error => this.vm.isLoading = false)
            }, error => this.vm.isLoading = false)

            // Handling the LayoutGrades
            const layout_grade_delete_request_data = {
                parentLayout: this.vm.currentLayout.id
            }
            this.vm.customReportCardService.deleteObjectList(this.vm.customReportCardService.layout_grade, layout_grade_delete_request_data).then(val => {
                let promise_arr = [];
                let arr = [];
                this.vm.layoutGradeList.forEach((item, i) => {
                    item.orderNumber = i+1;
                    item.parentLayout = this.vm.currentLayout.id;
                })
                this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_grade, this.vm.layoutGradeList).then(value => {
                    value.forEach((layout_grade, i) => {
                        let promise_arr = [];
                        const layoutSubGradeList = this.vm.getLayoutSubGradeList(this.vm.getGrade(layout_grade.parentGrade));
                        this.vm.layoutSubGradeList = this.vm.layoutSubGradeList.filter(item => !layoutSubGradeList.includes(item));
                        this.vm.layoutGradeList[i] = layout_grade;                        
                        layoutSubGradeList.forEach((layoutSubGrade, j) => {
                            layoutSubGrade.orderNumber = i+1;
                            layoutSubGrade.parentLayoutGrade = layout_grade.id;
                        })
                        this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_sub_grade, layoutSubGradeList).then(value => {
                            value.forEach((layout_sub_grade, j) => {
                                this.vm.layoutSubGradeList.push(layout_sub_grade);
                            })
                            this.vm.isLoading = false;
                        }, error => this.vm.isLoading = false)
                    })
                }, error => this.vm.isLoading = false)
            }, error => this.vm.isLoading = false)
        }, error => {
            this.vm.isLoading = false;
        })
    }

    deleteLayout = () => {
        if(!confirm('Are you sure you want to delete this layout?'))return;
        this.vm.isLoading = true;
        this.vm.customReportCardService.deleteObject(this.vm.customReportCardService.layout, this.vm.currentLayout).then(value => {
            this.vm.currentLayout = this.vm.getEmptyLayout();      
            this.vm.layoutSubGradeList = [];
            this.vm.layoutExamColumnList = [];
            this.vm.layoutGradeList = [];
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        })
    }


    

}