import { NgModule } from '@angular/core';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

import {UpdateViaExcelRoutingModule} from './update-via-excel.routing';
import { CommonModule } from '@angular/common';
import {ComponentsModule} from "../../../../components/components.module";
import { UpdateViaExcelComponent } from './update-via-excel.component';



@NgModule({
  declarations: [UpdateViaExcelComponent],
  imports: [
    UpdateViaExcelRoutingModule,
    ComponentsModule,
    CommonModule,
    MatButtonToggleModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [UpdateViaExcelComponent]
})
export class UpdateViaExcelModule { }
