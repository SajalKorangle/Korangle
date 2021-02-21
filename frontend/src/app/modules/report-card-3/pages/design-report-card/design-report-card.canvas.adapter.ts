import { DesignReportCardComponent } from './design-report-card.component';
import {CanvasAdapterHTML } from './../../class/canvas.adapter';
import {reportError, ERROR_SOURCES } from './../../../../services/modules/errors/error-reporting.service'

import {
    CanvasAdapterInterface,
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
    AttendanceLayer,
    GradeLayer,
    RemarkLayer,
    MarksLayer,
    CanvasLine,
    CanvasRectangle,
    CanvasSquare,
    CanvasCircle,
    CanvasRoundedRectangle,
    GradeRuleSet,
    CanvasGroup,
    CurrentSession
} from './../../class/constants_3';

import * as jsPDF from 'jspdf'


export class DesignReportCardCanvasAdapter extends CanvasAdapterHTML implements CanvasAdapterInterface {

    vm: DesignReportCardComponent;    
    
    
    constructor() {
        super();
        console.log('canvas Adapter: ', this);
        Object.defineProperty(this, 'currentLayout', {
            get: function () {
                return this.vm.currentLayout;   // // reference to vm.currentLayout and there is no setter function
            }
        });

        Object.defineProperty(this, 'DATA', {
            get: function () {
                return this.vm.DATA;    // reference to vm.DATA and there is no setter function
            }
        });
    }
    
    addEmptyPage(): void{
        this.vm.currentLayout.content.push(this.getEmptyLayoutPage());
        this.updatePage(this.vm.currentLayout.content.length-1);
    }

    removeCurretPage(): void{
        if (confirm('This Page will be deleted permanently')) {
            let lastPage = this.activePageIndex;
            if (this.activePageIndex == 0)
                this.updatePage(1);
            else
                this.updatePage(this.activePageIndex - 1);
            this.vm.currentLayout.content.splice(lastPage, 1);
        }
    }

    updatePage(pageIndex: number): void{
        if (this.activePageIndex == pageIndex)
            return;
        if (this.activePageIndex == 0) {
            this.storeThumbnail()
        }
        this.vm.currentLayout.content[this.activePageIndex] = this.getDataToSave();
        this.loadData(this.vm.currentLayout.content[pageIndex]);
        this.activePageIndex = pageIndex;
    }

    initilizeAdapter(vm: DesignReportCardComponent) {
        this.vm = vm;
    }

    initilizeCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
 
        this.applyDefaultbackground();

        this.canvas.addEventListener('mousedown', (event) => {
            event.preventDefault();
            let clickedX, clickedY;
            clickedX = event.offsetX;
            clickedY = event.offsetY;
            console.log('clicked point = ', clickedX, clickedY);
            let flag = true;    // true: no layer is at clicked position
            
            if (this.activeLayer && this.activeLayer.id == -1 &&    // if active layer is group, check if it is clicked
                this.activeLayer.isClicked(clickedX, clickedY, event.shiftKey)) {
                flag = false;
            }
            if (flag || event.shiftKey) {
                for (let i = this.layers.length - 1; i >= 0; i--) {
                    if (this.layers[i].isClicked(clickedX, clickedY, event.shiftKey)) {
                        this.updateActiveLayer(i, event.shiftKey);
                        flag = false
                        break;
                    }
                }
            }



            this.selectDragedOverLayers = event.shiftKey || flag // if shift key or empty area, select dragged over layers
            if (!event.shiftKey && flag) { // if shift key not pressed and no layer resides at mouse down clicked point
                this.resetActiveLayer();
            }

            this.scheduleCanvasReDraw(0);
            this.currentMouseDown = true
            this.lastMouseX = clickedX;
            this.lastMouseY = clickedY;

            if (this.selectDragedOverLayers) {  // selection assistance
                let div = document.createElement('div');
                div.id = 'selection_asistance';
                div.style.pointerEvents = 'None';
                div.style.position = 'fixed';
                div.style.zIndex = '9999';
                div.style.background = 'rgba(0,120,255, 0.3)';
                document.body.appendChild(div);
                this.selectionAssistanceRef = div;
            }
        });

        this.canvas.addEventListener('contextmenu', (event) => {
            event.preventDefault();
            if (this.activeLayer) {
                this.vm.htmlAdapter.openContextMenu(event);
            }
        })

