
import {SetFinalReportComponent} from './set-final-report.component';

export class SetFinalReportServiceAdapter {

    vm: SetFinalReportComponent;

    constructor() {}

    // Data
    reportCardMapping: any;
    examinationList: any;

    initializeAdapter(vm: SetFinalReportComponent): void {
        this.vm = vm;
    }

    copyObject(object: any): any {
        let tempObject = {};
        Object.keys(object).forEach(key => {
            tempObject[key] = object[key];
        });
        return tempObject;
    }

    //initialize data
    initializeData(): void {
        this.vm.isLoading = true;

        let request_examination_data = {
            'sessionId': this.vm.user.activeSchool.currentSessionDbId,
            'schoolId': this.vm.user.activeSchool.dbId,
        };

        let request_report_card_mapping_data = {
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
            'parentSchool': this.vm.user.activeSchool.dbId,
        };

        Promise.all([
            this.vm.examinationService.getExaminationList(request_examination_data, this.vm.user.jwt),
            this.vm.examinationService.getMpBoardReportCardMapping(request_report_card_mapping_data, this.vm.user.jwt),
        ]).then(value => {
            this.examinationList = value[0];
            this.vm.examinationList = value[0];
            this.reportCardMapping = value[1];
            this.populateReportCardMapping();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateReportCardMapping(): any {
        if (this.reportCardMapping) {
            this.vm.reportCardMapping = this.reportCardMapping;
            this.vm.newReportCardMapping = this.copyObject(this.vm.reportCardMapping);
        } else {
            let tempItem = {
                'id': null,
                'parentSchool': this.vm.user.activeSchool.dbId,
                'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                'parentExaminationJuly': null,
                'parentExaminationAugust': null,
                'parentExaminationSeptember': null,
                'parentExaminationOctober': null,
                'parentExaminationHalfYearly': null,
                'parentExaminationDecember': null,
                'parentExaminationJanuary': null,
                'parentExaminationFebruary': null,
                'parentExaminationFinal': null,
                'parentExaminationProject': null,
                'reportCardType': null,
            };
            this.vm.reportCardMapping = tempItem;
            this.vm.newReportCardMapping = this.copyObject(this.vm.reportCardMapping);
        }
    }

    // Create Report Card Mapping
    createReportCardMapping(): void {

        let data = this.vm.newReportCardMapping;

        this.vm.isLoading = true;

        this.vm.examinationService.createMpBoardReportCardMapping(data, this.vm.user.jwt).then(value => {
            alert('Report Card set successfully');
            this.reportCardMapping = value;
            this.populateReportCardMapping();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    // Update Report Card Mapping
    updateReportCardMapping(): void {

         let data = this.vm.newReportCardMapping;

        this.vm.isLoading = true;

        this.vm.examinationService.updateMpBoardReportCardMapping(data, this.vm.user.jwt).then(value => {
            alert('Report Card set successfully');
            this.reportCardMapping = value;
            this.populateReportCardMapping();
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

}