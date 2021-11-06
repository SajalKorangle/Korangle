import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';

import { PositionPanelComponent } from './panels/position-panel/position-panel.component';

@NgModule({
    declarations: [
        PositionPanelComponent
    ],
    imports: [
        ComponentsModule
    ],
    exports: [
        PositionPanelComponent
    ]
})
export class CoreComponentModule { }
