import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CommonSettingsComponent} from '@modules/module-components/common-settings/common-settings.component';
import {ComponentsModule} from '@components/components.module';

@NgModule({
    declarations: [CommonSettingsComponent],
    imports: [CommonModule, ComponentsModule],
    exports: [CommonSettingsComponent],
})
export class ModuleComponentsModule { }