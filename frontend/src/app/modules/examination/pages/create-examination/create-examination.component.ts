import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ExaminationService } from '../../../../services/modules/examination/examination.service';

import { CreateExaminationServiceAdapter } from './create-examination.service.adapter';
import { DataStorage } from '../../../../classes/data-storage';

@Component({
    selector: 'create-examination',
    templateUrl: './create-examination.component.html',
    styleUrls: ['./create-examination.component.css'],
    providers: [ExaminationService],
})
export class CreateExaminationComponent implements OnInit {
    user;

    examinationList: any;
    examinationNameToBeAdded = null;
    // examinationStatusToBeAdded = null;

    serviceAdapter: CreateExaminationServiceAdapter;

    isLoading = false;

    @ViewChild('scrollViewport',{static:false})
    private cdkVirtualScrollViewport;

    constructor(public examinationService: ExaminationService) {}

    ngOnInit(): void {
        this.user = DataStorage.getInstance().getUser();

        this.serviceAdapter = new CreateExaminationServiceAdapter();
        this.serviceAdapter.initializeAdapter(this);
        this.serviceAdapter.initializeData();
    }

    isExaminationUpdateDisabled(examination: any): boolean {
        if ((examination.newName == examination.name && examination.newStatus == examination.status) || examination.updating) {
            return true;
        }
        return false;
    }

    calculateContainerHeight(): string {
        const numberOfItems = this.examinationList.length;
        // This should be the height of your item in pixels
        const itemHeight = 83;
        // The final number of items you want to keep visible
        const visibleItems = 7;
      
        setTimeout(() => {
      
          this.cdkVirtualScrollViewport.checkViewportSize();
        }, 300);
      
        if (numberOfItems <= visibleItems) {
          return `${itemHeight * (numberOfItems)}px`;
        }
      
        return `${itemHeight * visibleItems}px`;
      }
}
