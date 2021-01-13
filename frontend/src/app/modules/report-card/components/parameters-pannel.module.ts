import { NgModule } from '@angular/core';
import { TextParametersPannelComponent} from './text-parameters-pannel/text-parameters-pannel.component'
import { ComponentsModule } from './../../../components/components.module'
import { MatButtonToggleModule } from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AttendanceParametersPannelComponent } from './attendance-parameters-pannel/attendance-parameters-pannel.component';
import { PositionParameterPannelComponent } from './position-parameter-pannel/position-parameter-pannel.component';
import { MarksParametersPannelComponent } from './marks-parameters-pannel/marks-parameters-pannel.component';
import { CustomVariablesDialogComponent } from './custom-variables-dialog/custom-variables-dialog.component';
import { FormulaParametersPannelComponent } from './formula-parameters-pannel/formula-parameters-pannel.component';
import { PageResolutionDialogComponent } from './page-resolution-dialog/page-resolution-dialog.component';
import { ResultDialogComponent } from './result-dialog/result-dialog.component'
import { ImageParametersPannelComponent } from './image-parameters-pannel/image-parameters-pannel.component'

@NgModule({
  declarations: [TextParametersPannelComponent, AttendanceParametersPannelComponent, PositionParameterPannelComponent, MarksParametersPannelComponent, CustomVariablesDialogComponent, FormulaParametersPannelComponent, PageResolutionDialogComponent, ResultDialogComponent,
    ImageParametersPannelComponent],
  imports: [
    ComponentsModule,
    MatButtonToggleModule,
    MatSlideToggleModule
  ],
  exports: [
    TextParametersPannelComponent,
    AttendanceParametersPannelComponent,
    PositionParameterPannelComponent,
    MarksParametersPannelComponent,
    CustomVariablesDialogComponent,
    FormulaParametersPannelComponent,
    PageResolutionDialogComponent,
    ImageParametersPannelComponent,
    ResultDialogComponent
  ]
})
export class ParametersPannelModule { }