        this.canvas.addEventListener('mousemove', (event) => {  // Handling movement via mouse
            if (!this.currentMouseDown)
                return;
            if (this.selectDragedOverLayers && this.selectionAssistanceRef) {
                let height = event.offsetY - this.lastMouseY;
                let width = event.offsetX - this.lastMouseX;
                if (height < 0) {
                    this.selectionAssistanceRef.style.top = event.clientY + 'px';
                }
                else {
                    this.selectionAssistanceRef.style.top = (event.clientY - height) + 'px';
                }
                if (width < 0) {
                    this.selectionAssistanceRef.style.left = event.screenX + 'px';
                }
                else {
                    this.selectionAssistanceRef.style.left = (event.screenX - width) + 'px';
                }
                this.selectionAssistanceRef.style.height = Math.abs(height) + 'px';
                this.selectionAssistanceRef.style.width = Math.abs(width) + 'px';
            }
            else if (this.activeLayer) {
                let mouseX = event.offsetX, mouseY = event.offsetY, dx, dy;
                dx = mouseX - this.lastMouseX;  // Change in x
                dy = mouseY - this.lastMouseY;  // Change in y
                this.activeLayer.updatePosition(dx, dy);  // Update x and y of layer
                this.lastMouseX = mouseX;
                this.lastMouseY = mouseY;
                this.drawAllLayers();
            }
        });

        this.canvas.addEventListener('mouseup', (event) => {
            if (this.selectDragedOverLayers) {
                let x1, y1, x2, y2;
                x1 = Math.min(event.offsetX, this.lastMouseX);
                y1 = Math.min(event.offsetY, this.lastMouseY);
                x2 = Math.max(event.offsetX, this.lastMouseX);
                y2 = Math.max(event.offsetY, this.lastMouseY);
                if (!(x2 - x1 < 2 && y2 - y1 < 2)) {    // if mouse was clicked and dragged
                    let selectedLayers = [];
                    let layer;
                    for (let index = this.layers.length - 1; index >= 0; index--) {
                        layer = this.layers[index];
                        if ((x2 > layer.x && (layer.x + layer.width) > x1) && (y2 > layer.y && (layer.y + layer.height) > y1)) {
                            selectedLayers.push(index);
                        }
                    }
                    selectedLayers.forEach(i => this.updateActiveLayer(i, true));
                }
            }
            this.currentMouseDown = false;
            this.selectDragedOverLayers = false;
        });

        document.addEventListener('mouseup', this.documentEventListners.mouseup);

