import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { DeleteBookComponent } from './delete-book.component';

const routes: Routes = [
    {
        path: '',
        component: DeleteBookComponent ,
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
export class DeleteBookRouting { }
