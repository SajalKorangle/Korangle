import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {AddFeeTypeServiceAdapter} from "./add-fee-type.service.adapter";
import { FeeService } from "../../../../services/fee.service";

@Component({
    selector: 'add-fee-type',
    templateUrl: './add-fee-type.component.html',
    styleUrls: ['./add-fee-type.component.css'],
    providers: [ FeeService ],
})

export class AddFeeTypeComponent implements OnInit {

    @Input() user;

    feeTypeList: any;
    feeTypeNameToBeAdded: any;
    feeTypeOrderNumberToBeAdded: any;

    serviceAdapter: AddFeeTypeServiceAdapter;

    isLoading = false;

    constructor(public feeService: FeeService,
                private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.serviceAdapter = new AddFeeTypeServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    detectChanges(): void {
        this.cdRef.detectChanges();
    }

    isFeeTypeUpdateDisabled(feeType): boolean {
        if ((feeType.newName == feeType.name
            && feeType.newOrderNumber == feeType.orderNumber)
            || feeType.updating) {
            return true;
        }
        return false;
    }

}
