import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignLayoutRouting } from './design-layout.routing';
import { DesignLayoutComponent } from './design-layout.component';

import { ParametersPannelModule } from '@modules/my-design/components/parameters-pannel.module';
@NgModule({
  declarations: [DesignLayoutComponent],
  imports: [
    CommonModule,
    DesignLayoutRouting,
    ParametersPannelModule
  ],
  bootstrap: [DesignLayoutComponent]
})
export class DesignLayoutModule { }
