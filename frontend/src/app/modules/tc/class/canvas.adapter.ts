import {
    CanvasAdapterInterface,
    DEFAULT_BACKGROUND_COLOR,
    Layer,
    PageResolution,
    PAGE_RESOLUTIONS,
    BaseLayer,
    CanvasGroup,
    LayersMappedByType,
} from './constants';
import { reportError, ERROR_SOURCES } from './../../../services/modules/errors/error-reporting.service';

export class CanvasAdapterBase implements CanvasAdapterInterface {
    vm: any;

    currentLayout: { name: string; thumbnail?: any; publiclyShared: boolean; content: any };

    DATA: any;
    extraFields: { [key: string]: any } = {};

    virtualCanvas: HTMLCanvasElement;
    virtualContext: CanvasRenderingContext2D;

    canvasHeight: number = null; // current height and width are in pixels
    canvasWidth: number = null;

    actualresolution: PageResolution = PAGE_RESOLUTIONS[1]; // A4 size by default
    dpi: number = 72;

    pixelTommFactor: number; // width(height) in mm / Canvas width(height) in pixel

    layers: Array<Layer> = []; // layers in thier order from back to front
    activeLayer: Layer = null;
    activeLayerIndexes: Array<number> = [];

    activePageIndex: number = 0;

    backgroundColor: string = null;

    virtualPendingReDrawId: any;
    layersFullyDrawnPendingPromiseList: any[] = [];

    layerClickEvents: any[] = [];

    metaDrawings: boolean = false; // meta drawings includes things like hilighter, assistance etc.

    constructor() {
        this.virtualCanvas = document.createElement('canvas');
        this.virtualContext = this.virtualCanvas.getContext('2d');

        Object.defineProperty(this, 'canvasHeight', {
            // alias for this.canvas.height and this.virtualCanvas.height
            get: () => this.virtualCanvas.height,
            set: (newHeight) => (this.virtualCanvas.height = newHeight),
            configurable: true,
        });

        Object.defineProperty(this, 'canvasWidth', {
            // alias for this.canvas.width and this.virtualCanvas.width
            get: () => this.virtualCanvas.width,
            set: (newWidth) => (this.virtualCanvas.width = newWidth),
            configurable: true,
        });
    }

    clearCanvas(): void {
        clearTimeout(this.virtualPendingReDrawId);
        this.layersFullyDrawnPendingPromiseList.forEach(({ resolve }) => resolve());

        this.activeLayer = null;
        this.activeLayerIndexes = [];
        this.virtualContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.layers = [];
        this.activePageIndex = 0;

        this.applyDefaultbackground();
    }

    storeThumbnail(): void {
        let canavs: any = document.createElement('canvas');
        canavs.height = this.actualresolution.getmmHeight();
        canavs.width = this.actualresolution.getmmWidth();
        let ctx = canavs.getContext('2d');
        ctx.drawImage(this.virtualCanvas, 0, 0, canavs.width, canavs.height);
        this.currentLayout.thumbnail = canavs.toDataURL();
    }

    updatePage(pageIndex: number): Promise<any> {
        if (this.activePageIndex == pageIndex) return;
        if (this.activePageIndex == 0) {
            this.storeThumbnail();
        }
        this.currentLayout.content[this.activePageIndex] = this.getDataToSave();
        let returnPromise = this.loadData(this.currentLayout.content[pageIndex]);
        this.activePageIndex = pageIndex;
        return returnPromise;
    }

    removeCurretPage(): Promise<any> {
        if (confirm('This Page will be deleted permanently')) {
            let lastPage = this.activePageIndex;
            let promise;
            if (this.activePageIndex == 0) promise = this.updatePage(1);
            else promise = this.updatePage(this.activePageIndex - 1);
            this.vm.currentLayout.content.splice(lastPage, 1);
            return promise;
        }
        return Promise.reject();
    }

