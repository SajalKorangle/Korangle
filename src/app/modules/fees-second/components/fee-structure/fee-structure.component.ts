import { Component, Input } from '@angular/core';
import {FREQUENCY_LIST} from '../../classes/constants';

@Component({
    selector: 'app-fee-structure',
    templateUrl: './fee-structure.component.html',
    styleUrls: ['./fee-structure.component.css'],
})
export class FeeStructureComponent {

    @Input() feeStructure;

    frequencyList = FREQUENCY_LIST;

    orderedFeeStructure(): any {
        return this.feeStructure.sort((a, b) => {
            return (a.orderNumber > b.orderNumber)? 1: (a.orderNumber === b.orderNumber? 0:-1)
        });
    }

}
