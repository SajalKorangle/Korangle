package com.korangle.www.korangle;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class WebAppInterface {
    Context mContext;
    String data;

    WebAppInterface(Context ctx){
        this.mContext=ctx;
    }

    @JavascriptInterface
    public void scanBarcode() {
        Intent intent = new Intent("com.google.zxing.client.android.SCAN");
        intent.setPackage("com.google.zxing.client.android");
        ((MainActivity)mContext).startActivityForResult(intent, MainActivity.SCANNER_REQUEST_CODE);
    }

    @JavascriptInterface
    public void closeBarCodeScanner() {
        ((MainActivity)mContext).finish();
    }

    @JavascriptInterface
    public void sendData(String data) {
        //Get the string value to process
        this.data=data;
    }

    @JavascriptInterface
    public void registerForNotification(String userId, String jwtToken, String url) {
        // Toast.makeText(mContext, "Token Saved", Toast.LENGTH_LONG).show();

        SharedPreferences sharedPreferences = mContext.getApplicationContext().getSharedPreferences(mContext.getString(R.string.FCM_PREF), Context.MODE_PRIVATE);
        int django_fcm_id = sharedPreferences.getInt(mContext.getString(R.string.DJANGO_FCM_ID), 0);
        String fcm_token = sharedPreferences.getString(mContext.getString(R.string.FCM_TOKEN), null);

        if (django_fcm_id == 0 && fcm_token != null) {

            // Toast.makeText(mContext, "Registering for notification", Toast.LENGTH_LONG).show();

            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("registration_id", fcm_token);
                jsonObject.put("cloud_message_type", "FCM");
                jsonObject.put("user", userId);
            } catch (Exception e) {
            }

            JsonObjectRequest registerForNotificationRequest = new JsonObjectRequest
                    (Request.Method.POST, url, jsonObject, new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject mainResponse) {
                            try {
                                // Toast.makeText(mContext, response.toString(), Toast.LENGTH_LONG).show();
                                JSONObject response = mainResponse.getJSONObject("response");
                                if (response != null && response.getString("status").equals("success")) {
                                    // Toast.makeText(mContext, "Registered for notification", Toast.LENGTH_LONG).show();

                                    JSONObject fcm_data = response.getJSONObject("data");
                                    SharedPreferences.Editor editor = sharedPreferences.edit();
                                    editor.putInt(mContext.getString(R.string.DJANGO_FCM_ID), fcm_data.getInt("id"));
                                    editor.commit();
                                } else {
                                    // Toast.makeText(mContext, "Registered For Notification", Toast.LENGTH_LONG).show();
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            // TODO: Handle error

                        }
                    }) {

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    HashMap<String, String> headers = new HashMap<String, String>();
                    headers.put("Content-Type", "application/json");
                    headers.put("Authorization", "JWT "+jwtToken);
                    return headers;
                }

            };

            ((MainActivity)mContext).volleyFace.queue.add(registerForNotificationRequest);
        }
    }

    @JavascriptInterface
    public void unregisterForNotification(String jwtToken, String url) {

        SharedPreferences sharedPreferences = mContext.getApplicationContext().getSharedPreferences(mContext.getString(R.string.FCM_PREF), Context.MODE_PRIVATE);
        int django_fcm_id = sharedPreferences.getInt(mContext.getString(R.string.DJANGO_FCM_ID), 0);
        String fcm_token = sharedPreferences.getString(mContext.getString(R.string.FCM_TOKEN), null);

        if (django_fcm_id != 0 && fcm_token != null) {

            // Toast.makeText(mContext, "Unregistering for notification", Toast.LENGTH_LONG).show();

            JSONObject jsonObject = new JSONObject();
            try {
                jsonObject.put("id", django_fcm_id);
            } catch (Exception e) {
            }

            url += "?id=" + Integer.toString(django_fcm_id);

            JsonObjectRequest unregisterForNotificationRequest = new JsonObjectRequest
                    (Request.Method.DELETE, url, jsonObject, new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject mainResponse) {
                            try {
                                JSONObject response = mainResponse.getJSONObject("response");
                                if (response != null && response.getString("status").equals("success")) {
                                    // Toast.makeText(mContext, "Unregistered for notification", Toast.LENGTH_LONG).show();

                                    SharedPreferences.Editor editor = sharedPreferences.edit();
                                    editor.putInt(mContext.getString(R.string.DJANGO_FCM_ID), 0);
                                    editor.commit();
                                } else {
                                    // Toast.makeText(mContext, "Registered For Notification", Toast.LENGTH_LONG).show();
                                }
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        }
                    }, new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            // TODO: Handle error

                        }
                    }) {

                @Override
                public Map<String, String> getHeaders() throws AuthFailureError {
                    HashMap<String, String> headers = new HashMap<String, String>();
                    headers.put("Content-Type", "application/json");
                    headers.put("Authorization", "JWT "+jwtToken);
                    return headers;
                }

            };

            ((MainActivity)mContext).volleyFace.queue.add(unregisterForNotificationRequest);
        }

    }
}