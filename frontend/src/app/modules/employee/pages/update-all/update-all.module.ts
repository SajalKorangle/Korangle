import { NgModule } from '@angular/core';

import {UpdateAllComponent} from './update-all.component';

import {UpdateAllRoutingModule} from './update-all.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
  declarations: [
    UpdateAllComponent
  ],

  imports: [
    UpdateAllRoutingModule ,
    ComponentsModule,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [UpdateAllComponent]
})
export class UpdateAllModule { }