    canvasSizing(maxHeight: number, maxWidth: number = Infinity, doScale: boolean = false): void {
        let canvasPreviousWidth = this.canvasWidth;
        if (maxWidth / maxHeight > this.actualresolution.getAspectRatio()) {
            this.canvasHeight = maxHeight;
            this.canvasWidth = this.actualresolution.getCorrospondingWidth(maxHeight);
        } else {
            this.canvasWidth = maxWidth;
            this.canvasHeight = this.actualresolution.getCorrospondingHeight(maxWidth);
        }

        this.pixelTommFactor = this.actualresolution.getmmWidth() / this.canvasWidth;

        if (doScale) {
            let scaleFactor = this.canvasWidth / canvasPreviousWidth;
            this.layers.forEach((layer: Layer) => layer.scale(scaleFactor));
            this.scheduleCanvasReDraw(0);
        }
    }

    applyDefaultbackground(): void {
        this.backgroundColor = DEFAULT_BACKGROUND_COLOR;
        this.scheduleCanvasReDraw(0);
    }

    protected drawAllLayers(): boolean {
        this.virtualContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.virtualContext.fillStyle = this.backgroundColor;
        this.virtualContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight); // Applying background color

        for (let i = 0; i < this.layers.length; i++) {
            if (!this.layers[i]) continue;
            let status = this.layers[i].drawOnCanvas(this.virtualContext, this.scheduleCanvasReDraw); // check for redundant iterations
            if (!status) return false;
        }
        if (this.activeLayer && this.metaDrawings) {
            this.activeLayer.highlightLayer(this.virtualContext);
        }
        this.layersFullyDrawnPendingPromiseList.forEach(({ resolve }) => resolve());
        this.layersFullyDrawnPendingPromiseList = [];
        return true;
    }

    scheduleCanvasReDraw = (duration: number = 500, preCallback: any = () => {}, postCallback: any = () => {}): Promise<any> => {
        clearTimeout(this.virtualPendingReDrawId);
        return new Promise((resolve, reject) => {
            this.layersFullyDrawnPendingPromiseList.push({ resolve, reject });
            this.virtualPendingReDrawId = setTimeout(() => {
                preCallback();
                this.drawAllLayers();
                postCallback();
            }, duration);
        });
    }

    fullCanavsRefresh(): Promise<any> {
        this.layers.forEach((layer: Layer) => {
            layer.layerDataUpdate();
        });
        return this.scheduleCanvasReDraw(0);
    }

    updateResolution(newResolution: PageResolution): Promise<any> {
        this.actualresolution = new PageResolution(
            newResolution.resolutionName,
            newResolution.mm.height,
            newResolution.mm.width,
            newResolution.orientation
        ); // copy of standard resolution
        this.layers.forEach((l) => l.scale(this.pixelTommFactor)); // to convert all pixel data to mm
        this.canvasSizing(this.actualresolution.getHeightInPixel(this.dpi), this.actualresolution.getWidthInPixel(this.dpi));
        this.layers.forEach((l) => l.scale(1 / this.pixelTommFactor));
        return this.scheduleCanvasReDraw(0);
    }

    getLayerFromLayerData(layerData: any, constructor: any): Layer {
        switch (layerData.LAYER_TYPE) {
            case 'DATE':
                if (layerData.date) {
                    layerData.date = new Date(layerData.date);
                }
            case 'ATTENDANCE':
                layerData.startDate = new Date(layerData.startDate);
                layerData.endDate = new Date(layerData.endDate);
                break;
        }
        return new constructor(layerData, this);
    }

    loadData(Data): Promise<any> {
        // handle this method
        this.clearCanvas();
        Data = JSON.parse(JSON.stringify(Data)); // deep copy of layoutPageData

        BaseLayer.maxID = 0;
        try {
            // loading resolution
            let resolution;
            if (Data.actualresolution.resolutionName == 'Custom') {
                resolution = new PageResolution(
                    'Custom',
                    Data.actualresolution.mmHeight,
                    Data.actualresolution.mmWidth,
                    Data.actualresolution.orientation
                );
            } else {
                resolution = PAGE_RESOLUTIONS.find((pr) => pr.resolutionName == Data.actualresolution.resolutionName);
                resolution.orientation = Data.actualresolution.orientation;
            }

            // apply resolution
            this.updateResolution(resolution);

            this.extraFields = Data.extraFields;

            let mmToPixelScaleFactor = 1 / this.pixelTommFactor;

            this.backgroundColor = Data.backgroundColor;

            for (let i = 0; i < Data.layers.length; i++) {
                let layerData = Data.layers[i];

                let newLayerFromLayerData: Layer; // update this for new architecture
                newLayerFromLayerData = this.getLayerFromLayerData(layerData, LayersMappedByType[layerData.LAYER_TYPE]);
                newLayerFromLayerData.scale(mmToPixelScaleFactor);
                this.layers.push(newLayerFromLayerData);
            }

            if (this.layers.length > 0) {
                this.activeLayer = this.layers[this.layers.length - 1];
                this.activeLayerIndexes = [this.layers.length - 1];
            }
            return this.fullCanavsRefresh();
        } catch (err) {
            console.error(err);
            reportError(
                ERROR_SOURCES[1],
                location.pathname + location.search,
                err.toString(),
                'error in loading saved layout page; data corrupted',
                false,
                location.href
            );
            alert('data corrupted');
            this.clearCanvas();
        }
        return Promise.reject();
    }

    getDataToSave(): { [object: string]: any } {
        // updating required

        let dataToSave: { [key: string]: any } = {
            actualresolution: {
                resolutionName: this.actualresolution.resolutionName,
                orientation: this.actualresolution.orientation,
            },
            extraFields: this.extraFields,
            backgroundColor: this.backgroundColor,
            layers: this.layers.map((l) => l.getDataToSave()),
        };

        if (this.actualresolution.resolutionName == 'Custom') {
            //custom resolution
            dataToSave.actualresolution.mmHeight = this.actualresolution.mm.height;
            dataToSave.actualresolution.mmWidth = this.actualresolution.mm.width;
        }

        return dataToSave;
    }

    resetActiveLayer(): Promise<any> {
        this.activeLayer = null;
        this.activeLayerIndexes = [];
        return this.scheduleCanvasReDraw(0);
    }

    updateActiveLayer(activeLayerIndex: number, shiftKey: boolean = false): Promise<any> {
        // used by left layer pannel
        if (shiftKey && this.activeLayerIndexes.length > 0) {
            let currIndex = this.activeLayerIndexes.findIndex((i) => i == activeLayerIndex);
            if (currIndex == -1) {
                this.activeLayerIndexes.push(activeLayerIndex);
                this.layerClickEvents.forEach((eventToTrigger) => eventToTrigger(this.layers[activeLayerIndex]));
            } else {
                this.activeLayerIndexes.splice(currIndex, 1);
            }

            // updating active layer accoding to activeLayerIndexes
            if (this.activeLayerIndexes.length == 0) {
                this.activeLayer = null;
            } else if (this.activeLayerIndexes.length == 1) {
                this.activeLayer = this.layers[this.activeLayerIndexes[0]];
            } else {
                // create group here
                this.activeLayer = new CanvasGroup({ id: -1, layers: this.activeLayerIndexes.map((i) => this.layers[i]) }, this);
            }
        } else {
            this.activeLayerIndexes = [activeLayerIndex];
            this.activeLayer = this.layers[activeLayerIndex];
            this.layerClickEvents.forEach((eventToTrigger) => eventToTrigger(this.activeLayer));
        }
        return this.scheduleCanvasReDraw(0);
    }

    newLayerInitilization(layer: Layer): Promise<any> {
        this.layers.push(layer);
        return this.updateActiveLayer(this.layers.length - 1);
    }
}

