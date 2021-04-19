import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { MyCollectionComponent } from './my-collection.component';

const routes: Routes = [
    {
        path: '',
        component: MyCollectionComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MyCollectionRoutingModule {}
