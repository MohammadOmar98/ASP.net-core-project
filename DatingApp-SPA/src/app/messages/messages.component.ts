import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResult } from '../_models/pagination';
import { UserService } from '../_sevices/user.service';
import { AuthService } from '../_sevices/auth.service';
import { AlertifyService } from '../_sevices/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
messages: Message[];
pagination: Pagination;
messageContainer: 'Unread';
  constructor(private route: ActivatedRoute, private alertify: AlertifyService,
    private userService: UserService, private authService: AuthService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.userService.getMessages(this.authService.decodedToken.namied, this.pagination.currentPage
      , this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((res: PaginatedResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      // tslint:disable-next-line: no-shadowed-variable
      }, error => {

      });
  }
  deleteMessage(id: number) {
     this.alertify.confirm('Are you sure you want to delete this message', () => {
       this.userService.deleteMessage(id, this.authService.decodedToken.namied).subscribe(() => {
         this.messages.splice(this.messages.findIndex(m => m.id === id), 1);
         this.alertify.success('Message has been deleted');
       // tslint:disable-next-line: no-shadowed-variable
       }, error => {
         this.alertify.error('Failed to delete message');
       });
     } );
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();

  }

}
