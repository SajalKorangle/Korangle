import { NgModule } from '@angular/core';
import { TextParametersPannelComponent} from './text-parameters-pannel/text-parameters-pannel.component'
import { ComponentsModule } from './../../../components/components.module'
import { MatButtonToggleModule} from '@angular/material';
import { AttendanceParametersPannelComponent } from './attendance-parameters-pannel/attendance-parameters-pannel.component'

@NgModule({
  declarations: [TextParametersPannelComponent, AttendanceParametersPannelComponent],
  imports: [
    ComponentsModule,
    MatButtonToggleModule
  ],
  exports: [
    TextParametersPannelComponent,
    AttendanceParametersPannelComponent
  ]
})
export class ParametersPannelModule { }
