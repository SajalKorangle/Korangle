import { NgModule } from '@angular/core';
import { TextParametersPannelComponent} from './text-parameters-pannel/text-parameters-pannel.component'
import { ComponentsModule } from './../../../components/components.module'
import { MatButtonToggleModule} from '@angular/material'

@NgModule({
  declarations: [TextParametersPannelComponent],
  imports: [
    ComponentsModule,
    MatButtonToggleModule
  ],
  exports: [
    TextParametersPannelComponent
  ]
})
export class ParametersPannelModule { }
