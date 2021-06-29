import { DesignTCComponent } from './design-tc.component';
import { FIELDS, PARAMETER_LIST, ParameterAsset, PageResolution, DPI_LIST, Layer, CanvasImage, sleep } from './../../class/constants';
import { PageResolutionDialogComponent } from '../../components/dialogs/page-resolution-dialog/page-resolution-dialog.component';
import { LayoutSharingDialogComponent } from '../../components/dialogs/layout-sharing-dialog/layout-sharing-dialog.component';
import { InventoryDialogComponent } from '../../components/dialogs/inventory-dialog/inventory-dialog.component';
import { LayerReplacementDialogComponent } from '../../components/dialogs/layer-replacement-dialog/layer-replacement-dialog.component';
import { TCDefaultParametersDialogComponent } from './../../components//dialogs/tc-default-parameters-dialog/tc-default-parameters-dialog.component';

export class DesignTCHtmlAdapter {
    fields: any = FIELDS;
    parameterList: any[] = [...PARAMETER_LIST];
    dpiList: number[] = DPI_LIST;

    vm: DesignTCComponent;
    canvasMargin = 24;

    isSaving: boolean = false;
    isLoading: boolean = false;
    isFullScreen: boolean = false;
    openedDialog: any = null;

    customMenuDisplay: boolean = false;
    customMenuTop: number = 0;
    customMenuLeft: number = 0;

    tableToolbarAssistanceRowCount = 20;
    tableToolbarAssistanceColumnCount = 20;
    newTableRowCount = 0;
    newTableColumnCount = 0;

    activeLeftColumn: string = 'layers';

    constructor() { }

    // Data

