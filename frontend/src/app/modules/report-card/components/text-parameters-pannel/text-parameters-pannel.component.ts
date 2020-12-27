import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-parameters-pannel',
  templateUrl: './text-parameters-pannel.component.html',
  styleUrls: ['./text-parameters-pannel.component.css']
})
export class TextParametersPannelComponent implements OnInit {

  @Input() static staticRight: any = 55;
  @Input() static staticTop: any = 12;
  right: any;
  top: any;
  opacity: number = 1;

  lastMouseX: number;
  lastMouseY: number;

  constructor() { }

  ngOnInit() {
    this.right = TextParametersPannelComponent.staticRight;
    this.top = TextParametersPannelComponent.staticTop;
  }

  
  dragStartHandler(event: MouseEvent): void{
    this.lastMouseX = event.x;
    this.lastMouseY = event.y;
    this.opacity = 0.4;
    console.log('dragstart: ', event);
  }
  dragEndHandler(event: MouseEvent): void{
    this.right = parseInt(this.right) - (event.x - this.lastMouseX);
    this.top = parseInt(this.top) + (event.y - this.lastMouseY);
    this.opacity = 1;
    TextParametersPannelComponent.staticTop = this.top;
    TextParametersPannelComponent.staticRight = this.right
    console.log('draend: ', event);
  }

  logMessage(toast, msg): void{
    console.log(toast,msg);
  }

}
