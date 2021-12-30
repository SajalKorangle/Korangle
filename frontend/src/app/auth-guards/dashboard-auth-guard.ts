import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {User} from '@classes/user';
import {DataStorage} from '@classes/data-storage';

@Injectable()
export class DashboardAuthGuard implements CanActivate {
    user: User;

    constructor(private router: Router) {
        this.user = DataStorage.getInstance().getUser();
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        if (!this.user.checkAuthentication()) { // if the user is not authenticated and trying to open dashboard
            this.router.navigate(['login']);
            return false;
        }
        return true;
    }
}