export class CanvasAdapterUtilityMixin extends CanvasAdapterBase {
    getEmptyLayoutPage(): { [key: string]: any } {
        return {
            actualresolution: {
                resolutionName: PAGE_RESOLUTIONS[1].resolutionName, // a4 page
                orientation: 'p',
            },
            extraFiedls: {},
            backgroundColor: DEFAULT_BACKGROUND_COLOR,
            gradeRuleSetList: [],
            layers: [],
        };
    }

    getEmptyLayout(): any[] {
        return [this.getEmptyLayoutPage()];
    }

    addEmptyPage(): Promise<any> {
        this.currentLayout.content.push(this.getEmptyLayoutPage());
        return this.updatePage(this.vm.currentLayout.content.length - 1);
    }

    zoomToHeight(height: number): void {
        let newHeight = height;
        this.canvasSizing(newHeight, Infinity, true);
    }

    replaceLayerWithNewLayerType(layer: Layer, initialParameters: { [key: string]: any } = {}): Promise<any> {
        let layerIndex = this.layers.findIndex((l) => l.id == layer.id);
        let layerData = JSON.parse(JSON.stringify(layer.getDataToSave()));
        initialParameters = { ...layerData, ...initialParameters };

        let newLayer: Layer = this.getLayerFromLayerData(initialParameters, layer.constructor);
        newLayer.scale(1 / this.pixelTommFactor);

        this.layers[layerIndex] = newLayer;
        this.activeLayer = newLayer;
        this.activeLayerIndexes = [layerIndex];
        return this.scheduleCanvasReDraw();
    }

