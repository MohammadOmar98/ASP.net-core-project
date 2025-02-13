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
  photoUrl: string;

  constructor(public authService: AuthService , private alertify: AlertifyService,
    private router: Router ) { }

  ngOnInit() {
    this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl );
  }

  login() {
    this.authService.login(this.model).subscribe(next => {
      this.alertify.success('logged in successfully');


    // tslint:disable-next-line: no-shadowed-variable
    }, error => {
      this.alertify.error(error);
    }, () => {
      this.router.navigate(['/members']);
    });


  }


  loggedIn() {
   return this.authService.loggedIn();
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }



}
