
import {GenerateFinalReportComponent} from './generate-final-report.component';

export class GenerateFinalReportServiceAdapter {

    vm: GenerateFinalReportComponent;

    constructor() {}

    initializeAdapter(vm: GenerateFinalReportComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
    	
    	this.vm.isLoading = true;

    	let request_class_data = {
        	'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_division_data = {
        	'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_layout_data = {
    		'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_class_layout_data = {
    		'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_layout_exam_column_data = {
    		'parentLayout__parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentLayout__parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_layout_grade_data = {
    		'parentLayout__parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentLayout__parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_layout_sub_grade_data = {
    		'parentLayoutGrade__parentLayout__parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentLayoutGrade__parentLayout__parentSchool': this.vm.user.activeSchool.dbId,
    	};

    	let request_grade_data = {
    		'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_sub_grade_data = {
    		'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_examination_data = {
    		'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
    	};

    	let request_test_second_data = {
    		'parentExamination__parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentExamination__parentSchool': this.vm.user.activeSchool.dbId,
    	};
    	let request_student_section_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentStudent__parentSchool': this.vm.user.activeSchool.dbId,
            'parentStudent__parentTransferCertificate': 'null__korangle',
    	};
    	
    	Promise.all([
    		this.vm.classService.getObjectList(this.vm.classService.classs,request_class_data),
    		this.vm.classService.getObjectList(this.vm.classService.division,request_division_data),
    		this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout, request_layout_data),
    		this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.class_layout, request_class_layout_data),
    		this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column_data),
    		this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_grade, request_layout_grade_data),
    		this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_sub_grade, request_layout_sub_grade_data),
    		this.vm.gradeService.getObjectList(this.vm.gradeService.grade, request_grade_data),
    		this.vm.gradeService.getObjectList(this.vm.gradeService.sub_grade, request_sub_grade_data),
    		this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
    		this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_second_data),
    		this.vm.studentService.getObjectList(this.vm.studentService.student_section, request_student_section_data),
    		this.vm.subjectService.getObjectList(this.vm.subjectService.subject, {}),
		]).then(
    		value=>{
    			console.log(value);

    			// class
    			this.vm.classList = value[0];
    			this.vm.divisionList = value[1];

    			// custom report card
    			this.vm.layoutList = value[2];
    			this.vm.classLayoutList = value[3];
    			this.vm.layoutExamColumnList = value[4];
    			this.vm.layoutGradeList = value[5];
    			this.vm.layoutSubGradeList = value[6];

    			// grade
    			this.vm.gradeList = value[7];
    			this.vm.subGradeList = value[8];

    			// examination
    			this.vm.examinationList = value[9];
    			this.vm.testSecondList = value[10];

    			// student
    			this.vm.studentSectionList = value[11];

    			//subject
    			this.vm.subjectList = value[12];

    			// Student Data
		    	let request_student_data = {
		            'id__in': this.vm.studentSectionList.map(item=>{
		            	return item.parentStudent;
		            }),
		    	};

		    	this.vm.studentService.getObjectList(this.vm.studentService.student, request_student_data).then(
		    		student_value=>{

		    			this.vm.studentList = student_value;

              this.vm.populateClassSectionList();
    					this.vm.isLoading = false;
    				},
		    		error=>{
    					this.vm.isLoading = false;
		    		}
	    		);


    		},
    		error=>{
    			this.vm.isLoading = false;
    		},
		);

    }
    

    // Generating report card
    generateReportCard(){
      if(this.vm.selectedStudentList.length == 0){
        alert('Please select students');
        return;
      }

      this.vm.isLoading = true;

      let data = {};
      data['selectedStudentList'] = this.vm.selectedStudentList;
      data['studentSectionList'] = this.vm.studentSectionList.filter(studentSection=>{
        return this.vm.selectedStudentList.find(item=>{return item.id == studentSection.parentStudent}) != undefined;
      });
      data['gradeList'] = this.vm.gradeList;
      data['subGradeList'] = this.vm.subGradeList;
      
      let layout_id = this.vm.classLayoutList.find(item=>{return item.parentClass == this.vm.selectedClass.id}).parentLayout;
      data['layout'] = this.vm.layoutList.find(item=>{return item.id == layout_id});
      

      data['layoutExamColumnList'] = this.vm.layoutExamColumnList.filter(item=>{
        return item.parentLayout == layout_id;
      }).sort((a,b)=>{return a.orderNumber - b.orderNumber});

      data['layoutGradeList'] = this.vm.layoutGradeList.filter(item=>{
        return item.parentLayout == layout_id;
      }).sort((a,b)=>{return a.orderNumber - b.orderNumber});

      data['layoutSubGradeList'] = this.vm.layoutSubGradeList.filter(item=>{
        if(data['layoutGradeList'].find(item1=>{return item1.id == item.parentLayoutGrade}) != undefined) return true;
        return false;
      }).sort((a,b)=>{return a.orderNumber - b.orderNumber});

      data['examinationList'] = this.vm.examinationList;

      data['selectedClass'] = this.vm.selectedClass;
      data['selectedDivision'] = this.vm.selectedDivision;

      data['subjectList'] = this.vm.subjectList;

      let request_class_subject_data = {
        'parentClass': this.vm.selectedClass.id,
        'parentDivision': this.vm.selectedDivision.id,
        'parentSchool': this.vm.user.activeSchool.dbId,
        'parentSession': this.vm.user.activeSchool.currentSessionDbId,
      };

      let request_test_second_data = {
        'parentClass':this.vm.selectedClass.id,
        'parentDivision':this.vm.selectedDivision.id,
        'parentExamination__in':data['layoutExamColumnList'].map(item=>{return item.parentExamination;}),
      };

      let request_student_test_data = {
        'parentStudent__in': this.vm.selectedStudentList.map(item=>{return item.id}),
        'parentExamination__in': data['layoutExamColumnList'].map(item=>{return item.parentExamination;}), 
      };

      let request_student_subject_data = {
        'parentSession':this.vm.user.activeSchool.currentSessionDbId,
        'parentStudent__in':this.vm.selectedStudentList.map(item=>{return item.id}).join(),
      };

      let request_student_sub_grade_data = {
        'parentSubGrade__in': data['layoutSubGradeList'].map(item=>{return item.parentSubGrade}).join(),
        'parentStudent__in': this.vm.selectedStudentList.map(item=>{return item.id}).join(),
      };

      let request_student_remarks_data = {
        'parentStudent__in': this.vm.selectedStudentList.map(item=>{return item.id}).join(),
        'parentSession':this.vm.user.activeSchool.currentSessionDbId,
      };

      let request_class_teacher_signature_data = {
        'parentSchool':this.vm.user.activeSchool.dbId,
        'parentClass':this.vm.selectedClass.id,
        'parentDivision':this.vm.selectedDivision.id,
      };

      let request_session_data = {
        'id':this.vm.user.activeSchool.currentSessionDbId,
      }

      let service_list = [
        this.vm.subjectService.getObjectList(this.vm.subjectService.class_subject, request_class_subject_data),
        this.vm.examinationService.getObjectList(this.vm.examinationService.test_second, request_test_second_data),
        this.vm.examinationService.getObjectList(this.vm.examinationService.student_test, request_student_test_data),
        this.vm.subjectService.getObjectList(this.vm.subjectService.student_subject, request_student_subject_data),
        this.vm.gradeService.getObjectList(this.vm.gradeService.student_sub_grade, request_student_sub_grade_data),
        this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.student_remarks, request_student_remarks_data),
        this.vm.classService.getObjectList(this.vm.classService.class_teacher_signature,request_class_teacher_signature_data),
        this.vm.schoolService.getObjectList(this.vm.schoolService.session,request_session_data),
      ];

      if(data['layout'].attendanceOrderNumber != 0 && 
          data['layout'].attendanceStartDate != null && 
          data['layout'].attendanceEndDate != null){

        let request_student_attendance_data = {
          'parentStudent__in': this.vm.selectedStudentList.map(item=>{return item.id}).join(),
          'dateOfAttendance__gte':data['layout'].attendanceStartDate,
          'dateOfAttendance__lte':data['layout'].attendanceEndDate,
        };
        service_list.push(this.vm.attendanceService.getObjectList(this.vm.attendanceService.student_attendance, request_student_attendance_data));
      }

      Promise.all(service_list).then(
        value=>{
          console.log(value);

          data['classSubjectList'] = value[0];
          data['testSecondList'] = value[1];
          data['studentTestList'] = value[2];
          data['studentSubjectList'] = value[3];
          data['studentSubGradeList'] = value[4];
          data['studentRemarkList'] = value[5];
          data['classTeacherSignature'] = value[6];
          data['session'] = value[7][0];


          data['studentAttendanceList'] = [];
          if(value.length == 9){
            data['studentAttendanceList'] = value[8];
          }
          alert('This may take some time');
          this.vm.printReportCard(data);
          this.vm.isLoading = false;
        },
        error=>{}
      );

    }
}
