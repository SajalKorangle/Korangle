import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewBookFlowComponent } from './view-book-flow.component';
import { ComponentsModule } from "@components/components.module";
import { ViewBookFlowRouting } from './view-book-flow.routing';


@NgModule({
  declarations: [ViewBookFlowComponent],
  imports: [
    CommonModule,
    ViewBookFlowRouting,
    ComponentsModule
  ],
  exports: [],
  providers: [],
  bootstrap: [ViewBookFlowComponent]
})
export class ViewBookFlowModule { }
