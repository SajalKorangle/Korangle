import { NgModule } from '@angular/core';

import { ViewDefaultersRoutingModule } from './view-defaulters.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewDefaultersComponent } from './view-defaulters.component';

import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [ViewDefaultersComponent],

    imports: [ViewDefaultersRoutingModule, ComponentsModule,
        // Material Modules for Datatable, List and Buttons
        MatTableModule,
        MatListModule,
        MatButtonModule],
    exports: [],
    providers: [],
    bootstrap: [ViewDefaultersComponent],
})
export class ViewDefaultersModule {}
