import {Injectable} from '@angular/core';
import {User} from '../_models/user';
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_sevices/user.service';
import { AlertifyService } from '../_sevices/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_sevices/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router, private authService: AuthService,
        private alertify: AlertifyService) {}


         resolve(route: ActivatedRouteSnapshot): Observable<User> {
             return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
                 catchError (error => {
                     this.alertify.error('problem retreiving your data');
                     this.router.navigate(['/members']);
                     return of(null);
             })

             );
         }
}
