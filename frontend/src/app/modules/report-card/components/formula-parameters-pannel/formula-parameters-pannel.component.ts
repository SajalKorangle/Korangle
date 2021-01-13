import { Component, OnInit, Input } from '@angular/core';
import { Layer } from './../../class/constants_3';
@Component({
  selector: 'app-formula-parameters-pannel',
  templateUrl: './formula-parameters-pannel.component.html',
  styleUrls: ['./formula-parameters-pannel.component.css']
})
export class FormulaParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

}
