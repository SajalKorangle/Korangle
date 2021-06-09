import { DecimalPipe } from '@angular/common';
import { Pipe } from '@angular/core';

@Pipe({ name: 'numberAndString' })
export class NumberAndStringPipe {
    constructor(private _decimalPipe: DecimalPipe) {}

    transform(num, param) {
        if (typeof num == 'string') {
            return num;
        }
        return this._decimalPipe.transform(num, param);
    }
}
