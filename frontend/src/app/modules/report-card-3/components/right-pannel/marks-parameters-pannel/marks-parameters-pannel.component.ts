import { Component, OnInit, Input } from '@angular/core';
import { MarksLayer } from '../../../class/constants_3';

@Component({
  selector: 'app-marks-parameters-pannel',
  templateUrl: './marks-parameters-pannel.component.html',
  styleUrls: ['./marks-parameters-pannel.component.css']
})
export class MarksParametersPannelComponent implements OnInit {

  @Input() layer: MarksLayer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

}
