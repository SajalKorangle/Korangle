import { DesignReportCardComponent } from './design-report-card.component';
import { FIELDS, PARAMETER_LIST, ParameterAsset, TEST_TYPE_LIST, MARKS_TYPE_LIST, PageResolution, DPI_LIST, Formula, Result, MarksLayer, Layer, CanvasImage, sleep} from './../../class/constants_3';
import { PageResolutionDialogComponent } from './../../components/page-resolution-dialog/page-resolution-dialog.component';
import {ResultDialogComponent } from './../../components/result-dialog/result-dialog.component'
import { GradeRulesDialogComponent } from './../../components/grade-rules-dialog/grade-rules-dialog.component';
import { MarksDialogComponent } from './../../components/marks-dialog/marks-dialog.component';
import {LayoutSharingDialogComponent } from './../../components/layout-sharing-dialog/layout-sharing-dialog.component'
import { InventoryDialogComponent } from './../../components/inventory-dialog/inventory-dialog.component';
import { LayerReplacementDialogComponent } from './../../components/layer-replacement-dialog/layer-replacement-dialog.component';
import { async } from '@angular/core/testing';

export class DesignReportCardHtmlAdapter {

    fields: any = FIELDS;
    parameterList: any[] = [...PARAMETER_LIST];
    testTypeList: string[] = TEST_TYPE_LIST;
    marksTypeList: string[] = MARKS_TYPE_LIST;
    dpiList: number[] = DPI_LIST;

    vm: DesignReportCardComponent;
    canvasMargin = 24;

    isSaving:boolean = false;
    isLoading:boolean = false;
    isFullScreen:boolean = false;
    openedDialog: any = null;

    customMenuDisplay:boolean = false;
    customMenuTop: number = 0;
    customMenuLeft: number = 0;

    tableToolbarAssistanceRowCount = 20;
    tableToolbarAssistanceColumnCount = 20;
    newTableRowCount = 0;
    newTableColumnCount = 0;

    activeLeftColumn: string = 'layers';

    constructor() {
    }

    // Data

    initializeAdapter(vm: DesignReportCardComponent): void {
        this.vm = vm;
        this.vm.canvasAdapter.layerClickEvents.push(async (layer) => {
            let el = document.getElementById('layer_#' + layer.id)
            let count = 10;
            while (!el && count--) {
                await sleep(50);
                el = document.getElementById('layer_#' + layer.id);
            }
            if(el)
                el.scrollIntoView({ behavior: "smooth", block: "nearest" });
            
        })
    }

    canvasSetUp():void {    // Setting canvas height and width to according to parent div
        let canvasWrapper = document.getElementById('canvasWrapper');
        let wrapperBoundingDimensions = canvasWrapper.getBoundingClientRect();
        let computedCavasWidth = wrapperBoundingDimensions.width - 2 * this.canvasMargin;
        let computedCanvasHeight = wrapperBoundingDimensions.height - 2 * this.canvasMargin;
        
        this.vm.canvas.width = computedCavasWidth;
        this.vm.canvas.height = computedCanvasHeight;
    }

    getFieldKeys(): any{
        return Object.keys(this.fields);
    }

    getFilteredParameterList(field: any): any[] {
        return this.parameterList.filter(item => {
            return item.field.fieldStructureKey === field.fieldStructureKey;
        });
    }

    addNewLayerForAsset(asset: ParameterAsset): void {
        if (asset.layerType == CanvasImage)
            this.vm.canvasAdapter.newLayerInitilization(new asset.layerType({ 'dataSourceType': 'DATA', 'source': asset, width: 25 / this.vm.canvasAdapter.pixelTommFactor }, this.vm.canvasAdapter));
        else
            this.vm.canvasAdapter.newLayerInitilization(new asset.layerType({ 'dataSourceType': 'DATA', 'source': asset }, this.vm.canvasAdapter));   
    }

