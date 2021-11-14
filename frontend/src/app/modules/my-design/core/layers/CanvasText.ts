import { BaseLayer, LayerInterface, designPropertyDecorator, dataPropertyDecorator, BaseCanvasAdapterInterface } from './base';
import { CLASS, DATA_SOURCE_TYPE, DEFAULT_TEXT_COLOR } from '@modules/my-design/core/constant';
import canvasTxt from 'canvas-txt';

export class CanvasText extends BaseLayer implements LayerInterface {
    static LAYER_TYPE = 'TEXT';
    @designPropertyDecorator text: string = 'Lorem Ipsum';
    @designPropertyDecorator prefix: string = '';
    @designPropertyDecorator suffix: string = '';

    @designPropertyDecorator font: string = 'Arial';
    @designPropertyDecorator fontSize: number = 16;
    @designPropertyDecorator fontWeight: string = 'normal';
    @designPropertyDecorator italics: string = '';
    @designPropertyDecorator fillStyle: string = DEFAULT_TEXT_COLOR;
    @designPropertyDecorator textBaseline: string = 'top';
    @designPropertyDecorator textAlign: string = 'center';

    @designPropertyDecorator maxWidth: number = 100;
    @designPropertyDecorator minHeight: number = 0;
    lastHeight: number = 0;
    @designPropertyDecorator underline: boolean = false;


    constructor(ca?: BaseCanvasAdapterInterface, attributes?: object) {
        super(ca);
        // this.parameterToolPannels.push('text');

        this.x = 50 / ca.pixelToMmFactor;
        this.y = 50 / ca.pixelToMmFactor;
        this.maxWidth = Math.round(7500 / ca.pixelToMmFactor) / 100;

        this.fontSize = 6 / ca.pixelToMmFactor;

        if (initilize) {    // initilize is sent as false is this class is super class of some other layer, in that case child class handles this block
            this.layerDataUpdate();
        }

        // functional height and width; used for drawing highlighter
        Object.defineProperty(this, 'height', {
            get: function () {
                return Math.max(this.lastHeight, this.minHeight);
            }
        });

        Object.defineProperty(this, 'width', {
            get: function () {
                return this.maxWidth;
            }
        });

        Object.defineProperty(this, 'displayName', {
            get: function () {
                let displayName = this.text.toString().substr(0, 15);
                if (this.text.length > 15) {
                    displayName = displayName.substr(0, 12) + '...';
                }
                return displayName;
            },
            set: function (v) { }   // dummy set function
        });

    }

    layerDataUpdate(): void {
        const DATA = this.ca.DATA;
        if (this.dataSourceType == DATA_SOURCE_TYPE.data) {
            if (this.error) {
                this.text = this.alternateText;
            } else {
                let value = this.source.getValueFunc(DATA);
                this.text = value ? value : this.alternateText;
            }
        }
    }


    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        ctx.fillStyle = this.fillStyle;
        canvasTxt.font = this.font;
        canvasTxt.fontSize = Math.max(1, this.fontSize);
        canvasTxt.align = this.textAlign;
        canvasTxt.vAlign = this.textBaseline;
        canvasTxt.fontStyle = this.italics;
        canvasTxt.fontWeight = this.fontWeight;
        canvasTxt.yLimit = 'top';
        canvasTxt.underline = this.underline;
        ctx.strokeStyle = this.fillStyle;
        // canvasTxt.debug = true;
        this.lastHeight = canvasTxt.drawText(ctx, this.prefix + this.text + this.suffix, this.x, this.y,
            Math.max(1, this.maxWidth), Math.max(1, this.minHeight)).height;
        return true;    // Drawn successfully on canvas
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.fontSize *= scaleFactor;
        this.minHeight *= scaleFactor;
        this.maxWidth *= scaleFactor;
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();

        savingData = {
            ...savingData,
            prefix: this.prefix,
            suffix: this.suffix,
            fontSize: this.fontSize * this.ca.pixelToMmFactor,
            italics: this.italics,
            fontWeight: this.fontWeight,
            font: this.font,
            underline: this.underline,
            fillStyle: this.fillStyle,
            textBaseline: this.textBaseline,
            textAlign: this.textAlign,
            maxWidth: this.maxWidth * this.ca.pixelToMmFactor,
            minHeight: this.minHeight * this.ca.pixelToMmFactor
        };
        if (this.dataSourceType == DATA_SOURCE_TYPE.constant) {
            savingData.text = this.text;
        }
        delete savingData.displayName;
        return savingData;
    }

}
