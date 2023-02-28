import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { UpdateBookComponent } from './update-book.component';

const routes: Routes = [
    {
        path: '',
        component: UpdateBookComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class UpdateBookRoutingModule {}
