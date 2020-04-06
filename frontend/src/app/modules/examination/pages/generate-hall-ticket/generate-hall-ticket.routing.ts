import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {GenerateHallTicketComponent} from "./generate-hall-ticket.component";

const routes: Routes = [
    {
        path: '',
        component: GenerateHallTicketComponent ,
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule,
    ],
})
export class GenerateHallTicketRoutingModule { }
