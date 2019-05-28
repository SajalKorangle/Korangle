
import { GenerateFeesCertificateComponent } from './generate-fees-certificate.component';

export class GenerateFeesCertificateServiceAdapter {

    vm: GenerateFeesCertificateComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateFeesCertificateComponent): void {
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