import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';

import { PositionPanelComponent } from './panels/position-panel/position-panel.component';
import { SettingsPanelComponent } from './panels/settings-panel/settings-panel.component';
import { ImagePanelComponent } from './panels/image-panel/image-panel.component';

@NgModule({
    declarations: [
        PositionPanelComponent,
        SettingsPanelComponent,
        ImagePanelComponent,
    ],
    imports: [
        ComponentsModule
    ],
    exports: [
        PositionPanelComponent,
        SettingsPanelComponent,
        ImagePanelComponent
    ]
})
export class CoreComponentModule { }
