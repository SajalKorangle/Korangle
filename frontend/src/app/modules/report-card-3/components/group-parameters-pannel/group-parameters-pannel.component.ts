import { Component, OnInit, Input } from '@angular/core';
import { CanvasGroup } from './../../class/constants_3';

@Component({
  selector: 'app-group-parameters-pannel',
  templateUrl: './group-parameters-pannel.component.html',
  styleUrls: ['./group-parameters-pannel.component.css']
})
export class GroupParametersPannelComponent implements OnInit {

  @Input() layer: CanvasGroup;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

  alignHorizontalLeft(): void{
    let commonX = this.layer.layers[0].x;
    this.layer.layers.forEach(l => {
      l.x = commonX;
    });
  }

  alignHorizontalCenter(): void{
    let commonCenterX = this.layer.layers[0].x +this.layer.layers[0].width/2;
    this.layer.layers.forEach(l => {
      l.x = commonCenterX-l.width/2;
    });
  }

  alignHorizontalRight(): void{
    let commonXPlusWidth = this.layer.layers[0].x + this.layer.layers[0].width;
    this.layer.layers.forEach(l => {
      l.x = commonXPlusWidth - l.width;
    });
  }

  alignVerticalTop(): void{
    let commonY = this.layer.layers[0].y;
    this.layer.layers.forEach(l => {
      l.y = commonY;
    });
  }

  alignVerticalCenter(): void{
    let commonCenterY = this.layer.layers[0].y + this.layer.layers[0].height/2;
    this.layer.layers.forEach(l => {
      l.y = commonCenterY-l.height/2;
    });
  }

  alignVerticalBottom(): void{
    let commonEndY = this.layer.layers[0].y+this.layer.layers[0].height;
    this.layer.layers.forEach(l => {
      l.y = commonEndY - l.height;
    });
  }

}
