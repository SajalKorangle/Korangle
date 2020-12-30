import { NgModule } from '@angular/core';
import { TextParametersPannelComponent} from './text-parameters-pannel/text-parameters-pannel.component'
import { ComponentsModule } from './../../../components/components.module'
import { MatButtonToggleModule} from '@angular/material';
import { AttendanceParametersPannelComponent } from './attendance-parameters-pannel/attendance-parameters-pannel.component';
import { PositionParameterPannelComponent } from './position-parameter-pannel/position-parameter-pannel.component'

@NgModule({
  declarations: [TextParametersPannelComponent, AttendanceParametersPannelComponent, PositionParameterPannelComponent],
  imports: [
    ComponentsModule,
    MatButtonToggleModule
  ],
  exports: [
    TextParametersPannelComponent,
    AttendanceParametersPannelComponent,
    PositionParameterPannelComponent
  ]
})
export class ParametersPannelModule { }
