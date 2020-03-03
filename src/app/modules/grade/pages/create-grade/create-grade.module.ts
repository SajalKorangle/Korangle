import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { CreateGradeComponent } from './create-grade.component';
import { CreateGradeRouting } from './create-grade.routing';



@NgModule({
  declarations: [CreateGradeComponent],
  imports: [
      CreateGradeRouting,
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [CreateGradeComponent]
})
export class CreateGradeModule { }
