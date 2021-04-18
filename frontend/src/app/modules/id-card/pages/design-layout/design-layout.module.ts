import { NgModule } from '@angular/core';

import { DesignLayoutRoutingModule } from './design-layout.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ColorPickerModule } from 'ngx-color-picker';

import { DesignLayoutComponent } from './design-layout.component';

@NgModule({
    declarations: [DesignLayoutComponent],

    imports: [DesignLayoutRoutingModule, ComponentsModule, MatButtonToggleModule, MatIconModule, ColorPickerModule],
    exports: [],
    providers: [],
    bootstrap: [DesignLayoutComponent],
})
export class DesignLayoutModule {}
