import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';

import { PositionPanelComponent } from './panels/position-panel/position-panel.component';
import { SettingsPanelComponent } from './panels/settings-panel/settings-panel.component';

@NgModule({
    declarations: [
        PositionPanelComponent,
        SettingsPanelComponent,
    ],
    imports: [
        ComponentsModule
    ],
    exports: [
        PositionPanelComponent,
        SettingsPanelComponent,
    ]
})
export class CoreComponentModule { }