    layerMove(id1: number, id2: number): Promise<any> {
        // move layer of id2 above layer of id1
        let layer1Index: number = this.layers.findIndex((l) => l.id == id1);
        let layer2Index: number = this.layers.findIndex((l) => l.id == id2);
        let layerToMove = this.layers[layer2Index];
        delete this.layers[layer2Index];
        this.layers.splice(layer1Index, 0, layerToMove);
        this.layers = this.layers.filter(Boolean);
        this.activeLayer = layerToMove;
        this.activeLayerIndexes = [this.layers.findIndex((l) => l.id == layerToMove.id)];
        return this.scheduleCanvasReDraw(0);
    }

    duplicateLayer(layer: Layer): Promise<any> {
        let layerData = layer.getDataToSave();
        let deepCopyLayerData = JSON.parse(JSON.stringify(layerData));
        delete deepCopyLayerData.id;
        let newLayer = this.getLayerFromLayerData(deepCopyLayerData, layer.constructor);
        newLayer.scale(1 / this.pixelTommFactor);
        newLayer.x += 15; // slightly shifting layer
        newLayer.y += 15;
        return this.newLayerInitilization(newLayer);
    }
}

export class CanvasAdapterHTMLMixin extends CanvasAdapterUtilityMixin {
    canvas: HTMLCanvasElement; // html canvas rendered on screen
    context: CanvasRenderingContext2D;

    maxVisibleHeight: number;
    maxVisibleWidth: number;

    lastMouseX: number;
    lastMouseY: number;
    currentMouseDown: boolean = false;
    selectDragedOverLayers: boolean = false;
    selectionAssistanceRef: HTMLDivElement;

    isSaved = true; // if canvas is not saved then give warning; to be implemented

    pendingReDrawId: any;

    documentEventListners: { keydown: any; mouseup: any } = {
        keydown: (event) => {
            if (!this.activeLayer || !(event.target instanceof HTMLBodyElement)) return;
            if (event.key == 'ArrowUp') {
                this.activeLayer.updatePosition(0, -1);
                event.preventDefault();
                this.scheduleCanvasReDraw(0);
            }
            if (event.key == 'ArrowDown') {
                this.activeLayer.updatePosition(0, 1);
                event.preventDefault();
                this.scheduleCanvasReDraw(0);
            }
            if (event.key == 'ArrowLeft') {
                this.activeLayer.updatePosition(-1, 0);
                event.preventDefault();
                this.scheduleCanvasReDraw(0);
            }
            if (event.key == 'ArrowRight') {
                this.activeLayer.updatePosition(1, 0);
                event.preventDefault();
                this.scheduleCanvasReDraw(0);
            }
        },
        mouseup: (event) => {
            if (this.selectionAssistanceRef) {
                document.body.removeChild(this.selectionAssistanceRef);
                this.selectionAssistanceRef = null;
            }
        },
    };

    metaDrawings: boolean = true;

    constructor() {
        super();
        Object.defineProperty(this, 'canvasHeight', {
            // alias for this.canvas.height and this.virtualCanvas.height
            get: () => this.virtualCanvas.height,
            set: (newHeight) => {
                this.virtualCanvas.height = newHeight;
                this.canvas.height = newHeight;
            },
            configurable: true,
        });

        Object.defineProperty(this, 'canvasWidth', {
            // alias for this.canvas.width and this.virtualCanvas.width
            get: () => this.virtualCanvas.width,
            set: (newWidth) => {
                this.virtualCanvas.width = newWidth;
                this.canvas.width = newWidth;
            },
            configurable: true,
        });
    }

    destructor() {
        document.removeEventListener('keydown', this.documentEventListners.keydown);
        document.removeEventListener('mouseup', this.documentEventListners.mouseup);
    }

