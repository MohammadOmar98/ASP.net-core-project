import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_sevices/user.service';
import { AlertifyService } from 'src/app/_sevices/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { error } from 'protractor';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {
user: User;
galleryOptions: NgxGalleryOptions[];
galleryImages: NgxGalleryImage[];


  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
   this.route.data.subscribe(data => {
     this.user = data['user'];
   });


   this.galleryOptions = [
     {
       width: '500px',
       height: '500px',
       imagePercent: 100,
       thumbnailsColumns: 4,
       imageAnimation: NgxGalleryAnimation.Slide,
       preview: false
     }
   ];
   this.galleryImages = this.getImages();
  }

 getImages() {
   const imgUrl = [];
   for (let i = 0; i < this.user.photos.length; i++) {
     imgUrl.push({
       small: this.user.photos[i].url,
       medium: this.user.photos[i].url,
       big: this.user.photos[i].url,
       description: this.user.photos[i].description
     });
   }
   return imgUrl;
 }

  // loadUser() {
  //  this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) => {
  //    this.user = user;
  //  // tslint:disable-next-line: no-shadowed-variable
  //  }, error => {
  //    this.alertify.error(error);
  //  });
  // }

}
