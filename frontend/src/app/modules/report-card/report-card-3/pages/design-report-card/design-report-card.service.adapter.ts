import { DesignReportCardComponent } from './design-report-card.component';
import { CommonFunctions } from '@classes/common-functions.ts';

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
        this.vm.htmlAdapter.isLoading = true;
        Promise.all([
            this.vm.reportCardService.getObjectList(this.vm.reportCardService.report_card_layout_new, report_card_layouts_data)
        ]).then(value => {
            console.log('Fetched Data: ', value);
            console.log('report card layouts data: ', value[0]);
            
            this.vm.reportCardLayoutList = value[0];

            this.vm.htmlAdapter.isLoading = false;
        }).catch(err => {
            this.vm.htmlAdapter.isLoading = false;
        })
    }

    uploadCurrentLayout() {
        const layoutToUpload = { ...this.vm.currentLayout, content: JSON.stringify(this.vm.currentLayout.content) };
        if (layoutToUpload.id) {
            return this.vm.reportCardService.updateObject(this.vm.reportCardService.report_card_layout_new, layoutToUpload).then(savedLayout => {
                let indexOfSavedLayoutInReportCardLayoutList = this.vm.reportCardLayoutList.findIndex(layout => layout.id == savedLayout.id);
                this.vm.reportCardLayoutList[indexOfSavedLayoutInReportCardLayoutList] = savedLayout;
            })
        }
        else {
            return this.vm.reportCardService.createObject(this.vm.reportCardService.report_card_layout_new, layoutToUpload).then(savedLayout => {
                savedLayout.id = parseInt(savedLayout.id);
                console.log('created Object: ', savedLayout);
                this.vm.currentLayout.id = savedLayout.id;
                this.vm.reportCardLayoutList.push(savedLayout);
            })
        }
    }

    uploadImageForCurrentLayout(image, file_name) {
        let formdata = new FormData();
        formdata.append('parentLayout', this.vm.currentLayout.id);
        formdata.append('image', image, file_name);
        return this.vm.reportCardService.createObject(this.vm.reportCardService.image_assets, formdata).then(response => response.image);
    }
}