    clearCanvas(): void {
        super.clearCanvas();
        clearTimeout(this.pendingReDrawId);
        this.currentMouseDown = false;
        this.isSaved = false;
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
            // console.log('clicked point = ', clickedX, clickedY);
            let flag = true; // true: no layer is at clicked position

            if (
                this.activeLayer &&
                this.activeLayer.id == -1 && // if active layer is group, check if it is clicked
                this.activeLayer.isClicked(clickedX, clickedY, event.shiftKey)
            ) {
                flag = false;
            }
            if (flag || event.shiftKey) {
                for (let i = this.layers.length - 1; i >= 0; i--) {
                    if (this.layers[i].isClicked(clickedX, clickedY, event.shiftKey)) {
                        this.updateActiveLayer(i, event.shiftKey);
                        flag = false;
                        break;
                    }
                }
            }

            this.selectDragedOverLayers = event.shiftKey || flag; // if shift key or empty area, select dragged over layers
            if (!event.shiftKey && flag) {
                // if shift key not pressed and no layer resides at mouse down clicked point
                this.resetActiveLayer();
            }

            this.scheduleCanvasReDraw(0);
            this.currentMouseDown = true;
            this.lastMouseX = clickedX;
            this.lastMouseY = clickedY;

            if (this.selectDragedOverLayers) {
                // selection assistance
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
                this.vm.htmlAdapter.openContextMenu(event); // check here
            }
        });

        this.canvas.addEventListener('mousemove', (event) => {
            // Handling movement via mouse
            if (!this.currentMouseDown) return;
            if (this.selectDragedOverLayers && this.selectionAssistanceRef) {
                let height = event.offsetY - this.lastMouseY;
                let width = event.offsetX - this.lastMouseX;
                if (height < 0) {
                    this.selectionAssistanceRef.style.top = event.clientY + 'px';
                } else {
                    this.selectionAssistanceRef.style.top = event.clientY - height + 'px';
                }
                if (width < 0) {
                    this.selectionAssistanceRef.style.left = event.screenX + 'px';
                } else {
                    this.selectionAssistanceRef.style.left = event.screenX - width + 'px';
                }
                this.selectionAssistanceRef.style.height = Math.abs(height) + 'px';
                this.selectionAssistanceRef.style.width = Math.abs(width) + 'px';
            } else if (this.activeLayer) {
                let mouseX = event.offsetX,
                    mouseY = event.offsetY,
                    dx,
                    dy;
                dx = mouseX - this.lastMouseX; // Change in x
                dy = mouseY - this.lastMouseY; // Change in y
                this.activeLayer.updatePosition(dx, dy); // Update x and y of layer
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
                if (!(x2 - x1 < 2 && y2 - y1 < 2)) {
                    // if mouse was clicked and dragged
                    let selectedLayers = [];
                    let layer;
                    for (let index = this.layers.length - 1; index >= 0; index--) {
                        layer = this.layers[index];
                        if (x2 > layer.x && layer.x + layer.width > x1 && y2 > layer.y && layer.y + layer.height > y1) {
                            selectedLayers.push(index);
                        }
                    }
                    selectedLayers.forEach((i) => this.updateActiveLayer(i, true));
                }
            }
            this.currentMouseDown = false;
            this.selectDragedOverLayers = false;
        });

        document.addEventListener('mouseup', this.documentEventListners.mouseup);

        document.addEventListener('keydown', this.documentEventListners.keydown);
    }

    updateResolution(newResolution: PageResolution): Promise<any> {
        this.actualresolution = new PageResolution(
            newResolution.resolutionName,
            newResolution.mm.height,
            newResolution.mm.width,
            newResolution.orientation
        ); // copy of standard resolution
        this.layers.forEach((l) => l.scale(this.pixelTommFactor)); // to convert all pixel data to mm
        this.canvasSizing(this.maxVisibleHeight, this.maxVisibleWidth);
        this.layers.forEach((l) => l.scale(1 / this.pixelTommFactor)); // back to pixel according to new resolution
        return this.scheduleCanvasReDraw(0);
    }

    protected drawAllLayers(): boolean {
        if (super.drawAllLayers()) {
            clearTimeout(this.pendingReDrawId);
            this.pendingReDrawId = setTimeout(() => this.context.drawImage(this.virtualCanvas, 0, 0));
        }
        return true;
    }
}
