import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PlaceHolderComponent } from './placeholder.component';

const routes: Routes = [
    {
        path: '',
        component: PlaceHolderComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PlaceHolderRoutingModule {}