
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export class User {

    username: string;
    email: string;
    isAuthenticated = false;
    jwt = '';
    color = 'red';

    appSection = 'students';

    ROUTES: RouteInfo[] = [
        { path: 'students', title: 'Students',  icon: 'account_circle', class: '' },
        { path: 'fees', title: 'Fees',  icon: 'dashboard', class: '' },
        { path: 'expenses', title: 'Expenses', icon: 'dashboard', class: '' },
        { path: 'concession', title: 'Concession', icon: 'dashboard', class: '' },
        { path: 'new_student', title: 'New Student', icon: 'person', class: '' },
        /*{ path: 'user-profile', title: 'User Profile',  icon:'person', class: '' },
        { path: 'table-list', title: 'Table List',  icon:'content_paste', class: '' },
        { path: 'typography', title: 'Typography',  icon:'library_books', class: '' },
        { path: 'icons', title: 'Icons',  icon:'bubble_chart', class: '' },
        { path: 'maps', title: 'Maps',  icon:'location_on', class: '' },
        { path: 'notifications', title: 'Notifications',  icon:'notifications', class: '' },
        { path: 'upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
        { path: 'fees-receipts', title: 'Fees Receipts',  icon:'content_paste', class: '' },
        { path: 'student-list', title: 'Student List',  icon:'content_paste', class: '' }, */
    ];

    authenticateUser(): boolean {
        this.jwt = localStorage.getItem('schoolJWT');
        if (this.jwt === null || this.jwt.length === 0) {
            this.isAuthenticated = false;
            return false;
        } else {
            this.isAuthenticated = true;
            return true;
        }
    }
}