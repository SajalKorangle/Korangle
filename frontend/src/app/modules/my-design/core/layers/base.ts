// Panel List Starts
import { PositionPanelComponent } from '@modules/my-design/core/components/panels/position-panel/position-panel.component';
import { SettingsPanelComponent } from '@modules/my-design/core/components/panels/settings-panel/settings-panel.component';
// Panel List Ends

import { PERMISSIBLE_CLICK_ERROR, ACTIVE_LAYER_HIGHLIGHTER_COLOR, ACTIVE_LAYER_HIGHLIGHTER_LINE_WIDTH } from '@modules/my-design/core/constant';

// Constants Starts
const DATA_SOURCE_TYPE = {    // used in all canvas layers
    constant: 'N/A',  // no data source, constant element
    data: 'DATA'  // data source available, get data from the provided data source
};

// Constants Ends

// Types Starts
interface BaseCanvasAdapterInterface {
    pixelToMmFactor: number;
    scheduleCanvasReDraw: (delay: number) => Promise<any>;
    parameterList: any[];
}

type Class = { new(...args: any[]): any; };
type keyValue = { [key: string | number]: any; };
// Types Ends


// Property Decorators Starts

export function dataPropertyDecorator(targetPrototype: keyValue, propertyName: string) {   // to subscribe to property changes
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

export function designPropertyDecorator(targetPrototype: keyValue, propertyName: string) {   // to subscribe to property changes
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
            this.ca.scheduleCanvasReDraw(25);    // redraw canvas
        }
    });
}


// Property Decorators Ends

export class BaseLayer {    // this layer is inherited by all canvas layers
    id: number = null;
    static maxID: number = 0;   // for auto incrementing id

    ca: BaseCanvasAdapterInterface;

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
    dataSourceType: string = DATA_SOURCE_TYPE.constant;
    source?: { [key: string]: any; };

    constructor(ca: BaseCanvasAdapterInterface) {
        this.ca = ca;
        BaseLayer.maxID += 1;
        this.id = BaseLayer.maxID;
    }

    initializeSelf(attributes: object): void { // initializes all class variables according to provided attribute object
        Object.entries(attributes).forEach(([key, value]) => this[key] = value);
        BaseLayer.maxID = Math.max(BaseLayer.maxID, this.id);   // always keeping static maxID maximum of all layers
        if (this.dataSourceType == DATA_SOURCE_TYPE.data) {
            // The dependence on htmlAdapter should be removed, once custom parameter handling is updated use paramter list insted of htmlAdapter
            this.source = this.ca.parameterList.find(el => el.key == this.source.key
                && el.field.fieldStructureKey == this.source.field.fieldStructureKey);
            if (!this.source)
                this.error = true;
            else
                this.layerDataUpdate();
        }
    }


    layerDataUpdate(): void {}

    updatePosition(dx = 0, dy = 0): void {
        if (this.isPositionLocked) 
            return;
 
        this.x += dx;
        this.y += dy;
    }

    highlightLayer(ctx: CanvasRenderingContext2D): void {
        if (this.height && this.width) {
            ctx.strokeStyle = ACTIVE_LAYER_HIGHLIGHTER_COLOR;
            ctx.lineWidth = ACTIVE_LAYER_HIGHLIGHTER_LINE_WIDTH;
            ctx.strokeRect(this.x - PERMISSIBLE_CLICK_ERROR / 4, this.y - PERMISSIBLE_CLICK_ERROR / 4,
                this.width + PERMISSIBLE_CLICK_ERROR / 2, this.height + PERMISSIBLE_CLICK_ERROR / 2);
        }
    }

    isClicked(mouseX: number, mouseY: number, shiftKey: boolean = false): boolean {
        return (mouseX > this.x - PERMISSIBLE_CLICK_ERROR
            && mouseX < this.x + this.width + PERMISSIBLE_CLICK_ERROR
            && mouseY > this.y - PERMISSIBLE_CLICK_ERROR
            && mouseY < this.y + this.height + PERMISSIBLE_CLICK_ERROR);
    }

    getDataToSave(): { [object: string]: any; } {   // common data to be saved in database
        let savingData: any = {
            id: this.id,
            displayName: this.displayName,
            LAYER_TYPE: this.LAYER_TYPE,
            x: this.x * this.ca.pixelToMmFactor,  // converting pixels to mm
            y: this.y * this.ca.pixelToMmFactor,
            dataSourceType: this.dataSourceType,
            isLocked: this.isPositionLocked
        };
        if(this.dataSourceType == DATA_SOURCE_TYPE.data) 
            Object.assign(savingData, {source: this.source});
        return savingData;
    }
}

export interface LayerInterface extends BaseLayer {

};