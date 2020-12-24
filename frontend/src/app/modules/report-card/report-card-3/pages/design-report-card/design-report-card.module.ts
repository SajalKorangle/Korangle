import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../../components/components.module";
import { DesignReportCardComponent } from './design-report-card.component';
import { DesignReportCardRouting } from './design-report-card.routing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [DesignReportCardComponent],
  imports: [
    ComponentsModule,
    DesignReportCardRouting,
    MatButtonToggleModule,
    MatIconModule
  ],
  bootstrap: [DesignReportCardComponent]
})
export class DesignReportCardModule { }
