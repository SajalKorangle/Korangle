
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

    //initialize data
    initializeData(): void {

        let examination_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        let report_card_mapping_data = {
            'parentSchool': this.vm.user.activeSchool.dbId,
            'parentSession': this.vm.user.activeSchool.currentSessionDbId,
        };

        this.vm.isLoading = true;

        Promise.all([
            this.vm.examinationOldService.getObjectList(this.vm.examinationOldService.examination, examination_data),
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.term, ''),
            this.vm.reportCardCbseService.getObjectList(this.vm.reportCardCbseService.report_card_mapping, report_card_mapping_data),
        ]).then(value => {

            console.log(value);
            this.vm.examinationList = value[0];
            this.vm.termList = value[1];
            this.populateReportCardMapping(value[2]);
            // this.vm.reportCardMapping = value[2];

            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    populateReportCardMapping(reportCardMappingList: any): any {
        if (reportCardMappingList.length != 0) {
            this.vm.reportCardMappingList = reportCardMappingList;
        } else {
            this.vm.termList.forEach(term => {
                let reportCardMapping = {
                    'parentTerm': term.id,
                    'parentSession': this.vm.user.activeSchool.currentSessionDbId,
                    'parentSchool': this.vm.user.activeSchool.dbId,
                    'parentExaminationPeriodicTest': null,
                    'parentExaminationNoteBook': null,
                    'parentExaminationSubEnrichment': null,
                    'parentExaminationFinalTerm': null,
                    'attendanceStartDate': null,
                    'attendanceEndDate': null,
                };
                this.vm.reportCardMappingList.push(reportCardMapping);
            });
        }
        console.log(this.vm.reportCardMappingList);
    }

    // Create Report Card Mapping
    createReportCardMapping(): void {

        this.vm.isLoading = true;

        this.vm.reportCardCbseService.createObjectList(this.vm.reportCardCbseService.report_card_mapping, this.vm.reportCardMappingList).then(value => {
            alert('Report Card set successfully');
            this.vm.reportCardMappingList = value;
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

    // Update Report Card Mapping
    updateReportCardMapping(): void {

        this.vm.isLoading = true;

        this.vm.reportCardCbseService.updateObjectList(this.vm.reportCardCbseService.report_card_mapping, this.vm.reportCardMappingList).then(value => {
            alert('Report Card updated successfully');
            this.vm.isLoading = false;
        }, error => {
            this.vm.isLoading = false;
        });

    }

}