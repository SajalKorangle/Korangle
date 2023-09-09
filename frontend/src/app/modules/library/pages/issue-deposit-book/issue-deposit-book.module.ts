import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueDepositBookComponent } from './issue-deposit-book.component';
import { IssueDepositBookRouting } from './issue-deposit-book.routing';
import { ComponentsModule } from "@components/components.module";



@NgModule({
  declarations: [IssueDepositBookComponent],
  imports: [
    IssueDepositBookRouting,
    CommonModule,
    ComponentsModule,
  ],
  exports: [],
  providers: [],
  bootstrap: [IssueDepositBookComponent]
})
export class IssueDepositBookModule { }