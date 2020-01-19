import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_sevices/auth.service';
import { UserService } from 'src/app/_sevices/user.service';
import { AlertifyService } from 'src/app/_sevices/alertify.service';
import { error } from 'protractor';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
@Input() user: User;
  constructor(private userService: UserService, private authService: AuthService,
    private alertify: AlertifyService) { }

  ngOnInit() {
  }

  sendLike(id: number) {
   this.userService.sendLike(this.authService.decodedToken.nameid, id).subscribe(data => {
     this.alertify.success('you have liked ' + this.user.username );
   // tslint:disable-next-line: no-shadowed-variable
   }, error => {
     this.alertify.error('you already like ' + this.user.username);
   });
  }

}
