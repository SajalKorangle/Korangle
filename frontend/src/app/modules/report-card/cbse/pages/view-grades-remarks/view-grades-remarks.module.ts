import { NgModule } from '@angular/core';

import { ViewGradesRemarksRouting } from './view-grades-remarks.routing';
import { ComponentsModule } from '../../../../../components/components.module';
import { ViewGradesRemarksComponent } from './view-grades-remarks.component';

@NgModule({
    declarations: [ViewGradesRemarksComponent],

    imports: [ViewGradesRemarksRouting, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ViewGradesRemarksComponent],
})
export class ViewGradesRemarksModule {}
