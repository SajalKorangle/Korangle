
export function sendDataToAndroid(data) {
    if (navigator.userAgent == "Mobile") {
        alert("mobile");
        Android.sendData(data);
    }
}
