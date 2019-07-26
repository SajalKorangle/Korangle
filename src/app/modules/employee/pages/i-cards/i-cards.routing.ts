import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {ICardsComponent} from "./i-cards.component";


const routes: Routes = [
    {
        path: '',
        component: ICardsComponent ,
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
export class ICardsRoutingModule { }
