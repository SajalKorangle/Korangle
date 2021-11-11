import { BaseLayer, LayerInterface, designPropertyDecorator, dataPropertyDecorator, BaseCanvasAdapterInterface } from './base';
import { ImagePanelComponent } from '@modules/my-design/core/components/panels/image-panel/image-panel.component';
import { CLASS, DATA_SOURCE_TYPE, } from '@modules/my-design/core/constant';

export const DEFAULT_IMAGE_URL = 'https://korangleplus.s3.amazonaws.com/assets/img/ef3f502028770e76bbeeeea68744c2c3.jpg';

export class CanvasImage extends BaseLayer implements LayerInterface {  // Canvas Image Layer
    static LAYER_TYPE = 'IMAGE';
    static panelList: Array<CLASS> = [ImagePanelComponent];

    displayName: string = 'Image';

    image = new Image();
    @designPropertyDecorator radius: number = 0;

    // uses height and width of the base layer for image height and width
    @designPropertyDecorator borderStyle = {
        lineWidth: 0,
        strokeStyle: '#000000',
    };

    uri: string;
    maintainAspectRatio = true;

    get aspectRatio() { return this.height && this.width ? this.width / this.height : null; };

    constructor(ca?: BaseCanvasAdapterInterface, attributes?: object) {
        super(ca, attributes);  // parent constructor
        this.layerDataUpdate();
    }

    layerDataUpdate(): void {
        this.error = false;
        if (this.dataSourceType == DATA_SOURCE_TYPE.data) {
            const DATA = this.ca.DATA;
            const value = this.source.getValueFunc(DATA);
            if (value) {
                this.uri = value + '?javascript=';
            }
            else {
                this.uri = DEFAULT_IMAGE_URL + '?javascript=';
            }
        }

        const canvasWidth = this.ca.canvasWidth, canvasHeight = this.ca.canvasHeight;

        let getHeightAndWidth = () => {
            if (!this.height && !this.width) {  // image is loaded for the first time and is not coming from already saved layout
                this.height = this.image.height;
                this.width = this.image.width;

                if (this.height > canvasHeight) {
                    this.height = canvasHeight; // so that image does not exceeds canvas boundary
                    this.width = this.aspectRatio * this.height;    // maintaining aspect ratio
                }
                if (this.width > canvasWidth) {
                    this.width = canvasWidth; // so that image does not exceeds canvas boundary
                    this.height = this.width / this.aspectRatio;    // maintaining aspect ratio
                }
            }
        };

        this.image.onload = () => {
            getHeightAndWidth();
            this.ca.scheduleCanvasReDraw();
        };
        this.image.onerror = () => {
            this.error = true;
        };
        this.image.setAttribute('crossOrigin', 'anonymous');
        this.image.src = this.uri;
    }

    updateHeight(newHeight: number) {
        const aspectRatio = this.aspectRatio;
        this.height = newHeight;
        if (this.maintainAspectRatio) {
            this.width = aspectRatio * this.height;
        }
    }

    updateWidth(newWidth: number) {
        const aspectRatio = this.aspectRatio;
        this.width = newWidth;
        if (this.maintainAspectRatio) {
            this.height = this.width / aspectRatio;
        }
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        if (this.error)    // if error the don't draw
            return true;

        if (this.image.complete && this.image.naturalHeight != 0) {

            const lineWidth = 2 * this.borderStyle.lineWidth;   // correcting for clipping
            const x = this.x + this.borderStyle.lineWidth;   // adjusted for line Width
            const y = this.y + this.borderStyle.lineWidth;   // adjusted for line Width
            const width = this.width - lineWidth;
            const height = this.height - lineWidth;
            let maxRadius = Math.min(this.width, this.height) / 2;
            let computedRadius = Math.ceil(Math.min(this.radius, maxRadius));

            ctx.save();

            // Clipping path
            ctx.beginPath();
            ctx.moveTo(this.x + computedRadius, this.y);
            ctx.lineTo(this.x + this.width - computedRadius, this.y);
            ctx.arcTo(this.x + this.width, this.y, this.x + this.width, this.y + computedRadius, computedRadius);
            ctx.lineTo(this.x + this.width, this.y + this.height - computedRadius);
            ctx.arcTo(this.x + this.width, this.y + this.height, this.x + this.width - computedRadius, this.y + this.height, computedRadius);
            ctx.lineTo(this.x + computedRadius, this.y + this.height);
            ctx.arcTo(this.x, this.y + this.height, this.x, this.y + this.height - computedRadius, computedRadius);
            ctx.lineTo(this.x, this.y + computedRadius);
            ctx.arcTo(this.x, this.y, this.x + computedRadius, this.y, computedRadius);
            ctx.closePath();
            ctx.clip();

            if (lineWidth > 0) {
                Object.entries(this.borderStyle).forEach(([key, value]) => ctx[key] = value);
                ctx.lineWidth = lineWidth;
                const correction = 1;
                ctx.drawImage(this.image, x - correction, y - correction, width + (2 * correction), height + (2 * correction));    // with correction
                ctx.stroke();
            }
            else {
                ctx.drawImage(this.image, x, y, width, height);
            }

            ctx.restore();
            return true;    // Drawn successfully on canvas
        }
        return false;   // Canvas Drawing failed, scheduled redraw for later
    }

    scale(scaleFactor: number): void {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
        this.height *= scaleFactor;
        this.width *= scaleFactor;
        this.radius *= scaleFactor;
        this.borderStyle.lineWidth *= scaleFactor;
    }

    getDataToSave(): { [object: string]: any; } {
        let savingData = super.getDataToSave();
        savingData = {
            ...savingData,
            height: this.height * this.ca.pixelToMmFactor,
            width: this.width * this.ca.pixelToMmFactor,
            maintainAspectRatio: this.maintainAspectRatio,
            radius: this.radius * this.ca.pixelToMmFactor,
            borderStyle: { ...this.borderStyle, lineWidth: this.borderStyle.lineWidth * this.ca.pixelToMmFactor, }
        };
        if (this.dataSourceType == DATA_SOURCE_TYPE.constant) {
            savingData.uri = this.uri;
        }
        return savingData;
    }
}
