import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../components/components.module";
import { AddTutorialRoutingModule } from './add-tutorial.routing';
import {AddTutorialComponent} from '@modules/tutorials/pages/add-tutorial/add-tutorial.component';


@NgModule({
  declarations: [
AddTutorialComponent
  ],
  imports: [
    AddTutorialRoutingModule,
    ComponentsModule
  ],
   providers: [],
    bootstrap: [AddTutorialComponent]
})
export class AddTutorialModule { }
