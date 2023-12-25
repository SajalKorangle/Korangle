import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { StudentListFilterModalComponent } from './student-list-filter-modal/student-list-filter-modal.component';
import { ColumnFilterModalComponent } from './column-filter-modal/column-filter-modal.component';
import { NameReportDialog } from './name-report-dialog/name-report.dialog';

@NgModule({
    declarations: [StudentListFilterModalComponent, ColumnFilterModalComponent, NameReportDialog],
    imports: [ComponentsModule],
    exports: [StudentListFilterModalComponent, ColumnFilterModalComponent, NameReportDialog],
})
export class LocalComponentsModule { }
