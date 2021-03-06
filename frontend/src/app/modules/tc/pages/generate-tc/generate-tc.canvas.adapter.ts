import { GenerateTCComponent } from './generate-tc.component';
import { CanvasAdapterBase } from './../../class/canvas.adapter'
import {
    CanvasAdapterInterface
} from './../../class/constants';
  


export class GenerateTCCanvasAdapter extends CanvasAdapterBase implements CanvasAdapterInterface{

    vm: GenerateTCComponent;

    dpi: number = 150;

    extraFields: {
        isLeavingSchoolBecasue: string,
        issueDate: string,
        leavingDate: string,
    } = {
            isLeavingSchoolBecasue: 'N/A',
            issueDate: null,
            leavingDate: null,
        };
 

    constructor() {
        super();

        Object.defineProperty(this, 'currentLayout', {
            get: function () {
                return this.vm.selectedLayout;   // // reference to vm.currentLayout and there is no setter function
            }
        });

        Object.defineProperty(this, 'DATA', {
            get: function () {
                return {...this.extraFields, ...this.vm.DATA };    // reference to vm.DATA and there is no setter function
            }
        });
    }

    initilizeAdapter(vm: GenerateTCComponent) {
        this.vm = vm;
    }

    async downloadPDF(doc:any) { 
        await this.scheduleCanvasReDraw(0); // ensuring that all the images are loaded
        doc.addPage([this.virtualCanvas.width, this.virtualCanvas.height]);
        let dataurl = this.virtualCanvas.toDataURL('image/jpeg', 1.0)
        doc.addImage(dataurl, 'JPEG', 0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
        return;
    }
}
