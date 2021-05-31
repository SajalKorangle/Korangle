import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineClassesRoutingModule } from './online-classes.routing';
import { OnlineClassesComponent } from './online-classes.component';

@NgModule({
  declarations: [OnlineClassesComponent],
  imports: [
    CommonModule,
    OnlineClassesRoutingModule
  ],
  bootstrap: [OnlineClassesComponent],
})
export class OnlineClassesModule { }