        document.addEventListener('keydown', this.documentEventListners.keydown);
    }

    updateResolution(newResolution: PageResolution): void{
        this.actualresolution = new PageResolution(newResolution.resolutionName,
            newResolution.mm.height, newResolution.mm.width, newResolution.orientation);    // copy of standard resolution
        this.canvasSizing(this.maxVisibleHeight, this.maxVisibleWidth);
        this.scheduleCanvasReDraw(0);
    }

    maximumCanvasSize():any{
        return this.actualresolution.getHeightInPixel(this.dpi)*2;
    }

    minimumCanvasSize():any{
        return this.actualresolution.getHeightInPixel(this.dpi)*(0.1);
    }

    changeZoomLevel(event: any): any{   // check here
        let newHeight = event.value;
        let newWidth = event.value;
        this.canvasSizing(newHeight, newWidth, true);
    }

    getDataToSave() {   // updating required

        let layers = [];
        for (let i = 0; i < this.layers.length; i++){    // Copying all layer objects
            layers[i] = this.layers[i].getDataToSave();
        };

        let dataToSave:{[key:string]:any} = {
            actualresolution: {
                resolutionName: this.actualresolution.resolutionName,
                orientation: this.actualresolution.orientation
            },
            backgroundColor: this.backgroundColor,

            gradeRuleSetList: this.gradeRuleSetList.map(gradeRuleSet=>gradeRuleSet.getDataToSave()),
            layers: layers
        };

        if (this.actualresolution.resolutionName == 'Custom') {   //custom resolution
            dataToSave.actualresolution.mmHeight = this.actualresolution.mm.height;
            dataToSave.actualresolution.mmWidth = this.actualresolution.mm.width;
        }

        return dataToSave
    }

    loadData(Data): void{   // handle this method
        this.clearCanvas()
        Data = JSON.parse(JSON.stringify(Data)); // deep copy of layoutPageData

        BaseLayer.maxID = 0;
        try {
            
            // loading resolution
            let resolution;
            if (Data.actualresolution.resolutionName == 'Custom') {
                resolution = new PageResolution('Custom', Data.actualresolution.mmHeight, Data.actualresolution.mmWidth, Data.actualresolution.orientation)
            } else {
                resolution = PAGE_RESOLUTIONS.find(pr => pr.resolutionName == Data.actualresolution.resolutionName);
                resolution.orientation = Data.actualresolution.orientation;
            }

            // apply resolution
            this.vm.htmlAdapter.canvasSetUp();
            this.updateResolution(resolution);

            // loding Grade Rules
            Data.gradeRuleSetList.forEach(gradeRuleSet => {
                gradeRuleSet.gradeRules = gradeRuleSet.gradeRules.map(gradeRule => new GradeRule(gradeRule));   // creating GradeRules from GradeRules data if GradeRuleSet
            });

            this.gradeRuleSetList = Data.gradeRuleSetList.map(gradeRuleSet => new GradeRuleSet(gradeRuleSet));  // creating GradeRuleSet 


            let mmToPixelScaleFactor = this.canvasHeight / this.actualresolution.mm.height;

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
                    case 'CURRENT_SESSION':
                        newLayerFromLayerData = new CurrentSession(layerData, this);
                        break;
                    case 'FORMULA':
                        this.layers.push(null); // This null will be replaces during formula layer initilization
                        continue;
                    case 'RESULT':
                        this.layers.push(null); // This null will be replaces during result layer initilization
                        continue;      
                }
                console.log('layer Data: ', layerData);
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

            if (this.layers.length > 0) {
                this.activeLayer = this.layers[this.layers.length - 1];
                this.activeLayerIndexes = [this.layers.length - 1];
            }
            // this.drawAllLayers();
            this.fullCanavsRefresh();
            // console.log('canvas layers: ', this.layers);
            this.isSaved = false;
        } catch (err) {
            console.error(err);
            reportError(ERROR_SOURCES[1], location.pathname + location.search, err, 'error in loading saved layout page; data croupted');
            alert('data corupted');
            this.clearCanvas();
        }
    }

    getLayerFromLayerData(layerData: any, constructor:any): Layer{
        switch (layerData.LAYER_TYPE) {
            case 'DATE':
                if (layerData.date) {
                    layerData.date = new Date(layerData.date);
                }
            case 'ATTENDANCE':
                layerData.startDate = new Date(layerData.startDate);
                layerData.endDate = new Date(layerData.endDate);
                break;
            case 'MARKS':
                if (layerData.gradeRuleSet) {
                    layerData.gradeRuleSet = this.gradeRuleSetList.find(gradeRuleSet => gradeRuleSet.id == layerData.gradeRuleSet);
                }
                break;
            case'RESULT':
                layerData.marksLayers = layerData.marksLayers.map(layerId => this.layers.find(layer => layer && layer.id == layerId));
        }
        return new constructor(layerData, this);
    }

    replaceLayerWithNewLayerType(layer:Layer, initialParameters: {[key:string]:any} = {}): void{
        let layerIndex = this.layers.findIndex(l => l.id == layer.id);
        let layerData = JSON.parse(JSON.stringify(layer.getDataToSave()));
        initialParameters = { ...layerData, ...initialParameters };

        let newLayer: Layer = this.getLayerFromLayerData(initialParameters, layer.constructor);
        newLayer.scale(1 / this.pixelTommFactor);

        this.layers[layerIndex] = newLayer;
        this.activeLayer = newLayer;
        this.activeLayerIndexes = [layerIndex];
        this.scheduleCanvasReDraw();
    }

    fullCanavsRefresh():void {
        this.layers.forEach((layer: Layer) => {
            layer.layerDataUpdate();
        })
        this.scheduleCanvasReDraw(0);
    }

    layerMove(id1: number, id2:number): void{   // move layer of id2 above layer of id1
        let layer1Index: number = this.layers.findIndex(l => l.id == id1);
        let layer2Index: number = this.layers.findIndex(l => l.id == id2);
        let layerToMove = this.layers[layer2Index];
        delete this.layers[layer2Index];
        this.layers.splice(layer1Index, 0, layerToMove);
        this.layers = this.layers.filter(Boolean);
        this.scheduleCanvasReDraw(0);
        this.activeLayer = layerToMove;
        this.activeLayerIndexes = [this.layers.findIndex(l => l.id ==layerToMove.id)];
    }

    duplicateLayer(layer: Layer): void{
        let layerParticularData = layer.getDataToSave();
        let deepCopyLayerData = JSON.parse(JSON.stringify(layerParticularData));
        delete deepCopyLayerData.id;
        let newLayer = this.getLayerFromLayerData(deepCopyLayerData, layer.constructor);
        let mmToPixelScaleFactor = this.canvasHeight / this.actualresolution.mm.height;
        newLayer.scale(mmToPixelScaleFactor);
        newLayer.x += 15;   // slightly shifting layer 
        newLayer.y += 15;
        this.newLayerInitilization(newLayer);
    }

    applyDefaultbackground(): void{
        this.backgroundColor = DEFAULT_BACKGROUND_COLOR;
        this.scheduleCanvasReDraw(0);
    }

    applyBackground(bgColor: string): void{
        this.backgroundColor = bgColor;
        this.scheduleCanvasReDraw(0);
    }

    clearCanvas(): void {
        clearTimeout(this.virtualPendingReDrawId);

        this.activeLayer = null;
        this.activeLayerIndexes = [];
        this.virtualContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.layers = [];
        this.currentMouseDown = false;
        this.isSaved = false;
        this.activePageIndex = 0;

        this.applyDefaultbackground();
    }

    removeSchoolSpecificDataFromLayout(layoutContent: any[]): any[] {
        layoutContent = JSON.parse(JSON.stringify(layoutContent));
        for (let i=0; i < layoutContent.length; i++) {
            layoutContent[i].layers = layoutContent[i].layers.map(layer => {
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
            })
        }
        return layoutContent;
    }

    resetActiveLayer(): void{
        this.activeLayer = null;
        this.activeLayerIndexes = [];
    }

    updateActiveLayer(activeLayerIndex:number, shiftKey:boolean = false): void{   // used by left layer pannel
        if (shiftKey && this.activeLayerIndexes.length>0) {
            let currIndex = this.activeLayerIndexes.findIndex(i => i == activeLayerIndex);
            if (currIndex == -1) {
                this.activeLayerIndexes.push(activeLayerIndex);
                this.layerClickEvents.forEach(eventToTrigger => eventToTrigger(this.layers[activeLayerIndex]));
            }
            else {
                this.activeLayerIndexes.splice(currIndex, 1);
            }

            // updating active layer accoding to activeLayerIndexes
            if (this.activeLayerIndexes.length == 0) {
                this.activeLayer = null
            }
            else if(this.activeLayerIndexes.length == 1) {
                this.activeLayer = this.layers[this.activeLayerIndexes[0]];
            }
            else {  // create group here
                this.activeLayer = new CanvasGroup({id:-1, layers: this.activeLayerIndexes.map(i=>this.layers[i])}, this);
            }
        } else {
            this.activeLayerIndexes = [activeLayerIndex];
            this.activeLayer = this.layers[activeLayerIndex];
            this.layerClickEvents.forEach(eventToTrigger => eventToTrigger(this.activeLayer));
        }
        this.scheduleCanvasReDraw(0);
    }

    downloadPDF() { // do not scale the canvas and block the user, use generate report card canvas adapter infrastructure to do this in background
        let actualCanavsWidth = this.canvasWidth, actualCanavsHeight = this.canvasHeight;
        let fullWidth = this.actualresolution.getWidthInPixel(this.dpi);
        let fullHeight = this.actualresolution.getHeightInPixel(this.dpi);

        this.vm.htmlAdapter.isSaving = true;
        this.metaDrawings = false;
        this.canvasSizing(fullHeight, fullWidth, true);
        setTimeout(() => {
            let doc = new jsPDF({ orientation: 'p', unit: 'pt', format: [this.canvasHeight, this.canvasWidth] });
            let dataurl = this.canvas.toDataURL()
            doc.addImage(dataurl, 'PNG', 0, 0, this.canvasWidth, this.canvasHeight);
            doc.save(this.vm.currentLayout.name + '.pdf');
            this.metaDrawings = true;
            this.canvasSizing(actualCanavsHeight, actualCanavsWidth);
            this.vm.htmlAdapter.isSaving = false;
        },1000);    // bad design of waiting for canvas loading
    }

    newImageLayer(initialParameters: object = {}): CanvasImage{
        let canvasImage = new CanvasImage(initialParameters, this);
        this.newLayerInitilization(canvasImage);
        return canvasImage
    }

    newTextLayer(initialParameters: object = {}): CanvasText{
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

    newFormulaLayer(initialParameters: object = {}):Formula{
        let canavsFormula = new Formula(initialParameters, this);
        this.newLayerInitilization(canavsFormula);
        return canavsFormula;
    }

    newReultLayer(initialParameters: object = {}): Result{
        let result = new Result(initialParameters, this);
        this.newLayerInitilization(result);
        return result;
    }

    newTableLayer(initialParameters: object = {}): CanvasTable{
        let canavsTable = new CanvasTable(initialParameters, this);
        this.newLayerInitilization(canavsTable);
        return canavsTable;
    }

    newLayerInitilization(layer: Layer): void{
        this.layers.push(layer);
        this.updateActiveLayer(this.layers.length - 1)
    }

}

