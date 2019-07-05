
export function sendDataToAndroid(data) {
    if (navigator.userAgent == "Mobile") {
        Android.sendData(data);
    }
}
