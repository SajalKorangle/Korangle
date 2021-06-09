import { NgModule } from '@angular/core';

import { DesignTCRoutingModule } from './design-tc.routing';
import { ComponentsModule } from '../../../../components/components.module';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ParametersPannelModule } from './../../components/parameters-pannel.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PageResolutionDialogComponent } from '../../components/dialogs/page-resolution-dialog/page-resolution-dialog.component';
import { LayoutSharingDialogComponent } from '../../components/dialogs/layout-sharing-dialog/layout-sharing-dialog.component';
import { InventoryDialogComponent } from '../../components/dialogs/inventory-dialog/inventory-dialog.component';
import { LayerReplacementDialogComponent } from '../../components/dialogs/layer-replacement-dialog/layer-replacement-dialog.component';
import { TCDefaultParametersDialogComponent } from './../../components/dialogs/tc-default-parameters-dialog/tc-default-parameters-dialog.component';

import { DesignTCComponent } from './design-tc.component';

@NgModule({
    declarations: [DesignTCComponent],

    imports: [DesignTCRoutingModule, ComponentsModule, MatDialogModule, MatButtonToggleModule, MatIconModule, ParametersPannelModule],
    entryComponents: [
        PageResolutionDialogComponent,
        LayoutSharingDialogComponent,
        InventoryDialogComponent,
        LayerReplacementDialogComponent,
        TCDefaultParametersDialogComponent,
    ],
    bootstrap: [DesignTCComponent],
})
export class DesignTCModule {}