    initializeAdapter(vm: DesignTCComponent): void {
        this.vm = vm;
        this.vm.canvasAdapter.layerClickEvents.push(async (layer) => {
            let el = document.getElementById('layer_#' + layer.id);
            let count = 10;
            while (!el && count--) {
                await sleep(50);
                el = document.getElementById('layer_#' + layer.id);
            }
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }

    canvasSetUp(doScale: boolean = false): void {
        // Setting canvas height and width to according to parent div
        let canvasWrapper = document.getElementById('canvasWrapper');
        let wrapperBoundingDimensions = canvasWrapper.getBoundingClientRect();
        let computedCanvasWidth = wrapperBoundingDimensions.width - 2 * this.canvasMargin;
        let computedCanvasHeight = wrapperBoundingDimensions.height - 2 * this.canvasMargin;

        this.vm.canvasAdapter.maxVisibleHeight = computedCanvasHeight;
        this.vm.canvasAdapter.maxVisibleWidth = computedCanvasWidth;
        this.vm.canvasAdapter.canvasSizing(computedCanvasHeight, computedCanvasWidth, doScale);
    }

    getFieldKeys(): any {
        return Object.keys(this.fields);
    }

    getFilteredParameterList(field: any): any[] {
        return this.parameterList.filter((item) => {
            return item.field.fieldStructureKey === field.fieldStructureKey;
        });
    }

    addNewLayerForAsset(asset: ParameterAsset): void {
        if (asset.layerType == CanvasImage)
            this.vm.canvasAdapter.newLayerInitilization(
                new asset.layerType(
                    { dataSourceType: 'DATA', source: asset, width: 25 / this.vm.canvasAdapter.pixelTommFactor },
                    this.vm.canvasAdapter
                )
            );
        else
            this.vm.canvasAdapter.newLayerInitilization(
                new asset.layerType({ dataSourceType: 'DATA', source: asset }, this.vm.canvasAdapter)
            );
    }

    fullScreenExitHandler = (): void => {
        const element = document.getElementById('dtc-mainCard');
        if (this.isFullScreen) {
            element.classList.remove('fullScreen');
            document.getElementById('dtc-wrapper').appendChild(element);
            if (document.fullscreenElement && document.exitFullscreen) {
                document
                    .exitFullscreen()
                    .then(() =>
                        setTimeout(() => {
                            this.canvasSetUp(true);
                        }, 500)
                    )
                    .catch((err) => console.log(err));
            }
            document.removeEventListener('fullscreenchange', this.fullScreenExitHandler);
            this.isFullScreen = false;
        }
    }

    fullScreenToggle(): void {
        // check after adding html
        let element = document.getElementById('dtc-mainCard');
        if (this.isFullScreen) {
            this.fullScreenExitHandler();
        } else {
            element.classList.add('fullScreen');
            document.body.appendChild(element);
            if (document.body.requestFullscreen)
                document.body
                    .requestFullscreen()
                    .then(() =>
                        setTimeout(() => {
                            this.canvasSetUp(true);
                            document.addEventListener('fullscreenchange', this.fullScreenExitHandler);
                        }, 500)
                    ) // bad design f we specify the time, is there is any way to wait until the css styles are loaded?
                    .catch((err) => console.log(err));
            this.isFullScreen = true;
        }
    }

    openPageResolutionDialog(): void {
        this.openedDialog = this.vm.dialog.open(PageResolutionDialogComponent, {
            data: {
                activePageResolution: this.vm.canvasAdapter.actualresolution,
            },
        });
        this.openedDialog.afterClosed().subscribe((result: PageResolution) => {
            if (result) {
                this.canvasSetUp();
                this.vm.canvasAdapter.updateResolution(result);
            }
        });
    }

    openLayoutSharingDialog(): void {
        this.openedDialog = this.vm.dialog.open(LayoutSharingDialogComponent, {
            data: {
                vm: this.vm,
            },
        });
    }

    openTCDeafultParametersDialog(): void {
        this.openedDialog = this.vm.dialog.open(TCDefaultParametersDialogComponent, {
            data: {
                ca: this.vm.canvasAdapter,
            },
        });

        this.openedDialog.afterClosed().subscribe(() => {
            this.vm.canvasAdapter.fullCanavsRefresh();
        });
    }

    openLayerReplacementDialog(layer: Layer): void {
        this.openedDialog = this.vm.dialog.open(LayerReplacementDialogComponent, {
            data: {
                ca: this.vm.canvasAdapter,
                layer: layer,
            },
        });
        this.openedDialog.afterClosed().subscribe((parameterAsset: any) => {
            if (parameterAsset) {
                this.vm.canvasAdapter.replaceLayerWithNewLayerType(layer, { dataSourceType: 'DATA', source: parameterAsset });
            }
        });
    }

    openInventory(): void {
        const data = { vm: this.vm, selectedLayout: null };
        if (this.vm.currentLayout.id) {
            data.selectedLayout = this.vm.tcLayoutList.find(tc => tc.id == this.vm.currentLayout.id);
        }

        this.openedDialog = this.vm.dialog.open(InventoryDialogComponent, {
            data,
        });
        this.openedDialog.afterClosed().subscribe((selection: any) => {
            if (selection) {
                if (selection.copy) {
                    let newLayout: any = {
                        parentSchool: this.vm.user.activeSchool.dbId,
                        name: '',
                        publiclyShared: false,
                        content: this.vm.canvasAdapter.removeSchoolSpecificDataFromLayout(JSON.parse(selection.layout.content)),
                    };
                    this.vm.populateCurrentLayoutWithGivenValue(newLayout, true);
                } else {
                    this.vm.populateCurrentLayoutWithGivenValue(selection.layout);
                }
            }
        });
    }

    dropAssistanceDisplay(id: number) {
        document.getElementById(id.toString()).style.display = 'inline-block';
    }

    dropAssistanceHide(id: number) {
        document.getElementById(id.toString()).style.display = 'none';
    }

    openContextMenu(event: MouseEvent): void {
        this.customMenuDisplay = true;

        let layersListContainerRect = document.getElementById('canvasDesigningWrapper').getBoundingClientRect();
        this.customMenuLeft = event.x - layersListContainerRect.left + 5;
        this.customMenuTop = event.y - layersListContainerRect.top + 5;
    }

    closeContextMenu(): void {
        this.customMenuDisplay = false;
    }

    getArrayOfLength(length: number): Array<number> {
        let resultArray = [...Array(length + 1).keys()];
        resultArray.splice(0, 1);
        return resultArray;
    }

    canvasWrapperClickHandler(event) {
        if (event.target != this.vm.canvasAdapter.canvas) {
            this.vm.canvasAdapter.resetActiveLayer();
            this.vm.canvasAdapter.scheduleCanvasReDraw(0);
        }
    }
}
