import { Component, OnInit, Input } from '@angular/core';
import { Formula } from '../../../class/constants_3';
@Component({
  selector: 'app-formula-parameters-pannel',
  templateUrl: './formula-parameters-pannel.component.html',
  styleUrls: ['./formula-parameters-pannel.component.css']
})
export class FormulaParametersPannelComponent implements OnInit {

  @Input() layer: Formula;
  @Input() canvasRefresh: any;
  previousScheduledUpdateId: any;

  constructor() { }

  ngOnInit() {
  }

  smartLayerUpdate(delay:number = 1500): void{
    clearTimeout(this.previousScheduledUpdateId);
    this.previousScheduledUpdateId = setTimeout(() => {
      this.layer.layerDataUpdate();
      this.canvasRefresh();
    }, delay);
  }

}
