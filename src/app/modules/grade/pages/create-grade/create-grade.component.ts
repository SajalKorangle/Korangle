import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../../../classes/data-storage';
import { CreateGradeServiceAdapter } from './create-grade.service.adapter';
import { GradeService } from '../../../../services/modules/grade/grade.service';

@Component({
  selector: 'app-create-grade',
  templateUrl: './create-grade.component.html',
  styleUrls: ['./create-grade.component.css'],
  providers:[GradeService]
})
export class CreateGradeComponent implements OnInit {

  user;

  isLoading = true;

  serviceAdapter: CreateGradeServiceAdapter;

  gradeList = [];
  subGradeList = [];
  gradeNameToBeAdded: any;
  subGradeNameToBeAdded: any;
  isGradeGettingAdded = false;

  whichGradeIsDeleted = null;
  whichGradeIsUpdated = null;
  whichSubGradeIsUpdated = null;


  constructor(public gradeService:GradeService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new CreateGradeServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

  isSubgradeUpdateDisabled(subgrade: any){
    if (subgrade.newName == subgrade.name || this.isThisSubGradeGettingUpdated(subgrade)) {
      return true;
    }
    return false;
  }

  isNewSubGradeAdded(grade: any){
    if(this.isThisGradeGettingUpdated(grade)==false && this.subGradeNameToBeAdded == ""){
      return "";
    }
    return this.subGradeNameToBeAdded;
  }

  isThisGradeGettingDeleted(grade: any){
    if(this.whichGradeIsDeleted == null){
      return false;
    }
    if(grade.id == this.whichGradeIsDeleted.id){
      return true;
    }
  }


  isThisGradeGettingUpdated(grade: any){
    if(this.whichGradeIsUpdated == null){
      return false;
    }
    if(grade.id == this.whichGradeIsUpdated.id){
      return true;
    }
  }

  isThisSubGradeGettingUpdated(subGrade: any){
    if(this.whichSubGradeIsUpdated == null){
      return false;
    }
    if(subGrade.id == this.whichSubGradeIsUpdated.id){
      return true;
    }
  }
}
