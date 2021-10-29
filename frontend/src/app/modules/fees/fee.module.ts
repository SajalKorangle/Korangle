import { NgModule } from '@angular/core';

import { MatExpansionModule } from '@angular/material';
import { MatSortModule } from '@angular/material';

import { ComponentsModule } from '../../components/components.module';

import { FeeComponent } from './fee.component';

import { FeeRoutingModule } from './fee.routing';

import { ExcelService } from '../../excel/excel-service';
import { FeesComponentsModule } from './components/fees-components.module';

import { FeePrintModule } from './print/print-components.module';
@NgModule({
    declarations: [
        FeeComponent,
    ],

    imports: [FeeRoutingModule, ComponentsModule, FeesComponentsModule, MatExpansionModule, MatSortModule, FeePrintModule],
    providers: [ExcelService],
    bootstrap: [FeeComponent],
})
export class FeeModule { }
