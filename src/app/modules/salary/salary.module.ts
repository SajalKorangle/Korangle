import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { SalaryComponent } from './salary.component';
import { SalaryRoutingModule } from './salary.routing';
import { SalaryService } from './salary.service';

import { GeneratePayslipComponent } from './pages/generate_payslip/generate-payslip.component';
import { RecordPaymentComponent } from './pages/record_payment/record-payment.component';
import { ViewRecordComponent } from './pages/view_record/view-record.component';

@NgModule({
    declarations: [

        SalaryComponent,
        GeneratePayslipComponent,
        RecordPaymentComponent,
        ViewRecordComponent,

    ],

    imports: [

        ComponentsModule,
        SalaryRoutingModule,

    ],
    exports: [
    ],
    providers: [SalaryService],
    bootstrap: [SalaryComponent]
})
export class SalaryModule { }
