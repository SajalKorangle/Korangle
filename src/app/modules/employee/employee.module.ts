import { NgModule } from '@angular/core';

import { ComponentsModule } from '../../components/components.module';

import { EmployeeComponent } from './employee.component';

import { AddEmployeeComponent } from './pages/add-employee/add-employee.component';
import { ViewAllComponent } from './pages/view-all/view-all.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { AssignTaskComponent } from './pages/assign-task/assign-task.component';

import { EmployeeRoutingModule } from './employee.routing';

import { EmployeeService } from './employee.service';
import {ICardsComponent} from './pages/i-cards/i-cards.component';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ExperienceCertiComponent} from './pages/experience-certi/experience-certi.component';

@NgModule({
    declarations: [

        EmployeeComponent,

        AddEmployeeComponent,
        ViewAllComponent,
        UpdateProfileComponent,
        AssignTaskComponent,
        ICardsComponent,
        ExperienceCertiComponent,

    ],

    imports: [

        ComponentsModule,
        EmployeeRoutingModule,
        NgxDatatableModule

    ],
    exports: [
    ],
    providers: [EmployeeService],
    bootstrap: [EmployeeComponent]
})
export class EmployeeModule { }
