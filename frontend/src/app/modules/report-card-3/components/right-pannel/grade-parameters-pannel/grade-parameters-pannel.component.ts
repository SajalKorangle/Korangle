import { Component, OnInit, Input } from '@angular/core';
import { GradeLayer } from '../../../class/constants_3';

@Component({
  selector: 'app-grade-parameters-pannel',
  templateUrl: './grade-parameters-pannel.component.html',
  styleUrls: ['./grade-parameters-pannel.component.css']
})
export class GradeParametersPannelComponent implements OnInit {

  @Input() layer: GradeLayer;
  @Input() canvasRefresh: any;

  parentGrade: any;

  constructor() { }

  ngOnInit() {
    if (this.layer.subGradeId) {
      let subGrade = this.layer.ca.vm.DATA.data.subGradeList.find(subGrade => subGrade.id == this.layer.subGradeId);
      this.parentGrade = this.layer.ca.vm.DATA.data.gradeList.find(grade => grade.id = subGrade.parentGrade).id;
    }
  }

  getFilteredSubGradeList(): Array<{ [key: string]: any }>{
    return this.layer.ca.vm.DATA.data.subGradeList.filter(subGrade => subGrade.parentGrade = this.parentGrade);
  }

}
