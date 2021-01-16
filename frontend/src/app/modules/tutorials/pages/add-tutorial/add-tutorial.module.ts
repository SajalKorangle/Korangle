import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../components/components.module";
import { AddTutorialRoutingModule } from './add-tutorial.routing';
import {AddTutorialComponent} from '@modules/tutorials/pages/add-tutorial/add-tutorial.component';
import {MatProgressSpinnerModule} from '@angular/material';


@NgModule({
  declarations: [
AddTutorialComponent
  ],
    imports: [
        AddTutorialRoutingModule,
        ComponentsModule,
        MatProgressSpinnerModule
    ],
   providers: [],
    bootstrap: [AddTutorialComponent]
})
export class AddTutorialModule { }
