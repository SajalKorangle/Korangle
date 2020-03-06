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
  newSubGradeName= "";


  constructor(public gradeService:GradeService) { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
    this.serviceAdapter = new CreateGradeServiceAdapter();
    this.serviceAdapter.initializeAdapter(this);
    this.serviceAdapter.initializeData();
  }

}
