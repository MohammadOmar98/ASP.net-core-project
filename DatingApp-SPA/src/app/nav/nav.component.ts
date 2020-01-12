import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_sevices/auth.service';
import { error } from 'protractor';
import { AlertifyService } from '../_sevices/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(public authservice: AuthService , private alertify: AlertifyService,
    private router: Router ) { }

  ngOnInit() {
  }

  login() {
    this.authservice.login(this.model).subscribe(next => {
      this.alertify.success('logged in successfully');


    // tslint:disable-next-line: no-shadowed-variable
    }, error => {
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/members']);
    });


  }


  loggedIn() {
   return this.authservice.loggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }



}
