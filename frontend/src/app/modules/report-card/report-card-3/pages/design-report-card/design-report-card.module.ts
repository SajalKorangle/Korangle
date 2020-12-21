import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../../components/components.module";
import { DesignReportCardComponent } from './design-report-card.component';
import { DesignReportCardRouting } from './design-report-card.routing';


@NgModule({
  declarations: [DesignReportCardComponent],
  imports: [
    ComponentsModule,
    DesignReportCardRouting
  ],
  bootstrap: [DesignReportCardComponent]
})
export class DesignReportCardModule { }
