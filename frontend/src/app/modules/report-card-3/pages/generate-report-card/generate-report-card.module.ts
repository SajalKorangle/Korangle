import { NgModule } from '@angular/core';
import {ComponentsModule} from "./../../../../components/components.module";
import { GenerateReportCardComponent } from './generate-report-card.component';
import { GenerateReportCardRouting} from './generate-report-card.routing';


@NgModule({
  declarations: [GenerateReportCardComponent],
  imports: [
    ComponentsModule,
    GenerateReportCardRouting
  ],
  bootstrap: [GenerateReportCardComponent]
})
export class GenerateReportCardModule { }
