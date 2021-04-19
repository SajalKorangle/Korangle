import { NgModule } from '@angular/core';
import { TextParametersPannelComponent } from './right-pannel/text-parameters-pannel/text-parameters-pannel.component';
import { ComponentsModule } from './../../../components/components.module';
import { MatButtonToggleModule } from '@angular/material';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AttendanceParametersPannelComponent } from './right-pannel/attendance-parameters-pannel/attendance-parameters-pannel.component';
import { PositionParameterPannelComponent } from './right-pannel/position-parameter-pannel/position-parameter-pannel.component';
import { PageResolutionDialogComponent } from './dialogs/page-resolution-dialog/page-resolution-dialog.component';
import { ImageParametersPannelComponent } from './right-pannel/image-parameters-pannel/image-parameters-pannel.component';
import { ShapeParametersPannelComponent } from './right-pannel/shape-parameter-pannel/shape-parameters-pannel.component';
import { DateParametersPannelComponent } from './right-pannel/date-parameters-pannel/date-parameters-pannel.component';
import { CustomMenuComponent } from './custom-menu/custom-menu.component';
import { TableParameterPannelComponent } from './right-pannel/table-parameter-pannel/table-parameter-pannel.component';
import { LayoutSharingDialogComponent } from './dialogs/layout-sharing-dialog/layout-sharing-dialog.component';
import { InventoryDialogComponent } from './dialogs/inventory-dialog/inventory-dialog.component';
import { LayerReplacementDialogComponent } from './dialogs/layer-replacement-dialog/layer-replacement-dialog.component';
import { SettingsParametersPannelComponent } from './right-pannel/settings-parameter-pannel/settings-parameters-pannel.component';
import { SessionParameterPannelComponent } from './right-pannel/session-parameter-pannel/session-parameter-pannel.component';
import { GroupParametersPannelComponent } from './right-pannel/group-parameters-pannel/group-parameters-pannel.component';
import { TCDefaultParametersDialogComponent } from './dialogs/tc-default-parameters-dialog/tc-default-parameters-dialog.component';

@NgModule({
    declarations: [
        TextParametersPannelComponent,
        AttendanceParametersPannelComponent,
        PositionParameterPannelComponent,
        PageResolutionDialogComponent,
        ImageParametersPannelComponent,
        ShapeParametersPannelComponent,
        DateParametersPannelComponent,
        CustomMenuComponent,
        TableParameterPannelComponent,
        LayoutSharingDialogComponent,
        InventoryDialogComponent,
        LayerReplacementDialogComponent,
        SettingsParametersPannelComponent,
        SessionParameterPannelComponent,
        GroupParametersPannelComponent,
        TCDefaultParametersDialogComponent,
    ],
    imports: [ComponentsModule, MatButtonToggleModule, MatSlideToggleModule, MatProgressSpinnerModule],
    exports: [
        TextParametersPannelComponent,
        AttendanceParametersPannelComponent,
        PositionParameterPannelComponent,
        PageResolutionDialogComponent,
        ImageParametersPannelComponent,
        ShapeParametersPannelComponent,
        DateParametersPannelComponent,
        CustomMenuComponent,
        TableParameterPannelComponent,
        LayoutSharingDialogComponent,
        InventoryDialogComponent,
        LayerReplacementDialogComponent,
        SettingsParametersPannelComponent,
        SessionParameterPannelComponent,
        GroupParametersPannelComponent,
        TCDefaultParametersDialogComponent,
    ],
})
export class ParametersPannelModule {}
