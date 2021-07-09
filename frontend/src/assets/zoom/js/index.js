ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();


var searchParams = new URLSearchParams(atob(location.search.substring(1))); //atob function decodes. used substring to remove an extra character in the starting



var errorLoggingEndoint = searchParams.get('error_logging_endpoint');


const meetConfig = {
    apiKey: searchParams.get('api_key'),
    meetingNumber: searchParams.get('meeting_number'),
    passWord: searchParams.get('password'),
    role: parseInt(searchParams.get('role')),
    userName: searchParams.get('username'),
    signature: searchParams.get('signature')
};

// console.log('meetConf: ', meetConfig);

ZoomMtg.init({
    leaveUrl: searchParams.get('leaveUrl'),
    isSupportAV: true,
    success: function () {
        ZoomMtg.join({
            signature: meetConfig.signature,
            apiKey: meetConfig.apiKey,
            meetingNumber: meetConfig.meetingNumber,
            userName: meetConfig.userName,
            passWord: meetConfig.passWord,
            success: () => { console.log('join success');
            document.getElementsByClassName("meeting-info-icon__icon-wrap")[0].style.visibility = 'hidden';},
            error: (err) => { console.log('error occured: ', err); },
        });
    }
});