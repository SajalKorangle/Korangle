import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DesignLayoutRouting } from './design-layout.routing';
import { DesignLayoutComponent } from './design-layout.component';

@NgModule({
  declarations: [DesignLayoutComponent],
  imports: [
    CommonModule,
    DesignLayoutRouting
  ],
  bootstrap: [DesignLayoutComponent]
})
export class DesignLayoutModule { }
