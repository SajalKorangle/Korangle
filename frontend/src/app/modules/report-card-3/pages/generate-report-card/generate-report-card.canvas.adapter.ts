import { GenerateReportCardComponent } from './generate-report-card.component';

import {
    DEFAULT_BACKGROUND_COLOR,
    Layer, CanvasImage, CanvasText,
    CanvasDate,
    Formula,
    PageResolution,
    PAGE_RESOLUTIONS,
    Result,
    GradeRule,
    CanvasTable,
    BaseLayer,
    getStructeredPageResolution,
    AttendanceLayer,
    GradeLayer,
    RemarkLayer,
    MarksLayer,
    DPI_LIST,
    CanvasLine,
    CanvasRectangle,
    CanvasSquare,
    CanvasCircle,
    CanvasRoundedRectangle,
    GradeRuleSet,
} from './../../class/constants_3';



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
  


export class GenerateReportCardCanvasAdapter {

    vm: GenerateReportCardComponent;

    virtualCanvas: HTMLCanvasElement;
    virtualContext: CanvasRenderingContext2D;

    actualresolution: PageResolution = PAGE_RESOLUTIONS[1] // A4 size by default
    dpi: number = DPI_LIST[4];
 

    layers: Array<Layer> = [];  // layers in thier order from back to front

    activePageIndex: number = 0;

    gradeRuleSetList: Array<GradeRuleSet> = [];

    backgroundColor: string = null;

    virtualPendingReDrawId: any;
    layersFullyDrawn: boolean = false;

    constructor() {
    }

    initilizeAdapter(vm: GenerateReportCardComponent) {
        this.vm = vm;
        this.virtualCanvas = document.createElement('canvas');
        this.virtualContext = this.virtualCanvas.getContext('2d');
        console.log('virtual canvas = ', this.virtualCanvas);
    }

    clearCanvas(): void {
        clearTimeout(this.virtualPendingReDrawId);
        this.layersFullyDrawn = false;
        this.virtualContext.clearRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
        this.layers = [];
        this.gradeRuleSetList = [];
    }

    canvasSizing(): void{
        this.virtualCanvas.height = this.actualresolution.getHeightInPixel(this.dpi);
        this.virtualCanvas.width = this.actualresolution.getWidthInPixel(this.dpi);
    }

