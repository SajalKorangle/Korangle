import { NgModule } from '@angular/core';
import { ViewListRoutingModule } from './view-list.routing';
import { ComponentsModule } from '../../../../components/components.module';
import { ViewListComponent } from './view-list.component';
import { LocalComponentsModule } from './component/local-components.module';
import { StudentListFilterModalComponent } from './component/student-list-filter-modal/student-list-filter-modal.component';
import { ColumnFilterModalComponent } from './component/column-filter-modal/column-filter-modal.component';


@NgModule({
    declarations: [ViewListComponent],

    imports: [
        ViewListRoutingModule,
        ComponentsModule,
        LocalComponentsModule
    ],
    exports: [],
    providers: [],
    bootstrap: [ViewListComponent],
    entryComponents: [StudentListFilterModalComponent, ColumnFilterModalComponent]
})
export class ViewListModule {}
