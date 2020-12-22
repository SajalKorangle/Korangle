import { DesignReportCardComponent } from './design-report-card.component';

export class DesignReportCardHtmlAdapter {

    vm: DesignReportCardComponent;

    constructor() {}

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {
        this.vm = vm;
    }

}

