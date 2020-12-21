import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../components/components.module';
import { ReportCardComponent } from './report-card.component'
import { ReportCardRoutingModule } from './report-card.routing';


@NgModule({
  declarations: [ReportCardComponent],
  imports: [
    ComponentsModule,
    ReportCardRoutingModule
  ],
  bootstrap: [ReportCardComponent]
})
export class ReportCardModule { }
