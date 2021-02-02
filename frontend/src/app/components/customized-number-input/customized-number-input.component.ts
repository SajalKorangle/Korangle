import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
    selector: 'customized-number-input',
    templateUrl: './customized-number-input.component.html',
    styleUrls: ['./customized-number-input.component.css'],
})

export class CustomizedNumberInputComponent {

    @Input() placeHolder;

    @Input() width = 100;
    @Input() minimum = null;
    @Input() maximum = null;
    @Input() maximumDecimal = null;

    @Input() disabled;
    @Input() inputValue;

    @Output() outputValue = new EventEmitter<any>();

    isValidNumber(value: any): boolean {
        if (value === null || value === undefined || value === '') {
            return false;
        }
        if (isNaN(value)) {
            return false;
        }
        return true;
    }

    handleChange(value: any, targetElement): void {
        if (!this.isValidNumber(value)) {
            return;
        }
        if (this.minimum !== null && value < this.minimum) {
            value = this.minimum;
            targetElement.value = value;
        }
        if (this.maximum !== null && value > this.maximum) {
            value = this.maximum;
            targetElement.value = value;
        }
        if (this.maximumDecimal !== null) {
            let numberOfDecimals = 0;
            if (value.toString().split('.').length > 1) {
                numberOfDecimals = value.toString().split('.')[1].length || 0;
            }
            if (numberOfDecimals > this.maximumDecimal) {
                value = Number(value.toFixed(this.maximumDecimal));
                targetElement.value = value;
            }
        }
        this.outputValue.emit(value);
    }

    onBlur(event: any): void {
        let value = event.target.value;
        let sendOutput = false;
        if (!this.isValidNumber(value)) {
            value = this.minimum;
            event.target.value = value;
            sendOutput = true;
        }
        value = Number(value);
        if (this.minimum !== null && value < this.minimum) {
            value = this.minimum;
            event.target.value = value;
            sendOutput = true;
        }
        if (this.maximum !== null && value > this.maximum) {
            value = this.maximum;
            event.target.value = value;
            sendOutput = true;
        }
        if (this.maximumDecimal !== null) {
            let numberOfDecimals = 0;
            if (value.toString().split('.').length > 1) {
                numberOfDecimals = value.toString().split('.')[1].length || 0;
            }
            if (numberOfDecimals > this.maximumDecimal) {
                value = Number(value.toFixed(this.maximumDecimal));
                event.target.value = value;
                sendOutput = true;
            }
        }
        if (sendOutput) {
            this.outputValue.emit(value);
        }
    }

}
