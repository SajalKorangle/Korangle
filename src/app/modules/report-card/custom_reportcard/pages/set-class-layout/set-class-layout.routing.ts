import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SetClassLayoutComponent } from './set-class-layout.component';

const routes: Routes = [
    {
        path: '',
        component: SetClassLayoutComponent,
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
export class SetClassLayoutRouting { }
