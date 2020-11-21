import { NgModule } from '@angular/core';

import {UpdateViaExcelRoutingModule} from './update-via-excel.routing';
import { CommonModule } from '@angular/common';
import {ComponentsModule} from "../../../../components/components.module";
import { UpdateViaExcelComponent } from './update-via-excel.component';



@NgModule({
  declarations: [UpdateViaExcelComponent],
  imports: [
    UpdateViaExcelRoutingModule,
    ComponentsModule,
    CommonModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [UpdateViaExcelComponent]
})
export class UpdateViaExcelModule { }
