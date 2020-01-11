import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_sevices/auth.service';
import { error } from 'protractor';
import { AlertifyService } from '../_sevices/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(public authservice: AuthService , private alertify: AlertifyService) { }

  ngOnInit() {
  }

  login() {
    this.authservice.login(this.model).subscribe(next => {
      this.alertify.success('logged in successfully');


    // tslint:disable-next-line: no-shadowed-variable
    }, error => {
      this.alertify.error(error);
    });


  }


  loggedIn() {
   return this.authservice.loggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    this.alertify.message('logged out');
  }



}
