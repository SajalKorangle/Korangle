import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { StudentListFilterModalComponent } from './student-list-filter-modal/student-list-filter-modal.component';
import { ColumnFilterModalComponent } from './column-filter-modal/column-filter-modal.component';

@NgModule({
    declarations: [StudentListFilterModalComponent, ColumnFilterModalComponent],
    imports: [ComponentsModule],
    exports: [StudentListFilterModalComponent, ColumnFilterModalComponent],
})
export class LocalComponentsModule { }
