import { NgModule } from '@angular/core';
import { TextParametersPannelComponent} from './text-parameters-pannel/text-parameters-pannel.component'
import { ComponentsModule } from './../../../components/components.module'
import { MatButtonToggleModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AttendanceParametersPannelComponent } from './attendance-parameters-pannel/attendance-parameters-pannel.component';
import { PositionParameterPannelComponent } from './position-parameter-pannel/position-parameter-pannel.component';
import { MarksParametersPannelComponent } from './marks-parameters-pannel/marks-parameters-pannel.component';
import { FormulaParametersPannelComponent } from './formula-parameters-pannel/formula-parameters-pannel.component';
import { PageResolutionDialogComponent } from './page-resolution-dialog/page-resolution-dialog.component';
import { ResultDialogComponent } from './result-dialog/result-dialog.component'
import { ImageParametersPannelComponent } from './image-parameters-pannel/image-parameters-pannel.component';
import { ShapeParametersPannelComponent } from './shape-parameter-pannel/shape-parameters-pannel.component';
import { DateParametersPannelComponent } from './date-parameters-pannel/date-parameters-pannel.component';
import { GradeRulesDialogComponent } from './grade-rules-dialog/grade-rules-dialog.component';
import { MarksDialogComponent } from './marks-dialog/marks-dialog.component';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';
import { TableParameterPannelComponent } from './table-parameter-pannel/table-parameter-pannel.component';
import { GradeParametersPannelComponent } from './grade-parameters-pannel/grade-parameters-pannel.component';
import { RemarkParametersPannelComponent } from './remark-parameters-pannel/remark-parameter-pannel.component';
import { LayoutSharingDialogComponent } from './layout-sharing-dialog/layout-sharing-dialog.component';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog.component';
import { LayerReplacementDialogComponent } from './layer-replacement-dialog/layer-replacement-dialog.component';
import { SettingsParametersPannelComponent } from './settings-parameter-pannel/settings-parameters-pannel.component';
import { SessionParameterPannelComponent } from './session-parameter-pannel/session-parameter-pannel.component';

@NgModule({
  declarations: [
    TextParametersPannelComponent,
    AttendanceParametersPannelComponent,
    PositionParameterPannelComponent,
    MarksParametersPannelComponent,
    FormulaParametersPannelComponent,
    PageResolutionDialogComponent,
    ResultDialogComponent,
    ImageParametersPannelComponent,
    ShapeParametersPannelComponent,
    DateParametersPannelComponent,
    GradeRulesDialogComponent,
    MarksDialogComponent,
    CustomMenuComponent,
    TableParameterPannelComponent,
    GradeParametersPannelComponent,
    RemarkParametersPannelComponent,
    LayoutSharingDialogComponent,
    InventoryDialogComponent,
    LayerReplacementDialogComponent,
    SettingsParametersPannelComponent,
    SessionParameterPannelComponent,
  ],
  imports: [
    ComponentsModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  exports: [
    TextParametersPannelComponent,
    AttendanceParametersPannelComponent,
    PositionParameterPannelComponent,
    MarksParametersPannelComponent,
    FormulaParametersPannelComponent,
    PageResolutionDialogComponent,
    ImageParametersPannelComponent,
    ResultDialogComponent,
    ShapeParametersPannelComponent,
    DateParametersPannelComponent,
    GradeRulesDialogComponent,
    MarksDialogComponent,
    CustomMenuComponent,
    TableParameterPannelComponent,
    GradeParametersPannelComponent,
    RemarkParametersPannelComponent,
    LayoutSharingDialogComponent,
    InventoryDialogComponent,
    LayerReplacementDialogComponent,
    SettingsParametersPannelComponent,
    SessionParameterPannelComponent
  ]
})
export class ParametersPannelModule { }