    loadData(Data): void{   // handle this method
        this.clearCanvas();
        Data = JSON.parse(JSON.stringify(Data));

        BaseLayer.maxID = 0;
            
            // loading resolution
            let resolution = PAGE_RESOLUTIONS.find(pr => pr.resolutionName == Data.actualresolution.resolutionName);
            if (!resolution) {
                PAGE_RESOLUTIONS[4] = getStructeredPageResolution('Custom', Data.actualresolution.mmHeight, Data.actualresolution.mmWidth, Data.actualresolution.orientation)
                resolution = PAGE_RESOLUTIONS[4];
            }

            // apply resolution
            this.canvasSizing();

            // loding Grade Rules
            Data.gradeRuleSetList.forEach(gradeRuleSet => {
                gradeRuleSet.gradeRules = gradeRuleSet.gradeRules.map(gradeRule => new GradeRule(gradeRule));   // creating GradeRules from GradeRules data if GradeRuleSet
            });

            this.gradeRuleSetList = Data.gradeRuleSetList.map(gradeRuleSet => new GradeRuleSet(gradeRuleSet));  // creating GradeRuleSet 


            let mmToPixelScaleFactor = this.virtualCanvas.height / this.actualresolution.mm.height;

            this.backgroundColor = Data.backgroundColor;

            for (let i = 0; i < Data.layers.length; i++) {
                let layerData = Data.layers[i];
            
                let newLayerFromLayerData: Layer;   // update this for new architecture
                switch (layerData.LAYER_TYPE) {
                    case 'IMAGE':
                        newLayerFromLayerData = new CanvasImage(layerData, this);
                        break;
                    
                    case 'TABLE':
                        newLayerFromLayerData = new CanvasTable(layerData, this);
                        break;
                    
                    case 'LINE':
                        newLayerFromLayerData = new CanvasLine(layerData, this);
                        break;
                    
                    case 'RECTANGLE':
                        newLayerFromLayerData = new CanvasRectangle(layerData, this);
                        break;
                    
                    case 'CIRCLE':
                        newLayerFromLayerData = new CanvasCircle(layerData, this);
                        break;
                
                    case 'ROUNDED-RECTANGLE':
                        newLayerFromLayerData = new CanvasRoundedRectangle(layerData, this);
                        break;
                    
                    case 'SQUARE':
                        newLayerFromLayerData = new CanvasSquare(layerData, this);
                        break;
                    
                    case 'TEXT':
                    case 'DATE':
                    case 'ATTENDANCE':
                    case 'GRADE':
                    case 'REMARK':
                    case 'MARKS':
                    case 'FORMULA':
                    case 'RESULT':
                        layerData.fontStyle = { // structuring according to canvas
                            fillStyle: layerData.fillStyle,
                            font: [layerData.italics, layerData.fontWeight, layerData.fontSize+'px', layerData.font].join(' ')
                        };
                        delete layerData.fillStyle;
                        delete layerData.italics;
                        delete layerData.fontWeight;
                        delete layerData.fontSize;
                        delete layerData.font;
                        switch (layerData.LAYER_TYPE) {
                            case 'TEXT':
                                newLayerFromLayerData = new CanvasText(layerData, this);
                                break;
                            case 'DATE':
                                if (layerData.date) {
                                    layerData.date = new Date(layerData.date);
                                }
                                newLayerFromLayerData = new CanvasDate(layerData, this);
                                break;
                            case 'ATTENDANCE':
                                layerData.startDate = new Date(layerData.startDate);
                                layerData.endDate = new Date(layerData.endDate);
                                newLayerFromLayerData = new AttendanceLayer(layerData, this);
                                break;
                            case 'GRADE':
                                newLayerFromLayerData = new GradeLayer(layerData, this);
                                break;
                            case 'REMARK':
                                newLayerFromLayerData = new RemarkLayer(layerData, this);
                                break;
                            case 'MARKS':
                                if (layerData.gradeRuleSet) {
                                    layerData.gradeRuleSet = this.gradeRuleSetList.find(gradeRuleSet => gradeRuleSet.id == layerData.gradeRuleSet);
                                }
                                newLayerFromLayerData = new MarksLayer(layerData, this);
                                break;
                            case 'FORMULA': // Formula can depend in some layers that is not initilized yet
                                this.layers.push(null); // This null will be replaces during formula layer initilization
                                continue;
                            case 'RESULT':
                                this.layers.push(null); // This null will be replaces during result layer initilization
                                continue;
                        }
                        break;        
                }
                console.log('newLayerFromLayerData = ', newLayerFromLayerData, 'data = ', layerData);
                newLayerFromLayerData.scale(mmToPixelScaleFactor);
                this.layers.push(newLayerFromLayerData);
            }

            Data.layers.forEach((layerData, index) => { // For Formula layers
                if (layerData.LAYER_TYPE == 'FORMULA') {
                    let newLayerFromLayerData = new Formula(layerData, this);
                    newLayerFromLayerData.scale(mmToPixelScaleFactor);
                    this.layers[index] = newLayerFromLayerData;
                }
            });

            Data.layers.forEach((layerData, index) => { // For Result layers
                if (layerData.LAYER_TYPE == 'RESULT') {
                    layerData.marksLayers = layerData.marksLayers.map(layerId => this.layers.find(layer => layer && layer.id == layerId));
                    let newLayerFromLayerData = new Result(layerData, this);
                    newLayerFromLayerData.scale(mmToPixelScaleFactor);
                    this.layers[index] = newLayerFromLayerData;
                }
            });


            this.drawAllLayers();
            console.log('canvas layers: ', this.layers);
    }

    private drawAllLayers(): void {
        this.virtualContext.clearRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
        this.virtualContext.fillStyle = this.backgroundColor;
        this.virtualContext.fillRect(0, 0, this.virtualCanvas.width, this.virtualCanvas.height);   // Applying background color

        for (let i = 0; i < this.layers.length; i++){
            if (!this.layers[i])
                continue;
            let status = this.layers[i].drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw);    // check for redundant iterations
            if (!status)
                return;
        }
        this.layersFullyDrawn = true;
    }

    scheduleCanvasReDraw = (duration: number = 500, preCallback: any = () => { }, postCallback: any = () => { })=>{
        clearTimeout(this.virtualPendingReDrawId);
        this.virtualPendingReDrawId = setTimeout(() => {
            preCallback();
            this.drawAllLayers();
            postCallback();
        }, duration);
    }

    async downloadPDF(doc:any) { 
        while (!this.layersFullyDrawn) {    // wait until all layers are drawn
            await sleep(1000);
        }
        this.drawAllLayers();
        console.log('student id = ', this.vm.DATA.studentId);
        console.log('all layers drawn =', this.layersFullyDrawn);
        doc.addPage([this.virtualCanvas.width, this.virtualCanvas.height]);
        let dataurl = this.virtualCanvas.toDataURL()
        doc.addImage(dataurl, 'PNG', 0, 0, this.virtualCanvas.width, this.virtualCanvas.height);
        return;
    }
}
