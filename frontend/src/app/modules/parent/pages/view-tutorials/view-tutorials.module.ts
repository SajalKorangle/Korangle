import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../../../components/components.module';
import { ViewTutorialsComponent } from '@modules/parent/pages/view-tutorials/view-tutorials.component';
import { ViewTutorialsRoutingModule } from '@modules/parent/pages/view-tutorials/view-tutorials.routing';

@NgModule({
    declarations: [ViewTutorialsComponent],

    imports: [ViewTutorialsRoutingModule, ComponentsModule],
    exports: [],
    providers: [],
    bootstrap: [ViewTutorialsComponent],
})
export class ViewTutorialsModule {}
