import { NgModule } from '@angular/core';
import { TextParametersPannelComponent} from './text-parameters-pannel/text-parameters-pannel.component'
import { ComponentsModule } from './../../../components/components.module'
import { MatButtonToggleModule} from '@angular/material';
import { AttendanceParametersPannelComponent } from './attendance-parameters-pannel/attendance-parameters-pannel.component';
import { PositionParameterPannelComponent } from './position-parameter-pannel/position-parameter-pannel.component';
import { MarksParametersPannelComponent } from './marks-parameters-pannel/marks-parameters-pannel.component';
import { CustomVariablesDialogComponent } from './custom-variables-dialog/custom-variables-dialog.component';
import { FormulaParametersPannelComponent } from './formula-parameters-pannel/formula-parameters-pannel.component'

@NgModule({
  declarations: [TextParametersPannelComponent, AttendanceParametersPannelComponent, PositionParameterPannelComponent, MarksParametersPannelComponent, CustomVariablesDialogComponent, FormulaParametersPannelComponent],
  imports: [
    ComponentsModule,
    MatButtonToggleModule
  ],
  exports: [
    TextParametersPannelComponent,
    AttendanceParametersPannelComponent,
    PositionParameterPannelComponent,
    MarksParametersPannelComponent,
    CustomVariablesDialogComponent,
    FormulaParametersPannelComponent
  ]
})
export class ParametersPannelModule { }
