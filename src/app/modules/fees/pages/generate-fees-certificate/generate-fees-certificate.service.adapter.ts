
import { GenerateFeesCertificateComponent } from './generate-fees-certificate.component';

export class GenerateFeesCertificateServiceAdapter {

    vm: GenerateFeesCertificateComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: GenerateFeesCertificateComponent): void {
        this.vm = vm;
    }

    //initialize data
    initializeData(): void {
        // this.vm.isLoading = true;
    }

}