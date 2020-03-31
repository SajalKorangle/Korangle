import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../../components/components.module";

import { GenerateFinalReportComponent } from './generate-final-report.component';
import { GenerateFinalReportRouting } from './generate-final-report.routing';


@NgModule({
  declarations: [
      GenerateFinalReportComponent
  ],
  imports: [
      GenerateFinalReportRouting,
      ComponentsModule
  ],
  exports: [
  ],
  providers: [],
  bootstrap: [GenerateFinalReportComponent]
})
export class GenerateFinalReportModule { }
