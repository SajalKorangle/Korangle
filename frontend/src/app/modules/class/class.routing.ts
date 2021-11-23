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
    {
        path: 'promote_student',
        loadChildren: 'app/modules/class/pages/promote-student/promote-student.module#PromoteStudentModule',
        data: { moduleName: 'class' },
    },
    {
        path: 'change_class',
        loadChildren: 'app/modules/class/pages/change-class/change-class.module#ChangeClassModule',
        data: { moduleName: 'class' },
    },
    {
        path: 'demote_student',
        loadChildren: 'app/modules/class/pages/demote-student/demote-student.module#DemoteStudentModule',
        data: { moduleName: 'class' },
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassRoutingModule {}
