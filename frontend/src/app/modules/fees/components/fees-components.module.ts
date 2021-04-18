import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeeReceiptListComponent } from './fee-receipt-list/fee-receipt-list-component.component';
import { DiscountListComponent } from './discount-list/discount-list-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatButtonModule, MatDialogModule, MatIconModule, MatInputModule, MatTooltipModule } from '@angular/material';
import { CancelFeeReceiptModalComponent } from './cancel-fee-receipt-modal/cancel-fee-receipt-modal.component';
import { BasicComponentsModule } from '@basic-components/basic-components.module';

@NgModule({
    declarations: [FeeReceiptListComponent, DiscountListComponent, CancelFeeReceiptModalComponent],

    imports: [
        CommonModule,
        FormsModule,
        TextFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        BasicComponentsModule,
    ],
    exports: [CommonModule, FeeReceiptListComponent, DiscountListComponent, CancelFeeReceiptModalComponent],
    providers: [],
    bootstrap: [],
    entryComponents: [CancelFeeReceiptModalComponent],
})
export class FeesComponentsModule {}
