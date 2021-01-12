import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomVariable, CUSTOM_VARIABLE_TYPES, Result} from './../../class/constants_3';
import { DesignReportCardCanvasAdapter } from './../../report-card-3/pages/design-report-card/design-report-card.canvas.adapter';


@Component({
  selector: 'app-result-dialog',
  templateUrl: './result-dialog.component.html',
  styleUrls: ['./result-dialog.component.css']
})
export class ResultDialogComponent implements OnInit {

  ca: DesignReportCardCanvasAdapter;
  layer: Result;

  marksVariables: CustomVariable[];
  newCustomVariableType: string = Object.keys(CUSTOM_VARIABLE_TYPES)[1];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.layer = data.layer;
    this.marksVariables = data.layer.marksVariables;
    this.ca = data.ca;
    console.log('marks variable: ', this.marksVariables)
   }

  ngOnInit() {
  }

  customVariablesTypes(): string[]{
    return Object.keys(CUSTOM_VARIABLE_TYPES).slice(1);
  }

  createCustomVariable() {
    if (CUSTOM_VARIABLE_TYPES[this.newCustomVariableType]) {
      let newVariable = new CUSTOM_VARIABLE_TYPES[this.newCustomVariableType](this.layer.marksVariables.length + 1, this.layer);
      newVariable.isMarks = false;
      this.marksVariables.push(newVariable);
    }
  }

  getMarksVariables(): CustomVariable[]{
    return this.marksVariables.filter(m => m.isMarks);
  }

  getMarksFormulaLayers() {
    const ca = this.ca;
    return ca.layers.filter(layer => layer.LAYER_TYPE == "MARKS" || layer.LAYER_TYPE=="FORMULA");
  }

  getExaminationList() {
    const DATA = this.ca.vm.DATA;
    return DATA.data.examinationList;
  }

  getSubjectList() {
    const DATA = this.ca.vm.DATA;
    return DATA.data.subjectList;
  }

  getTestTypeList() {
    const htmlAdapter = this.ca.vm.htmlAdapter;
    return htmlAdapter.testTypeList;
  }

  getMarksTypeList() {
    const htmlAdapter = this.ca.vm.htmlAdapter;
    return htmlAdapter.marksTypeList;
  }

}
