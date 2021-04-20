import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialsComponent } from '@modules/tutorials/tutorials.component';
import { CommonModule } from '@angular/common';
import { AddTutorialModule } from '@modules/tutorials/pages/add-tutorial/add-tutorial.module';

const routes: Routes = [
    {
        path: 'add_tutorial',
        loadChildren: 'app/modules/tutorials/pages/add-tutorial/add-tutorial.module#AddTutorialModule',
        data: { moduleName: 'tutorials' },
    },
    {
        path: 'settings',
        loadChildren: 'app/modules/tutorials/pages/settings/settings.module#SettingsModule',
        data: { moduleName: 'attendance' },
    },
    {
        path: '',
        component: TutorialsComponent,
    },
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TutorialsRoutingModule {}
