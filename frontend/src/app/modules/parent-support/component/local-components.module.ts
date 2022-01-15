import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../components/components.module';
import { AddStatusModalComponent } from './add-status-modal/add-status-modal.component';
import { AssignEmployeeComponent } from './assign-employee/assign-employee.component';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { FormatTableModalComponent } from './format-table-modal/format-table-modal.component';

@NgModule({
    declarations: [AddStatusModalComponent, AssignEmployeeComponent, FilterModalComponent, FormatTableModalComponent],
    imports: [ComponentsModule],
    exports: [AddStatusModalComponent, AssignEmployeeComponent, FilterModalComponent, FormatTableModalComponent],
})
export class LocalComponentsModule { }
