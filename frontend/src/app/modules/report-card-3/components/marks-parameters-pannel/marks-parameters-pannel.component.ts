import { Component, OnInit, Input } from '@angular/core';
import { Layer } from './../../class/constants_3';

@Component({
  selector: 'app-marks-parameters-pannel',
  templateUrl: './marks-parameters-pannel.component.html',
  styleUrls: ['./marks-parameters-pannel.component.css']
})
export class MarksParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

}
