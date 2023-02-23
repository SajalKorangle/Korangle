import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../../components/components.module';
import { DesignPayslipComponent } from './design-payslip.component';
import { DesignPayslipRoutingModule } from './design-payslip.routing';

@NgModule({
    declarations: [DesignPayslipComponent],

    imports: [ComponentsModule, DesignPayslipRoutingModule],
    exports: [DesignPayslipComponent],
    providers: [],
    bootstrap: [DesignPayslipComponent],
})
export class DesignPayslipModule {}
