import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {User} from '@classes/user';
import {DataStorage} from '@classes/data-storage';
import {Constants} from '@classes/constants';

@Injectable()
export class FrontpageAuthGuard implements CanActivate {
    user: User;

    constructor(private router: Router) {
        this.user = DataStorage.getInstance().getUser();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        // -- Checking if the Frontpage route's can activate starts --- //
        if (this.user.checkAuthentication()) { // if the user is authenticated and trying to open login or sign-up page
            this.router.navigate([Constants.dashBoardRoute]);
            return false;
        }
        return true;
        // -- Checking if the Frontpage route's can activate Ends --- //
    }
}