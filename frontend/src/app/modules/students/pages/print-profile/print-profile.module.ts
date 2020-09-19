import { NgModule } from '@angular/core';
import { PrintProfileComponent } from './print-profile.component';
import {ComponentsModule} from '../../../../components/components.module';
import {PrintProfileRoutingModule} from './print-profile.routing';

@NgModule({
  declarations: [
      PrintProfileComponent
  ],
  imports: [
      PrintProfileRoutingModule,
      ComponentsModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [PrintProfileComponent]
})
export class PrintProfileModule { }
