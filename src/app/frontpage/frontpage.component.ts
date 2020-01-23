import { Component, OnInit, Input } from '@angular/core';
import { User } from '../classes/user';

declare const $:any;

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css']
})

export class FrontpageComponent implements OnInit {
	@Input() user: User;
  constructor() {
  }

  ngOnInit() {
    window.addEventListener('scroll',this.handleScroll);
    this.handleScroll();

  }

  isLoginButtonPressed:Boolean;
  
  handleEvent(value){
  	if(value == 'true'){
  		this.isLoginButtonPressed = true;
  		return;
  	}
  	this.isLoginButtonPressed = false;
  }

  handleScroll(){
    let element = document.getElementById('section-1');
    if(element == null || element == undefined) return;
    let section1Height = element.offsetHeight;
    if(window.scrollY > section1Height){
      document.getElementById('top-button').style.display='block';
    }
    else{
      document.getElementById('top-button').style.display='none';
    }
  }

  handleGotoDiv(event, hash){
    event.preventDefault();
    hash = '#'+hash;
    let scrollHeight = $(hash).offset().top;
    if(scrollHeight > 15) scrollHeight = scrollHeight - 15;
    $('html, body').animate({
       scrollTop: scrollHeight
     }, 800);
  }

}
