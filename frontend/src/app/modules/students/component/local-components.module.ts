import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../components/components.module';
import { FilterModalComponent } from './filter-modal/filter-modal.component';
import { FormatTableModalComponent } from './format-table-modal/format-table-modal.component';

@NgModule({
    declarations: [FilterModalComponent, FormatTableModalComponent],
    imports: [ComponentsModule],
    exports: [FilterModalComponent, FormatTableModalComponent],
})
export class LocalComponentsModule { }
