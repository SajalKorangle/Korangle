import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-parameters-pannel',
  templateUrl: './text-parameters-pannel.component.html',
  styleUrls: ['./text-parameters-pannel.component.css']
})
export class TextParametersPannelComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  logMessage(toast, msg): void{
    console.log(toast,msg);
  }

}
