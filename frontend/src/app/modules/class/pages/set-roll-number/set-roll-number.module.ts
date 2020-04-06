import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../components/components.module";
import { SetRollNumberComponent } from './set-roll-number.component';
import {SetRollNumberRoutingModule} from './set-roll-number.routing';



@NgModule({
  declarations: [
      SetRollNumberComponent
  ],
  imports: [
    SetRollNumberRoutingModule,
    ComponentsModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [SetRollNumberComponent]
})
export class SetRollNumberModule { }
