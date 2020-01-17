import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_sevices/auth.service';
import { AlertifyService } from '../_sevices/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/user';
import { error } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  user: User;
  registerForm: FormGroup;

  constructor(private authService: AuthService, private alertify: AlertifyService, private router: Router , private fb: FormBuilder) { }

  ngOnInit() {
    this.createRegiterForm();
  }

  createRegiterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['',
      [Validators.required, Validators.maxLength(8), Validators.minLength(4)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordMatchValidator});
  }

  passwordMatchValidator(g: FormGroup) {
   return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true};
  }

  register() {
   if (this.registerForm.valid) {
     this.user = Object.assign({}, this.registerForm.value);
     this.authService.register(this.user).subscribe(() => {
       this.alertify.success('Registeration successfully');
     // tslint:disable-next-line: no-shadowed-variable
     }, error => {
       this.alertify.error(error);
     }, () => {
       this.authService.login(this.user).subscribe(() => {
        this.router.navigate(['/members']);
       });
     });


   }
  }
  cancel() {
    this.cancelRegister.emit(false);

  }

}
