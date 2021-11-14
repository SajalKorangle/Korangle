import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesignLayoutComponent } from './design-layout.component';

const routes: Routes = [
  {
    path: '',
    component: DesignLayoutComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DesignLayoutRouting { }
