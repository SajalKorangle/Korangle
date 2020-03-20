import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {DeleteBusStopComponent} from "./delete-bus-stop.component";

const routes: Routes = [
    {
        path: '',
        component: DeleteBusStopComponent ,
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
export class DeleteBusStopRoutingModule { }
