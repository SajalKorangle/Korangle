import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})

export class FrontpageComponent implements OnInit {
	@Input() user: User;
  constructor() { }

  ngOnInit() {
  }

}
