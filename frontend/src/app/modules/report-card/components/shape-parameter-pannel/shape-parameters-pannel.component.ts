import { Component, OnInit, Input } from '@angular/core';
import { Layer } from './../../class/constants_3';

@Component({
  selector: 'app-shape-parameters-pannel',
  templateUrl: './shape-parameters-pannel.component.html',
  styleUrls: ['./shape-parameters-pannel.component.css']
})
export class ShapeParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

  logMessage(tag, msg) {
    console.log(tag, msg);
  }

  
  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

}
