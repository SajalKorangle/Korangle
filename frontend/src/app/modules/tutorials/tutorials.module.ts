import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialsRoutingModule } from './tutorials.routing';
import {TutorialsComponent} from '@modules/tutorials/tutorials.component';
import {TutorialsService} from '@services/modules/tutorials/tutorials.service';


@NgModule({
  declarations: [TutorialsComponent],
  imports: [
    CommonModule,
    TutorialsRoutingModule
  ],
  providers: [TutorialsService],
  bootstrap: [TutorialsComponent],
})
export class TutorialsModule { }
