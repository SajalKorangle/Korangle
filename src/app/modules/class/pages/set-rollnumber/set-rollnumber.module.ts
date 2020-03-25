import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../components/components.module";
import { SetRollnumberComponent } from './set-rollnumber.component';
import {SetRollnumberRoutingModule} from './set-rollnumber.routing';



@NgModule({
  declarations: [
      SetRollnumberComponent
  ],
  imports: [
    SetRollnumberRoutingModule,
    ComponentsModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [SetRollnumberComponent]
})
export class SetRollnumberModule { }
