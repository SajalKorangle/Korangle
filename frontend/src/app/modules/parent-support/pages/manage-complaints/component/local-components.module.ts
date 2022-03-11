import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/components.module';
import { AssignEmployeeComponent } from './assign-employee/assign-employee.component';

@NgModule({
    declarations: [AssignEmployeeComponent],
    imports: [ComponentsModule],
    exports: [AssignEmployeeComponent],
})
export class LocalComponentsModule { }
