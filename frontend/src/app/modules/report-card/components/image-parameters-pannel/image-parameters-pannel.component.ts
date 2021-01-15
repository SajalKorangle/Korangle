import { Component, OnInit, Input } from '@angular/core';
import { Layer, CanvasImage } from './../../class/constants_3';

@Component({
  selector: 'app-image-parameters-pannel',
  templateUrl: './image-parameters-pannel.component.html',
  styleUrls: ['./image-parameters-pannel.component.css']
})
export class ImageParametersPannelComponent implements OnInit {

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
