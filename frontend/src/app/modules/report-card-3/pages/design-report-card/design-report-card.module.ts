import { NgModule } from '@angular/core';
import {ComponentsModule} from "./../../../../components/components.module";
import { DesignReportCardComponent } from './design-report-card.component';
import { DesignReportCardRouting } from './design-report-card.routing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { ParametersPannelModule } from './../../components/parameters-pannel.module';
import { MatDialogModule} from '@angular/material/dialog';
import { PageResolutionDialogComponent } from './../../components/page-resolution-dialog/page-resolution-dialog.component';
import { ResultDialogComponent } from './../../components/result-dialog/result-dialog.component';
import { MarksDialogComponent } from './../../components/marks-dialog/marks-dialog.component';
import { GradeRulesDialogComponent } from './../../components/grade-rules-dialog/grade-rules-dialog.component';
import { LayoutSharingDialogComponent } from './../../components/layout-sharing-dialog/layout-sharing-dialog.component';
import { InventoryDialogComponent} from './../../components/inventory-dialog/inventory-dialog.component';

@NgModule({
  declarations: [DesignReportCardComponent],
  imports: [
    ComponentsModule,
    DesignReportCardRouting,
    MatDialogModule,
    MatButtonToggleModule,
    MatIconModule,
    ParametersPannelModule,
  ],
  entryComponents: [
    PageResolutionDialogComponent,
    ResultDialogComponent,
    MarksDialogComponent,
    GradeRulesDialogComponent,
    LayoutSharingDialogComponent,
    InventoryDialogComponent
  ],
  bootstrap: [DesignReportCardComponent]
})
export class DesignReportCardModule { }
