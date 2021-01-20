import { NgModule } from '@angular/core';
import { TextParametersPannelComponent} from './text-parameters-pannel/text-parameters-pannel.component'
import { ComponentsModule } from './../../../components/components.module'
import { MatButtonToggleModule } from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AttendanceParametersPannelComponent } from './attendance-parameters-pannel/attendance-parameters-pannel.component';
import { PositionParameterPannelComponent } from './position-parameter-pannel/position-parameter-pannel.component';
import { MarksParametersPannelComponent } from './marks-parameters-pannel/marks-parameters-pannel.component';
import { FormulaParametersPannelComponent } from './formula-parameters-pannel/formula-parameters-pannel.component';
import { PageResolutionDialogComponent } from './page-resolution-dialog/page-resolution-dialog.component';
import { ResultDialogComponent } from './result-dialog/result-dialog.component'
import { ImageParametersPannelComponent } from './image-parameters-pannel/image-parameters-pannel.component';
import { GradeRulesDialogComponent } from './grade-rules-dialog/grade-rules-dialog.component';
import { MarksDialogComponent } from './marks-dialog/marks-dialog.component';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';
import { TableParameterPannelComponent } from './table-parameter-pannel/table-parameter-pannel.component';
import { GradeParametersPannelComponent } from './grade-parameters-pannel/grade-parameters-pannel.component';
import { RemarkParametersPannelComponent } from './remark-parameters-pannel/remark-parameter-pannel.component';

@NgModule({
  declarations: [
    TextParametersPannelComponent,
    AttendanceParametersPannelComponent,
    PositionParameterPannelComponent,
    MarksParametersPannelComponent,
    FormulaParametersPannelComponent,
    PageResolutionDialogComponent,
    ResultDialogComponent,
    ImageParametersPannelComponent,
    GradeRulesDialogComponent,
    MarksDialogComponent,
    CustomMenuComponent,
    TableParameterPannelComponent,
    GradeParametersPannelComponent,
    RemarkParametersPannelComponent],
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
    FormulaParametersPannelComponent,
    PageResolutionDialogComponent,
    ImageParametersPannelComponent,
    ResultDialogComponent,
    GradeRulesDialogComponent,
    MarksDialogComponent,
    CustomMenuComponent,
    TableParameterPannelComponent,
    GradeParametersPannelComponent,
    RemarkParametersPannelComponent
  ]
})
export class ParametersPannelModule { }
