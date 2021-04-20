import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../../components/components.module';
import { DeleteEmployeeComponent } from './delete-employee.component';
import { DeleteEmployeeRoutingModule } from './delete-employee.routing';

@NgModule({
    declarations: [DeleteEmployeeComponent],
    imports: [ComponentsModule, DeleteEmployeeRoutingModule],
    exports: [],
    providers: [],
    bootstrap: [DeleteEmployeeComponent],
})
export class DeleteEmployeeModule {}
