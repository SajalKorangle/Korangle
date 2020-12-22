import { DesignReportCardComponent } from './design-report-card.component';

export class DesignReportCardServiceAdapter {

    vm: DesignReportCardComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {
        this.vm = vm;
    }

    // initialize data
    initializeData(): void {
        const report_card_layouts_data = {
            parentSchool: this.vm.user.activeSchool.dbId
        };
        this.vm.isLoading = true;
        Promise.all([
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout_new, report_card_layouts_data)
        ]).then(value => {
            console.log('Fetched Data: ', value);
            console.log('report card layouts data: ', value[0]);
            
            this.vm.reportCardLayoutList = value[0];

            this.vm.isLoading = false;
        }).catch(err => {
            this.vm.isLoading = false;
        })
    }
}