    fullScreenToggle(): void{
        let element = document.getElementById('drc-mainCard');
        if (this.isFullScreen) {
            element.classList.remove('fullScreen');
            document.getElementById('drc-wrapper').appendChild(element);
            if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen()
                    .then(() => setTimeout(() => {
                    this.canvasSetUp();
                    this.vm.canvasAdapter.canvasSizing();
                    },500))
                    .catch(err=>console.log(err));
            }
            this.isFullScreen = false;
        } else{
            element.classList.add('fullScreen');
            document.body.appendChild(element);
            if (document.body.requestFullscreen)
                document.body.requestFullscreen()
                    .then(() => setTimeout(() => {
                        this.canvasSetUp();
                        this.vm.canvasAdapter.canvasSizing();
                    }, 500))    // bad design f we specify the time, is there is any way to wait until the css styles are loaded?
                .catch(err=>console.log(err));
            this.isFullScreen = true;
        }  
    }

    openPageResolutionDialog():void {
        this.openedDialog = this.vm.dialog.open(PageResolutionDialogComponent, {
            data: {
                activePageResolution: this.vm.canvasAdapter.actualresolution
            }
        });
        this.openedDialog.afterClosed().subscribe((result: PageResolution) => {
            if (result) {
                console.log('activePageResolution acalled, result = ', result);
                this.canvasSetUp();
                this.vm.canvasAdapter.updateResolution(result);
            }
        });
    }

    openResultDialog(resultLayer: Result) {
        this.openedDialog = this.vm.dialog.open(ResultDialogComponent, {
            data: {
                ca: this.vm.canvasAdapter,
                layer: resultLayer
            }
        });
        this.openedDialog.afterClosed().subscribe(() => {
            resultLayer.layerDataUpdate();
            this.vm.canvasAdapter.scheduleCanvasReDraw();
        });
    }

    openGradeRulesDialog():void {
        this.openedDialog = this.vm.dialog.open(GradeRulesDialogComponent, {
            data: {
                ca: this.vm.canvasAdapter
            }
        });
    }

    openMarksDialog(layer:MarksLayer):void {
        this.openedDialog = this.vm.dialog.open(MarksDialogComponent, {
            data: {
                ca: this.vm.canvasAdapter,
                layer: layer
            }
        });
        this.openedDialog.afterClosed().subscribe(() => {
            layer.layerDataUpdate();
            this.vm.canvasAdapter.scheduleCanvasReDraw();
        });
    }

    openLayoutSharingDialog():void {
        this.openedDialog = this.vm.dialog.open(LayoutSharingDialogComponent, {
            data: {
                vm: this.vm
            }
        });
    }

    openLayerReplacementDialog(layer:Layer): void{
        this.openedDialog = this.vm.dialog.open(LayerReplacementDialogComponent, {
            data: {
                ca: this.vm.canvasAdapter,
                layer: layer
            }
        });
        this.openedDialog.afterClosed().subscribe((parameterAsset: any) => { 
            if (parameterAsset) {
                this.vm.canvasAdapter.replaceLayerWithNewLayerType(layer, { 'dataSourceType': 'DATA', 'source': parameterAsset });
            }
        })
    }

    openInventory(): void{
        this.openedDialog = this.vm.dialog.open(InventoryDialogComponent, {
            data: {
                vm: this.vm,
            }
        });
        this.openedDialog.afterClosed().subscribe((selection: any) => {
            if (selection) {
                switch (selection.type) {
                    case 'myLayout':
                        if (selection.index == -1) { // -1 is representing add new layout
                            this.vm.populateCurrentLayoutWithGivenValue(this.vm.ADD_LAYOUT_STRING);
                        }
                        else {
                            this.vm.populateCurrentLayoutWithGivenValue(this.vm.reportCardLayoutList[selection.index]);
                        }
                        break;
                    case 'public':
                        let newLayout1: any = {
                            parentSchool: this.vm.user.activeSchool.dbId,
                            name: '',
                            publiclyShared: false,
                            content: this.vm.canvasAdapter.removeSchoolSpecificDataFromLayout(JSON.parse(this.vm.publicLayoutList[selection.index].content))
                        };
                        this.vm.populateCurrentLayoutWithGivenValue(newLayout1, true);
                        break;
                    case 'shared':
                        let newLayout2: any = {
                            parentSchool: this.vm.user.activeSchool.dbId,
                            name: '',
                            publiclyShared: false,
                            content: this.vm.canvasAdapter.removeSchoolSpecificDataFromLayout(JSON.parse(this.vm.sharedLayoutList[selection.index].content))
                        };
                        this.vm.populateCurrentLayoutWithGivenValue(newLayout2, true);
                        break;
                }
            }
        })
    }

    dropAssistanceDisplay(id:number) {
        document.getElementById(id.toString()).style.display = 'inline-block';
    }

    dropAssistanceHide(id: number) {
        document.getElementById(id.toString()).style.display = 'none';
    }

    openContextMenu(event: MouseEvent): void{
        this.customMenuDisplay = true;

        let layersListContainerRect = document.getElementById('canvasDesigningWrapper').getBoundingClientRect();
        this.customMenuLeft = event.x - layersListContainerRect.left+5;
        this.customMenuTop = event.y - layersListContainerRect.top+5;
    }

    closeContextMenu(): void{
        this.customMenuDisplay = false;
    }

    getArrayOfLength(length: number): Array<number> {
        let resultArray = [...Array(length + 1).keys()];
        resultArray.splice(0, 1);
        return resultArray;
    }

}

