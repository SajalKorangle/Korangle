import { Component, OnInit } from '@angular/core';
import {DataStorage} from '../../../../classes/data-storage';

@Component({
  selector: 'app-create-grade',
  templateUrl: './create-grade.component.html',
  styleUrls: ['./create-grade.component.css']
})
export class CreateGradeComponent implements OnInit {

  user;

  isLoading = true;

  constructor() { }

  ngOnInit() {
    this.user = DataStorage.getInstance().getUser();
  }

}
