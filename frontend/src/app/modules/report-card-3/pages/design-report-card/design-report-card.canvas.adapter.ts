import { DesignReportCardComponent } from './design-report-card.component';
import { CanvasAdapterHTMLMixin } from './../../class/canvas.adapter';

import {
    CanvasAdapterInterface,
    CanvasImage,
    CanvasText,
    CanvasDate,
    Formula,
    Result,
    CanvasTable,
    CanvasLine,
    CanvasRectangle,
    CanvasSquare,
    CanvasCircle,
    CanvasRoundedRectangle,
} from './../../class/constants_3';

import * as jsPDF from 'jspdf';

export class DesignReportCardCanvasAdapter extends CanvasAdapterHTMLMixin implements CanvasAdapterInterface {
    vm: DesignReportCardComponent;

    constructor() {
        super();
        // console.log('canvas Adapter: ', this);
        Object.defineProperty(this, 'currentLayout', {
            get: function () {
                return this.vm.currentLayout; // // reference to vm.currentLayout and there is no setter function
            },
        });

        Object.defineProperty(this, 'DATA', {
            get: function () {
                return this.vm.DATA; // reference to vm.DATA and there is no setter function
            },
        });
    }

    initilizeAdapter(vm: DesignReportCardComponent) {
        this.vm = vm;
    }

    maximumCanvasSize(): any {
        return this.actualresolution.getHeightInPixel(this.dpi) * 2;
    }

    minimumCanvasSize(): any {
        return this.actualresolution.getHeightInPixel(this.dpi) * 0.1;
    }

    removeSchoolSpecificDataFromLayout(layoutContent: any[]): any[] {
        layoutContent = JSON.parse(JSON.stringify(layoutContent));
        for (let i = 0; i < layoutContent.length; i++) {
            layoutContent[i].layers = layoutContent[i].layers.map((layer) => {
                switch (layer.LAYER_TYPE) {
                    case 'GRADE':
                        layer.parentExamination = null;
                        layer.subsubGradeId = null;
                        layer.error = true;
                        break;
                    case 'REMARK':
                        layer.parentExamination = null;
                        layer.error = true;
                        break;
                    case 'MARKS':
                        layer.parentExamination = null;
                        layer.error = true;
                        break;
                }
                return layer;
            });
        }
        return layoutContent;
    }

    downloadPDF() {
        // do not scale the canvas and block the user, use generate report card canvas adapter infrastructure to do this in background
        let actualCanavsWidth = this.canvasWidth,
            actualCanavsHeight = this.canvasHeight;
        let fullWidth = this.actualresolution.getWidthInPixel(this.dpi);
        let fullHeight = this.actualresolution.getHeightInPixel(this.dpi);

        this.vm.htmlAdapter.isSaving = true;
        this.metaDrawings = false;
        this.canvasSizing(fullHeight, fullWidth, true);
        setTimeout(() => {
            let doc = new jsPDF({ orientation: this.actualresolution.orientation, unit: 'pt', format: [this.canvasHeight, this.canvasWidth] });
            let dataurl = this.canvas.toDataURL('image/jpeg', 1.0);
            doc.addImage(dataurl, 'JPEG', 0, 0, this.canvasWidth, this.canvasHeight);
            doc.save(this.vm.currentLayout.name + '.pdf');
            this.metaDrawings = true;
            this.canvasSizing(actualCanavsHeight, actualCanavsWidth, true);
            this.vm.htmlAdapter.isSaving = false;
        }, 1000); // bad design of waiting for canvas loading
    }

    newImageLayer(initialParameters: object = {}): CanvasImage {
        let canvasImage = new CanvasImage(initialParameters, this);
        this.newLayerInitilization(canvasImage);
        return canvasImage;
    }

    newTextLayer(initialParameters: object = {}): CanvasText {
        let canvasText = new CanvasText(initialParameters, this);
        this.newLayerInitilization(canvasText);
        return canvasText;
    }

    newDateLayer(initialParameters: object = {}): CanvasDate {
        let canvasDate = new CanvasDate(initialParameters, this);
        this.newLayerInitilization(canvasDate);
        return canvasDate;
    }

    newLineLayer(initialParameters: object = {}): CanvasLine {
        let canvasShape = new CanvasLine(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newRectangleLayer(initialParameters: object = {}): CanvasRectangle {
        let canvasShape = new CanvasRectangle(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newSquareLayer(initialParameters: object = {}): CanvasSquare {
        let canvasShape = new CanvasSquare(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newCircleLayer(initialParameters: object = {}): CanvasCircle {
        let canvasShape = new CanvasCircle(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newRoundedRectangleLayer(initialParameters: object = {}): CanvasRoundedRectangle {
        let canvasShape = new CanvasRoundedRectangle(initialParameters, this);
        this.newLayerInitilization(canvasShape);
        return canvasShape;
    }

    newFormulaLayer(initialParameters: object = {}): Formula {
        let canavsFormula = new Formula(initialParameters, this);
        this.newLayerInitilization(canavsFormula);
        return canavsFormula;
    }

    newReultLayer(initialParameters: object = {}): Result {
        let result = new Result(initialParameters, this);
        this.newLayerInitilization(result);
        return result;
    }

    newTableLayer(initialParameters: object = {}): CanvasTable {
        let canavsTable = new CanvasTable(initialParameters, this);
        this.newLayerInitilization(canavsTable);
        return canavsTable;
    }
}
