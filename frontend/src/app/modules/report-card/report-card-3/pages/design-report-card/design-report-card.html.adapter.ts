import { DesignReportCardComponent } from './design-report-card.component';

export class DesignReportCardHtmlAdapter {

    vm: DesignReportCardComponent;
    canvasMargin = 24;

    activeLeftColumn: string = 'layers';

    constructor() {}

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {
        this.vm = vm;
    }

    canvasSetUp():void {
        let canvasWrapper = document.getElementById('canvasWrapper');
        let computedCavasWidth = canvasWrapper.getBoundingClientRect().width - 2*this.canvasMargin;
        this.vm.canvas.width = computedCavasWidth;
    }

}

