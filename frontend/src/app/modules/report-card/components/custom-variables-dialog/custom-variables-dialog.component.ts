import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomVariable, CUSTOM_VARIABLE_TYPES, Layer } from './../../class/constants_3';
import { DesignReportCardCanvasAdapter} from './../../report-card-3/pages/design-report-card/design-report-card.canvas.adapter';

@Component({
  selector: 'app-custom-variables-dialog',
  templateUrl: './custom-variables-dialog.component.html',
  styleUrls: ['./custom-variables-dialog.component.css']
})
export class CustomVariablesDialogComponent implements OnInit {

  ca: DesignReportCardCanvasAdapter;
  layer: Layer;

  customVariablesList: CustomVariable[];
  newCustomVariableType: string = Object.keys(CUSTOM_VARIABLE_TYPES)[0];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { [key: string]: any }) {
    this.layer = data.layer;
    this.customVariablesList = data.layer.customVariables;
    this.ca = data.ca;
   }

  ngOnInit() {
  }

  customVariablesTypes(): string[]{
    return Object.keys(CUSTOM_VARIABLE_TYPES);
  }

  createCustomVariable() {
    if (CUSTOM_VARIABLE_TYPES[this.newCustomVariableType]) {
      this.customVariablesList.push(new CUSTOM_VARIABLE_TYPES[this.newCustomVariableType](this.layer.customVariables.length+1, this.layer));
    }
  }

  getMarksFormulaLayers() {
    const ca = this.ca;
    return ca.layers.filter(layer => layer.LAYER_TYPE == "MARKS" || layer.LAYER_TYPE=="FORMULA").filter(l=>l!=this.layer);
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
