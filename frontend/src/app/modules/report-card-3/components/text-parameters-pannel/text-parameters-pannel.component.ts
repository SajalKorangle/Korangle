import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { CanvasText } from './../../class/constants_3';
import { FONT_FAMILY_LIST } from './../../class/font';
import { VERTICAL_ALIGNMENT_LIST_MAP, HORIZONTAL_ALIGNMENT_LIST_MAP } from './../../class/constants_3'

@Component({
  selector: 'app-text-parameters-pannel',
  templateUrl: './text-parameters-pannel.component.html',
  styleUrls: ['./text-parameters-pannel.component.css']
})
export class TextParametersPannelComponent implements OnInit {

  @Input() layer: CanvasText;
  @Input() canvasRefresh: any;
  
  fontFamilyList = FONT_FAMILY_LIST;
  horizontalAlignmentKeyMap = HORIZONTAL_ALIGNMENT_LIST_MAP;
  verticalAlignmentKeyMapMap = VERTICAL_ALIGNMENT_LIST_MAP;

  constructor() { }

  ngOnInit() {
  }

  getPixelTommFactor(): number{
    return this.layer.ca.pixelTommFactor;
  }

  updateFontSize(newSize: number): void{
    newSize = newSize / this.getPixelTommFactor();
    this.layer.fontSize = newSize;
  }

  getFontSize(): number{
    return (Math.round(this.layer.fontSize*this.getPixelTommFactor() * 100))/100;
  }

  boldToggle(): void{
    this.layer.fontWeight = this.layer.fontWeight=='bold' ? 'normal' : 'bold';
  }

  italicToggle(): void{
    this.layer.italics = this.layer.italics=='italic' ? '': 'italic';
  }

  // underlineToggle(event): any{
  //   this.layer.underline = event.source.checked? true : false;
  // }


  getVerticalAlignmentKeys(): Array<string>{
    return Object.keys(VERTICAL_ALIGNMENT_LIST_MAP);
  }

  getHorizontalAlignmentKeys(): Array<string>{
    return Object.keys(HORIZONTAL_ALIGNMENT_LIST_MAP);
  }

  getWidth() {
    return Math.round(this.layer.maxWidth * this.getPixelTommFactor() * 100) / 100;
  }

  updateWidth(newWidth) {
    newWidth = newWidth / this.getPixelTommFactor();
    this.layer.maxWidth = newWidth;
  }

  getHeight() {
    return Math.round(this.layer.minHeight * this.getPixelTommFactor() * 100) / 100;
  }

  updateHeight(newHeight) {
    newHeight = newHeight / this.getPixelTommFactor();
    this.layer.minHeight = newHeight;
  }

}
