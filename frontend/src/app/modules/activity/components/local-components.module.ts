import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../components/components.module';
import { FilterModalComponent } from './filter-modal/filter-modal.component';

@NgModule({
    declarations: [FilterModalComponent],
    imports: [ComponentsModule],
    exports: [FilterModalComponent],
})
export class LocalComponentsModule { }
