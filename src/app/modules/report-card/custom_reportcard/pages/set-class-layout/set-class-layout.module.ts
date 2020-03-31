import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../../components/components.module";

import { SetClassLayoutComponent } from './set-class-layout.component';
import { SetClassLayoutRouting } from './set-class-layout.routing';


@NgModule({
  declarations: [
      SetClassLayoutComponent
  ],
  imports: [
      SetClassLayoutRouting,
      ComponentsModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [SetClassLayoutComponent]
})
export class SetClassLayoutModule { }
