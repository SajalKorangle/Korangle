import { NgModule } from '@angular/core';
import {ComponentsModule} from "./../../../../components/components.module";
import { DesignReportCardComponent } from './design-report-card.component';
import { DesignReportCardRouting } from './design-report-card.routing';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatIconModule} from '@angular/material/icon';
import { ParametersPannelModule } from './../../components/parameters-pannel.module';
import { MatDialogModule} from '@angular/material/dialog';
import { PageResolutionDialogComponent } from '../../components/dialogs/page-resolution-dialog/page-resolution-dialog.component';
import { ResultDialogComponent } from '../../components/dialogs/result-dialog/result-dialog.component';
import { MarksDialogComponent } from '../../components/dialogs/marks-dialog/marks-dialog.component';
import { GradeRulesDialogComponent } from '../../components/dialogs/grade-rules-dialog/grade-rules-dialog.component';
import { LayoutSharingDialogComponent } from '../../components/dialogs/layout-sharing-dialog/layout-sharing-dialog.component';
import { InventoryDialogComponent} from '../../components/dialogs/inventory-dialog/inventory-dialog.component';
import { LayerReplacementDialogComponent } from '../../components/dialogs/layer-replacement-dialog/layer-replacement-dialog.component';
import { ExamMappingDialogComponent } from './../../components/dialogs/exam-mapping-dialog/exam-mapping-dialog.component'

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
    InventoryDialogComponent,
    LayerReplacementDialogComponent,
    ExamMappingDialogComponent
  ],
  bootstrap: [DesignReportCardComponent]
})
export class DesignReportCardModule { }
