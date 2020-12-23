import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../../components/components.module";
import { DesignReportCardComponent } from './design-report-card.component';
import { DesignReportCardRouting } from './design-report-card.routing';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


@NgModule({
  declarations: [DesignReportCardComponent],
  imports: [
    ComponentsModule,
    DesignReportCardRouting,
    MatButtonToggleModule
  ],
  bootstrap: [DesignReportCardComponent]
})
export class DesignReportCardModule { }
