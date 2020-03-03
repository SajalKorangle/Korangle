import { NgModule } from '@angular/core';
import { GradeComponent } from './grade.component';
import { ComponentsModule } from '../../components/components.module';
import { GradeRoutingModule } from './grade.routing';


@NgModule({
  declarations: [
      GradeComponent
  ],
  imports: [
    GradeRoutingModule,
    ComponentsModule,
  ],
  exports: [
  ],
  providers: [
  ],
  bootstrap: [GradeComponent]
})
export class GradeModule { }
