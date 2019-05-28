
import { GenerateFeesReportComponent } from './generate-fees-report.component';

export class GenerateFeesReportServiceAdapter {

    vm: GenerateFeesReportComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateFeesReportComponent): void {
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
    }

}