import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TutorialsComponent} from '@modules/tutorials/tutorials.component';
import {CommonModule} from '@angular/common';


const routes: Routes = [
      {
        path: 'add_tutorial',
        loadChildren: 'app/modules/tutorials/pages/add-tutorial/add-tutorial.module#AddTutorialModule',
        data: {moduleName: 'tutorials'},
    },
    {
        path: '',
        component: TutorialsComponent,
    },
];

@NgModule({
  imports: [CommonModule,
      RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorialsRoutingModule { }
