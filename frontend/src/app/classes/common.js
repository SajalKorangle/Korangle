export function sendDataToAndroid( data ) {
    if ( navigator.userAgent == 'Mobile' ) {
        Android.sendData( data );
    }
}

export function openZoomMeeting( url ) {
    if ( navigator.userAgent == 'Mobile' ) {
        Android.openZoomMeeting( url );
    }
}

export function showPhoto( data ) {
    if ( navigator.userAgent == 'Mobile' ) {
        Android.showPhoto( data );
    }
}

export function registerForNotification( data ) {
    if ( navigator.userAgent == 'Mobile' ) {
        Android.registerForNotification( data[ 'user' ], data[ 'jwt' ], data[ 'url' ] );
    }
}

export function unregisterForNotification( data ) {
    if ( navigator.userAgent == 'Mobile' ) {
        Android.unregisterForNotification( data[ 'jwt' ], data[ 'url' ] );
    }
}

export function isMobile() {
    if ( navigator.userAgent == 'Mobile' ) {
        return true;
    }
    return false;
}
