package com.korangle.www.korangle;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.support.v4.app.NotificationCompat;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

public class MyInstanceIDListenerService extends FirebaseMessagingService {

    @Override
    public void onNewToken(String s) {
        super.onNewToken(s);
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Map<String, String> data = remoteMessage.getData();
        String updateMessage = data.get("data");

        if (updateMessage != null && updateMessage.equals("UPDATE")) {
            MainActivity.volleyFace.checkingUpdates(); // checking updates
            // Code Review
            // So, will the app be removed from the background,
            // even if it was in the background previously? --> Yes, Even if the app is open 
            // Why is this necessary? --> Because, if we dont remove the app, when resuming the app it is going to the login page, when the user is already logged in
            // I have fixed it now, it wont go to the login page even if it is background ( It was my mistake, after checking updates it was redirecting to korngle login page not localhost, i thought it was logging out'
            return;
        }

        String title = remoteMessage.getNotification().getTitle();
        String message = remoteMessage.getNotification().getBody();


        Intent intent = new Intent(this, MainActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent =  PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_ONE_SHOT);
        NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this);
        notificationBuilder.setContentTitle(title);
        notificationBuilder.setContentText(message);
        notificationBuilder.setSmallIcon(R.mipmap.korangle);
        notificationBuilder.setAutoCancel(true);
        notificationBuilder.setContentIntent(pendingIntent);
        NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        notificationManager.notify(0, notificationBuilder.build());
    }

}
