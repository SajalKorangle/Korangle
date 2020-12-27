import { NgModule } from '@angular/core';
import {ComponentsModule} from "../../../../../components/components.module";
import { DesignReportCardComponent } from './design-report-card.component';
import { DesignReportCardRouting } from './design-report-card.routing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import {ParametersPannelModule} from './../../../components/parameters-pannel.module'

@NgModule({
  declarations: [DesignReportCardComponent],
  imports: [
    ComponentsModule,
    DesignReportCardRouting,
    MatButtonToggleModule,
    MatIconModule,
    ParametersPannelModule
  ],
  bootstrap: [DesignReportCardComponent]
})
export class DesignReportCardModule { }
