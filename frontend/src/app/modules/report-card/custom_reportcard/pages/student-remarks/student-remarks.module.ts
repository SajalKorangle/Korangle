import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../../components/components.module";

import { StudentRemarksComponent } from './student-remarks.component';
import { StudentRemarksRouting } from './student-remarks.routing';


@NgModule({
  declarations: [
      StudentRemarksComponent
  ],
  imports: [
      StudentRemarksRouting,
      ComponentsModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [StudentRemarksComponent]
})
export class StudentRemarksModule { }
