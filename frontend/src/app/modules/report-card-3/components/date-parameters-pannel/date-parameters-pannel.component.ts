import { Component, OnInit, Input } from '@angular/core';
import { CanvasDate } from './../../class/constants_3';

@Component({
  selector: 'app-date-parameters-pannel',
  templateUrl: './date-parameters-pannel.component.html',
  styleUrls: ['./date-parameters-pannel.component.css']
})
export class DateParametersPannelComponent implements OnInit {

  @Input() layer: CanvasDate;
  @Input() canvasRefresh: any;

  dayFormat: any;
  monthFormat: any;
  yearFormat: any;
  dateFormat: any;
  firstSeparator: any;
  secondSeparator: any;

  constructor() { }

  ngOnInit() {
  }

  getDayFormat(): any{
    let str = this.layer.dateFormat;
    let tempStr = '<'
    for(let i=0;i<str.length; i++){
      if(str[i]=='d'){
        tempStr += 'd';
      }
    }
    tempStr += '>';
    this.dayFormat = tempStr;
    return this.dayFormat;
  }

  
  getMonthFormat(): any{
    let str = this.layer.dateFormat;
    let tempStr = '<'
    for(let i=0;i<str.length; i++){
      if(str[i]=='m'){
        tempStr += 'm';
      }
    }
    tempStr += '>';
    this.monthFormat = tempStr;
    return this.monthFormat;
  }

  
  getYearFormat(): any{
    let str = this.layer.dateFormat;
    let tempStr = '<'
    for(let i=0;i<str.length; i++){
      if(str[i]=='y'){
        tempStr += 'y';
      }
    }
    tempStr += '>';
    this.yearFormat = tempStr;
    return this.yearFormat;
  }

  getDateFormat(): any{
    let tempStr = '';
    for(let i=0;i<this.layer.dateFormat.length; i++){
      if(this.layer.dateFormat[i] == '<' && (this.layer.dateFormat[i+1] == 'd' || this.layer.dateFormat[i+1] == 'm' || this.layer.dateFormat[i+1] == 'y')){
        tempStr += this.layer.dateFormat[i+1];
      }
    }
    this.dateFormat = tempStr;
    return tempStr;
  }

  getFirstSeparator():any{
    let temp = '';
    for(let i=0;i<this.layer.dateFormat.length; i++){
      if(this.layer.dateFormat[i] == '>'){
        while(this.layer.dateFormat[i+1] != '<'){
          temp += this.layer.dateFormat[i+1];
          i++;
        }
        break;
      }
    }
    this.firstSeparator = temp;
    return temp;
  }

  getSecondSeparator():any{
    let temp = '';
    let count = 0;
    for(let i=0;i<this.layer.dateFormat.length; i++){
      if(this.layer.dateFormat[i] == '>'){
        if(count == 0){
          count++;
        }
        else{
          while(this.layer.dateFormat[i+1] != '<'){
            temp += this.layer.dateFormat[i+1];
            i++;
          }
          break;
        }
      }
    }
    this.secondSeparator = temp;
    console.log(temp);
    return temp;
  }

  changeDateFormat():any{
    let currentDateFormat = '';
    if(this.dateFormat[0] == 'd'){
      currentDateFormat += this.dayFormat;
    }
    else if(this.dateFormat[0] == 'm'){
      currentDateFormat += this.monthFormat;
    }
    else{
      currentDateFormat += this.yearFormat;
    }
    currentDateFormat += this.firstSeparator;
    if(this.dateFormat[1] == 'd'){
      currentDateFormat += this.dayFormat;
    }
    else if(this.dateFormat[1] == 'm'){
      currentDateFormat += this.monthFormat;
    }
    else{
      currentDateFormat += this.yearFormat;
    }
    currentDateFormat += this.secondSeparator;
    if(this.dateFormat[2] == 'd'){
      currentDateFormat += this.dayFormat;
    }
    else if(this.dateFormat[2] == 'm'){
      currentDateFormat += this.monthFormat;
    }
    else{
      currentDateFormat += this.yearFormat;
    }
    console.log(currentDateFormat);
    this.layer.dateFormat = currentDateFormat;
    this.layer.dateFormatting();
  }

  onDateSelected(event){
    this.layer.date = new Date(event);
    this.layer.dateFormatting();
  }

  getCurrentDate():any{
    return this.layer.date.toISOString().substr(0,10);
  }

}
