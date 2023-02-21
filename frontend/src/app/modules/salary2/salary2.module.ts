import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../components/components.module';
import { Salary2Component } from './salary2.component';
import { Salary2RoutingModule } from './salary2.routing';

@NgModule({
    declarations: [
        Salary2Component,
    ],

    imports: [ComponentsModule, Salary2RoutingModule],
    exports: [],
    providers: [],
    bootstrap: [Salary2Component],
})
export class Salary2Module {}
