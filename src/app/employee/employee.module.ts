import { NgModule } from '@angular/core';

import { EmployeeComponent } from './employee.component';

import { EmployeeProfileComponent } from './pages/employee-profile/employee-profile.component';
import {EmployeeRoutingModule} from './employee.routing';


@NgModule({
    declarations: [

        EmployeeComponent,

        EmployeeProfileComponent,

    ],

    imports: [

        EmployeeRoutingModule

    ],
    exports: [
    ],
    providers: [],
    bootstrap: [EmployeeComponent]
})
export class EmployeeModule { }
