import { NgModule } from '@angular/core';
import { ViewGradeComponent } from './view-grade.component';
import { ViewGradeRouting} from './view-grade.routing';
import {ComponentsModule} from "../../../../components/components.module";


@NgModule({
  declarations: [ViewGradeComponent],
  imports: [
      ComponentsModule,
      ViewGradeRouting
  ],
  exports: [

  ],
  providers: [],
  bootstrap: [
    ViewGradeComponent
  ]
})
export class ViewGradeModule { }
