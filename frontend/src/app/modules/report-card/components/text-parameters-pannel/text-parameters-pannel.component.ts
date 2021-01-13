import { Component, Input, OnInit } from '@angular/core';
import { Layer } from './../../class/constants_3';
import { FONT_FAMILY_LIST } from './../../class/font';

@Component({
  selector: 'app-text-parameters-pannel',
  templateUrl: './text-parameters-pannel.component.html',
  styleUrls: ['./text-parameters-pannel.component.css']
})
export class TextParametersPannelComponent implements OnInit {

  @Input() layer: Layer;
  @Input() canvasRefresh: any;
  
  fontFamilyList = FONT_FAMILY_LIST ;

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

  onDateSelected(event){
    this.layer.date = new Date(event);
    this.layer.dateFormatting();
  }

  getCurrentDate():any{
    return this.layer.date.toISOString().substr(0,10);
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

  isUnderline(): boolean{
    return this.layer.underline;
  }

  underlineToggle(event): any{
    this.layer.underline = event.source.checked? true : false;
  }

  getFontFamily(): any{
    let fontArgumentsArray = this.layer.fontStyle.font.split(' ');
    let tempFontFamily = '';
    for(let i=3;i<fontArgumentsArray.length-1; i++){
      tempFontFamily = tempFontFamily + fontArgumentsArray[i] + ' ';

    }
    tempFontFamily = tempFontFamily + fontArgumentsArray[fontArgumentsArray.length - 1];
    // console.log(tempFontFamily);
    return this.fontFamilyList.find(fontfamily => fontfamily.displayName == tempFontFamily);

  }

  changeFont(font): any{
    let fontArgumentsArray = this.layer.fontStyle.font.split(' ');
    let tempFontArray = [];
    tempFontArray[0] = fontArgumentsArray[0];
    tempFontArray[1] = fontArgumentsArray[1];
    tempFontArray[2] = fontArgumentsArray[2];
    tempFontArray[3] = font.displayName;
    // console.log(tempFontArray);
    this.layer.fontStyle.font = tempFontArray.join(' ');
  }


  logMessage(toast, msg): void{
    console.log(toast,msg);
  }

}
