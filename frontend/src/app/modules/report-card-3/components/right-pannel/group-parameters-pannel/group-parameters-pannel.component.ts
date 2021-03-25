import { Component, OnInit, Input } from '@angular/core';
import { CanvasGroup } from '../../../class/constants_3';

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
      let dx = commonX - l.x;
      l.updatePosition(dx, 0);
    });
  }

  alignHorizontalCenter(): void{
    let commonCenterX = this.layer.layers[0].x +this.layer.layers[0].width/2;
    this.layer.layers.forEach(l => {
      let dx = (commonCenterX - l.width / 2) - l.x;
      l.updatePosition(dx, 0);
    });
  }

  alignHorizontalRight(): void{
    let commonXPlusWidth = this.layer.layers[0].x + this.layer.layers[0].width;
    this.layer.layers.forEach(l => {
      let dx = commonXPlusWidth - l.width - l.x;
      l.updatePosition(dx, 0);
    });
  }

  alignVerticalTop(): void{
    let commonY = this.layer.layers[0].y;
    this.layer.layers.forEach(l => {
      let dy = commonY - l.y;
      l.updatePosition(0, dy);
    });
  }

  alignVerticalCenter(): void{
    let commonCenterY = this.layer.layers[0].y + this.layer.layers[0].height/2;
    this.layer.layers.forEach(l => {
      let dy = (commonCenterY - l.height / 2) - l.y;
      l.updatePosition(0, dy);
    });
  }

  alignVerticalBottom(): void{
    let commonEndY = this.layer.layers[0].y+this.layer.layers[0].height;
    this.layer.layers.forEach(l => {
      let dy = commonEndY - l.height - l.y;
      l.updatePosition(0, dy);
    });
  }

  verticalAlignBelow(): void{ // all layers vertically afeter the first one
    let commonEndY = this.layer.layers[0].y + this.layer.layers[0].height;
    this.layer.layers.slice(1).forEach(l => {
      let dy = commonEndY - l.y;
      l.updatePosition(0, dy);
    });
  }

  verticalAlignAbove(): void{ // all layers vertically before the first one
    let commonY = this.layer.layers[0].y;
    this.layer.layers.slice(1).forEach(l => {
      let dy = commonY - l.height - l.y;
      l.updatePosition(0, dy);
    });
  }

  horizntallyAlignAfter(): void{
    let commonEndX = this.layer.layers[0].x + this.layer.layers[0].width;
    this.layer.layers.slice(1).forEach(l => {
      let dx = commonEndX - l.x;
      l.updatePosition(dx, 0);
    });
  }

  horizntallyAlignBefore(): void{
    let commonX = this.layer.layers[0].x;
    this.layer.layers.slice(1).forEach(l => {
      let dx = commonX - l.width - l.x;
      l.updatePosition(dx, 0);
    });
  }

}
