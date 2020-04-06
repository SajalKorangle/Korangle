import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { isMobile } from '../../../../../classes/common.js'
import {DataStorage} from '../../../../../classes/data-storage';

import {CustomReportCardService} from '../../../../../services/modules/custom_reportcard/custom_reportcard.service';
import {SetClassLayoutServiceAdapter} from './set-class-layout.service.adapter';
import {ClassService} from '../../../../../services/modules/class/class.service';

declare const $: any;

@Component({
  selector: 'app-set-class-layout',
  templateUrl: './set-class-layout.component.html',
  styleUrls: ['./set-class-layout.component.css'],
  providers:[
      CustomReportCardService,
      ClassService,
  ]
})

export class SetClassLayoutComponent implements OnInit {

  user;

  layoutList:any;
  classList:any;
  classLayoutList:any;


  serviceAdapter: SetClassLayoutServiceAdapter;
  isLoading = true;

  constructor(public customReportCardService:CustomReportCardService,
              public classService: ClassService,
              private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new SetClassLayoutServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  getLayoutMapped(classs){

    let classLayout = this.classLayoutList.find(item=>{
      if(item.parentClass == classs.id){
        return true;
      }
      return false;
    });

    if(classLayout == undefined) return 0;
    
    return this.layoutList.find(item=>{
      return item.id == classLayout.parentLayout;
    });
  }

}
