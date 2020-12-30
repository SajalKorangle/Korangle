import { Component, Input, OnInit } from '@angular/core';
import { Layer} from './../../class/constants_3'

@Component({
  selector: 'app-text-parameters-pannel',
  templateUrl: './text-parameters-pannel.component.html',
  styleUrls: ['./text-parameters-pannel.component.css']
})
export class TextParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;

  constructor() { }

  ngOnInit() {
  }

  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

  updateFontSize(newSize: number): void{
    newSize = newSize / this.getPixelTommFactor();
    const fontArgumentsArray = this.layer.fontStyle.font.split(' ');
    fontArgumentsArray[2] = newSize + 'px';
    this.layer.fontStyle.font = fontArgumentsArray.join(' ');
  }

  getFontSize(): string{
    let [,,fontSize] = this.layer.fontStyle.font.split(' ');
    return (parseFloat(fontSize.substr(0, fontSize.length - 2))*this.getPixelTommFactor()).toFixed(2);
  }

  boldToggle(event): void{
    let fontArgumentsArray = this.layer.fontStyle.font.split(' ');
    fontArgumentsArray[1] = event.source.checked ? 'bold' : 'normal';
    this.layer.fontStyle.font = fontArgumentsArray.join(' ');
  }

  italicToggle(event): void{
    let fontArgumentsArray = this.layer.fontStyle.font.split(' ');
    fontArgumentsArray[0] = event.source.checked ? 'italic' : '';
    this.layer.fontStyle.font = fontArgumentsArray.join(' ');
  }

  isBold(): boolean{
    let fontArgumentsArray = this.layer.fontStyle.font.split(' ');
    return fontArgumentsArray[1] == 'bold';
  }
   
  isItalics(): boolean{
    let fontArgumentsArray = this.layer.fontStyle.font.split(' ');
    return fontArgumentsArray[0] == 'italic';
  }

  logMessage(toast, msg): void{
    console.log(toast,msg);
  }

}
