// Panel List Starts
import { PositionPanelComponent } from '@modules/my-design/core/components/panels/position-panel/position-panel.component';
import { SettingsPanelComponent } from '@modules/my-design/core/components/panels/settings-panel/settings-panel.component';
// Panel List Ends

// Constants Starts
const DATA_SOURCE_TYPE = [    // used in all canvas layers
    'N/A',  // no data source, constant element
    'DATA'  // data source available, get data from the provided data source
];

// Constants Ends

// Types Starts
interface BaseCanvasAdapter {
    pixelToMmFactor: number;
}

type Class = { new(...args: any[]): any; };
type keyValue = { [key: string | number]: any; };
// Types Ends


// Property Decorators Starts

function dataPropertyDecorator(targetPrototype: keyValue, propertyName: string) {   // to subscribe to property changes
    const targetClass: any = targetPrototype.valueOf().constructor;
    const maxId = targetClass.maxId;
    const defaultObj = new targetClass();
    targetClass.maxId = maxId;  // restoring maxId

    targetPrototype['_' + propertyName] = defaultObj[propertyName];
    Object.defineProperty(targetPrototype, propertyName, {
        get: function () {
            return this['_' + propertyName];
        },
        set: function (value) {
            this['_' + propertyName] = value;
            this.layerDataUpdate(); // update layer data and redraw canvas
        }
    });
}

function designPropertyDecorator(targetPrototype: keyValue, propertyName: string) {   // to subscribe to property changes
    const targetClass: any = targetPrototype.valueOf().constructor;
    const maxId = targetClass.maxId;
    const defaultObj = new targetClass();
    targetClass.maxId = maxId;  // restoring maxId

    targetPrototype['_' + propertyName] = defaultObj[propertyName];
    Object.defineProperty(targetPrototype, propertyName, {
        get: function () {
            return this['_' + propertyName];
        },
        set: function (value) {
            this['_' + propertyName] = value;
            this.ca.scheduleCanvasReDraw(25);    // redraw canvas immediately
        }
    });
}


// Property Decorators Ends

export class BaseLayer {    // this layer is inherited by all canvas layers
    id: number = null;
    static maxID: number = 0;   // for auto incrementing id

    ca: BaseCanvasAdapter;

    @designPropertyDecorator error: boolean = false;
    @designPropertyDecorator x: number = 0;
    @designPropertyDecorator y: number = 0;

    @designPropertyDecorator height: number = null;
    @designPropertyDecorator width: number = null;

    @designPropertyDecorator alternateText: string = 'N/A';
    displayName: string;
    LAYER_TYPE: string;
    static panelList: Array<Class> = [PositionPanelComponent, SettingsPanelComponent];  // position right toolbar panel is present in all layers
    static toolBarList: string[] = [];     // change strings to component later
    isPositionLocked: boolean = false;
    dataSourceType: string = 'N/A';
    source?: { [key: string]: any; };

    constructor(ca: BaseCanvasAdapter) {
        this.ca = ca;
        BaseLayer.maxID += 1;
        this.id = BaseLayer.maxID;
    }

    initilizeSelf(attributes: object): void { // initializes all class variables according to provided initial parameters data as object
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        BaseLayer.maxID = Math.max(BaseLayer.maxID, this.id);   // always keeping static maxID maximum of all layers
        if (this.dataSourceType == DATA_SOUCE_TYPE[1]) {
            // The dependence on htmlAdapter should be removed, once custom parameter handling is updated use paramter list insted of htmlAdapter
            this.source = this.ca.vm.htmlAdapter.parameterList.find(el => el.key == this.source.key
                && el.field.fieldStructureKey == this.source.field.fieldStructureKey);
            if (!this.source)
                this.error = true;
        }
    }

    updatePosition(dx = 0, dy = 0): void {
        if (this.isLocked) {
            return;
        }
        else {
            this.x += dx;
            this.y += dy;
        }
    }

    highlightLayer(ctx: CanvasRenderingContext2D): void {
        if (this.height && this.width) {
            ctx.strokeStyle = ACTIVE_LAYER_HIGHLIGHTER_COLOR;
            ctx.lineWidth = ACTIVE_LAYER_HIGHLIGHTER_LINE_WIDTH;
            ctx.strokeRect(this.x - permissibleClickError / 4, this.y - permissibleClickError / 4,
                this.width + permissibleClickError / 2, this.height + permissibleClickError / 2);
        }
    }

    isClicked(mouseX: number, mouseY: number, shiftKey: boolean = false): boolean {
        return (mouseX > this.x - permissibleClickError
            && mouseX < this.x + this.width + permissibleClickError
            && mouseY > this.y - permissibleClickError
            && mouseY < this.y + this.height + permissibleClickError);
    }

    getDataToSave(): { [object: string]: any; } {   // common data to be saved in database
        let savingData: any = {
            id: this.id,
            displayName: this.displayName,
            LAYER_TYPE: this.LAYER_TYPE,
            x: this.x * this.ca.pixelTommFactor,  // converting pixels to mm
            y: this.y * this.ca.pixelTommFactor,
            dataSourceType: this.dataSourceType,
            isLocked: this.isLocked
        };
        return savingData;
    }
}

export interface LayerInterface extends BaseLayer {

};