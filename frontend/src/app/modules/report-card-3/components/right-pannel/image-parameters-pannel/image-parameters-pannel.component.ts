import { Component, OnInit, Input } from '@angular/core';
import { CanvasImage } from '../../../class/constants_3';

@Component({
  selector: 'app-image-parameters-pannel',
  templateUrl: './image-parameters-pannel.component.html',
  styleUrls: ['./image-parameters-pannel.component.css']
})
export class ImageParametersPannelComponent implements OnInit {

  @Input() layer: CanvasImage;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
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

  updateRadius(value:any) {
     this.layer.radius=Number(value);
  }
}
