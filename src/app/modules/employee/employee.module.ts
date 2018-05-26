import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { EmployeeComponent } from './employee.component';

import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';

import { EmployeeRoutingModule } from './employee.routing';

import { EmployeeService } from './employee.service';

@NgModule({
    declarations: [

        EmployeeComponent,

        AddEmployeeComponent,
        ViewAllComponent,
        UpdateProfileComponent,

    ],

    imports: [

        ComponentsModule,
        EmployeeRoutingModule,

    ],
    exports: [
    ],
    providers: [EmployeeService],
    bootstrap: [EmployeeComponent]
})
export class EmployeeModule { }
