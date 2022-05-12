import { DataStorage } from '../classes/data-storage';

/* Starts: Checking if the token is revoked ( access denied), if true then logging out user  */
export function checkTokenRevokedStatus(response) {
    var user = DataStorage.getInstance().getUser();
    if (response['token_revoked'] && user.checkAuthentication()) {
        localStorage.removeItem('schoolJWT');
        user.jwt = '';
        user.isAuthenticated = false;
        user.emptyUserDetails();
        alert(response['message']);     //  Here the user is receiving permission denied message
        document.location.href = '/login';  // redirecting
        return true;
    }
    return false;
}
/* Ends: Checking if the token is revoked ( access denied)  */