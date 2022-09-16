import { GenerateReportCardComponent } from './generate-report-card.component';
import { CanvasAdapterBase } from './../../class/canvas.adapter';
import { CanvasAdapterInterface } from './../../class/constants_3';

export class GenerateReportCardCanvasAdapter extends CanvasAdapterBase implements CanvasAdapterInterface {
    vm: GenerateReportCardComponent;

    dpi: number = 150;

    constructor() {
        super();

        Object.defineProperty(this, 'currentLayout', {
            get: function () {
                return this.vm.selectedLayout; // // reference to vm.currentLayout and there is no setter function
            },
        });

        Object.defineProperty(this, 'DATA', {
            get: function () {
                return this.vm.DATA; // reference to vm.DATA and there is no setter function
            },
        });
    }

    initilizeAdapter(vm: GenerateReportCardComponent) {
        this.vm = vm;
    }

    async downloadPDF(doc: any) {
        await this.scheduleCanvasReDraw(0); // ensuring that all the images are loaded
        doc.addPage([this.virtualCanvas.width, this.virtualCanvas.height]);
        let dataurl = this.virtualCanvas.toDataURL('image/jpeg', 1.0);
        doc.addImage(dataurl, 'JPEG', 0, 0, this.virtualCanvas.width, this.virtualCanvas.height);

        console.log(doc);
        return;
    }
}
