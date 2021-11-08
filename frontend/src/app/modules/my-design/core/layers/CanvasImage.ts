
import { BaseLayer, LayerInterface, designPropertyDecorator, dataPropertyDecorator, CanvasAdapterInterface } from './base';

export class CanvasImage extends BaseLayer implements LayerInterface {  // Canvas Image Layer
    displayName: string = 'Image';

    @designPropertyDecorator image: HTMLImageElement = null;
    @designPropertyDecorator radius: number = 0;

    // uses height and width of the base layer for image height and width
    @designPropertyDecorator borderStyle = {
        lineWidth: 0,
        strokeStyle: '#000000',
    };

    @dataPropertyDecorator uri: string;
    @designPropertyDecorator aspectRatio: any = null;
    maintainAspectRatio = true;

    constructor(attributes?: object, ca: CanvasAdapterInterface) {
        super(ca);  // parent constructor
        this.parameterToolPannels.push('image');

        this.image = new Image();

        this.initilizeSelf(attributes);
        this.LAYER_TYPE = 'IMAGE';
        this.layerDataUpdate();
    }

    initializeSelf(attributes: object): void {
        super.initilizeSelf(attributes);
        if (this.height && this.width && (!this.aspectRatio)) { // calculate aspect ratio if height and width is available
            this.aspectRatio = this.width / this.height;
        }
    }

    layerDataUpdate(): void {
        this.error = false;
        if (this.dataSourceType == DATA_SOUCE_TYPE[1]) {
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
            if (!this.height && !this.width) {
                this.height = this.image.height;
                this.width = this.image.width;
                this.aspectRatio = this.width / this.height;

                if (this.height > canvasHeight) {
                    this.height = canvasHeight; // so that image does not exceeds canvas boundry
                    this.width = this.aspectRatio * this.height;    // maintaining aspect ratio
                }
                if (this.width > canvasWidth) {
                    this.width = canvasWidth; // so that image does not exceeds canvas boundry
                    this.height = this.width / this.aspectRatio;    // maintaining aspect ratio
                }
            }
            else if (!this.height || !this.width) {
                this.aspectRatio = this.image.width / this.image.height;
                if (this.height)
                    this.width = this.height * this.aspectRatio;
                else
                    this.height = this.width / this.aspectRatio;
            }
        };

        this.image.onload = () => {
            getHeightAndWidth();
        };
        this.image.onerror = () => {
            this.error = true;
        };
        this.image.setAttribute('crossOrigin', 'anonymous');
        this.image.src = this.uri;
    }

    updateHeight(newHeight: number) {
        this.height = newHeight;
        if (this.maintainAspectRatio) {
            this.width = this.aspectRatio * this.height;
        }
    }

    updateWidth(newWidth: number) {
        this.width = newWidth;
        if (this.maintainAspectRatio) {
            this.height = this.width / this.aspectRatio;
        }
    }

    drawOnCanvas(ctx: CanvasRenderingContext2D, scheduleReDraw: any): boolean {
        if (this.error)    // id error the don't draw
            return true;

        if (this.image.complete && this.image.naturalHeight != 0) {

            const lineWidth = 2 * this.borderStyle.lineWidth;   // correcting for clipping
            const x = this.x + this.borderStyle.lineWidth;   // adjisted for line Width
            const y = this.y + this.borderStyle.lineWidth;   // adjusted for line Width
            const width = this.width - lineWidth;
            const height = this.height - lineWidth;
            let maxRadius = Math.min(this.width, this.height) / 2;
            let computedRadius = Math.ceil(Math.min(this.radius, maxRadius));

            ctx.save();

            // Cliping path
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
        scheduleReDraw(1000);   // draw again after some time
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
            height: this.height * this.ca.pixelTommFactor,
            width: this.width * this.ca.pixelTommFactor,
            maintainAspectRatio: this.maintainAspectRatio,
            radius: this.radius * this.ca.pixelTommFactor,
            borderStyle: { ...this.borderStyle, lineWidth: this.borderStyle.lineWidth * this.ca.pixelTommFactor, }
        };
        if (this.dataSourceType == DATA_SOUCE_TYPE[0]) {
            savingData.uri = this.uri;
        } else {    // if data source store source of data
            savingData.source = { ...this.source };
            delete savingData.source.layerType;
        }
        return savingData;
    }
}
