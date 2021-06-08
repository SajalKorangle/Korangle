import { NgModule } from '@angular/core';

import { PrintSalarySheetRoutingModule } from './print-salary-sheet.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { PrintSalarySheetComponent } from './print-salary-sheet.component';

@NgModule({
    declarations: [PrintSalarySheetComponent],

    imports: [PrintSalarySheetRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [PrintSalarySheetComponent],
})
export class PrintSalarySheetModule {}
