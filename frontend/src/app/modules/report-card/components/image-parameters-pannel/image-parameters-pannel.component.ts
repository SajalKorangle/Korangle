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

  getImageHeight(): any{
    return Math.round(this.layer.height*this.getPixelTommFactor() * 100) / 100;
  }

  getImageWidth(): any{
    return Math.round(this.layer.width*this.getPixelTommFactor() * 100) / 100;
  }
  
  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

}
