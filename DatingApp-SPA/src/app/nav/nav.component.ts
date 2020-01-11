import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_sevices/auth.service';
import { error } from 'protractor';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {};

  constructor(private authservice: AuthService) { }

  ngOnInit() {
  }

  login() {

   this.authservice.login(this.model).subscribe(next =>
    {
      console.log('logged in successfully');
    }
    , error => {
      console.log('failed to login');
    }
    );
  }

  loggedIn()
  {

     const token =  localStorage.getItem('token');
     return !!token;

  }

  logOut()
  {
    localStorage.removeItem('token');
    console.log('logged out');
  }



}
