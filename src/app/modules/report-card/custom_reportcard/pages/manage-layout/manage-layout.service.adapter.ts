
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
        
        Promise.all([
            this.vm.examinationService.getObjectList(this.vm.examinationService.examination, request_examination_data),
            this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout,request_layout_data),
        ]).then(
            value=>{
                this.vm.examinationList = value[0];
                if(value[0].length == 0){
                    return;
                }
                this.vm.layoutList = value[1];

                // Get the LayoutExamColumn data
                let request_layout_exam_column_data = {
                    'parentLayout__in': this.vm.layoutList.map(item=>{return item.id}).join(),
                }
                this.vm.customReportCardService.getObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column_data).then(
                    layout_exam_column_value=>{
                        this.vm.layoutExamColumnList = layout_exam_column_value;
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

        if(this.vm.selectedLayout.id == 0){
            let request_data = this.prepareReturnData();
            this.vm.customReportCardService.createObject(this.vm.customReportCardService.layout,request_data).then(
                value=>{
                    console.log(value);

                    let request_layout_exam_data = this.vm.selectedLayout.layoutExamColumnList.map((item, index)=>{
                        item.parentLayout = value.id;
                        item.orderNumber = index +1;
                        return item;
                    });

                    console.log(request_layout_exam_data);
                    this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_data).then(
                        layout_exam_column_value=>{
                            console.log(layout_exam_column_value);
                            alert('Layout Created');
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
            let service_list = [];
            service_list.push(this.vm.customReportCardService.updateObject(this.vm.customReportCardService.layout, request_data));
            service_list.push(this.vm.customReportCardService.createObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column_create_data));
            service_list.push(this.vm.customReportCardService.updateObjectList(this.vm.customReportCardService.layout_exam_column, request_layout_exam_column_update_data));

            Promise.all(service_list).then(
                value=>{
                    console.log(value);
                    alert('Layout Updated');
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