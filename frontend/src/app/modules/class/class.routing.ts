import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'update_class',
        loadChildren: 'app/modules/class/pages/update-class/update-class.module#UpdateClassModule',
        data: { moduleName: 'update_class' },
    },
    {
        path: 'assign_class',
        loadChildren: 'app/modules/class/pages/assign-class/assign-class.module#AssignClassModule',
        data: { moduleName: 'assign_class' },
    },
    {
        path: 'set_roll_number',
        loadChildren: 'app/modules/class/pages/set-roll-number/set-roll-number.module#SetRollNumberModule',
        data: { moduleName: 'set_roll_number' },
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassRoutingModule {}
