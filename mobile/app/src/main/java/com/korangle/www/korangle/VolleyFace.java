package com.korangle.www.korangle;

import android.content.Context;
import android.util.Log;
import android.widget.Toast;

import com.android.volley.DefaultRetryPolicy;
import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.TimeoutError;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilterOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class VolleyFace {

    MainActivity mainActivity;
    RequestQueue queue;
    ZipManager zipManager;

    VolleyFace(MainActivity mainActivity) {
        this.mainActivity = mainActivity;
        // Instantiate the RequestQueue.
        queue = Volley.newRequestQueue(mainActivity);
        zipManager = new ZipManager();
    }

    public void checkingUpdates() {
        String url = mainActivity.webapp_url + "/version.json";

        // Request a string response from the provided URL.
        StringRequest versionRequest = new StringRequest(Request.Method.GET, url,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        // Display the first 500 characters of the response string.
                        Log.i("Volley","Response is: "+ response);
                        try {

                            String path=mainActivity.getFilesDir().getAbsolutePath()+"/korangle/version.json";
                            File file = new File ( path );
                            if (!file.exists()) {
                                mainActivity.progressMessageView.setText("Setting up app after updates...");
                                downloadingUpdates(queue);
                                return;
                            } else {
                                mainActivity.progressMessageView.setText("Comparing to current version");
                            }

                            File inFile = new File(mainActivity.getFilesDir().getAbsolutePath()+"/korangle/", "version.json");
                            InputStream inputStream = new FileInputStream(mainActivity.getFilesDir().getAbsolutePath()+"/korangle/version.json");
                            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
                            StringBuilder out = new StringBuilder();
                            String line;
                            while ((line = reader.readLine()) != null) {
                                out.append(line);
                            }
                            reader.close();

                            JSONObject currentVersion, latestVersion;

                            try {
                                currentVersion = new JSONObject(out.toString());
                                latestVersion = new JSONObject(response);
                                if (!currentVersion.has("mobileLastUpdation")
                                        || Integer.parseInt(currentVersion.getString("mobileLastUpdation"))
                                        < Integer.parseInt(latestVersion.getString("mobileLastUpdation")) ) {
                                    // Download the latest Updates
                                    mainActivity.progressMessageView.setText("Downloading Updates");
                                    downloadingUpdates(queue);
                                } else {
                                    // Go on as usual
                                    mainActivity.progressMessageView.setText("Signing in ...");
                                    mainActivity.webview.loadUrl(mainActivity.webapp_url + "/index.html");
                                }

                            }catch (JSONException err){
                                Log.d("Error", err.toString());
                                mainActivity.progressMessageView.setText("Error in comparing, contact admin");
                                mainActivity.handleNoInternetConnection("An error has occured 1");
                            }

                        } catch (IOException e) {
                            Log.e("Volley", e.toString());
                            Log.i("Volley", "Unable to process local version.json");
                            mainActivity.progressMessageView.setText("Error2 in comparing, contact admin");
                            mainActivity.handleNoInternetConnection("An error has occured 2");
                        }
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error instanceof TimeoutError) {
                            Toast.makeText(mainActivity, error.toString(), Toast.LENGTH_LONG).show();
                        } else {
                            Toast.makeText(mainActivity, error.toString(), Toast.LENGTH_LONG).show();
                        }
                        mainActivity.handleNoInternetConnection(mainActivity.slowOrNoInternetConnection);
                    }
                });

        // Add the request to the RequestQueue.
        versionRequest.setRetryPolicy(new DefaultRetryPolicy(
                50000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        versionRequest.setShouldCache(true);
        queue.add(versionRequest);
    }

    public void downloadingUpdates(RequestQueue queue) {

        String mUrl= mainActivity.webapp_url + "/korangle.zip";
        InputStreamVolleyRequest zipRequest = new InputStreamVolleyRequest(Request.Method.GET, mUrl,
                new Response.Listener<byte[]>() {
                    @Override
                    public void onResponse(byte[] response) {
                        // TODO handle the response
                        try {
                            if (response!=null) {

                                // printRecursive(mainActivity.getFilesDir(), 0);

                                deleteRecursive(new File(mainActivity.getFilesDir().getAbsolutePath()+"/korangle.zip"));
                                deleteRecursive(new File(mainActivity.getFilesDir().getAbsolutePath()+"/korangle/"));

                                // printRecursive(mainActivity.getFilesDir(), 0);

                                FileOutputStream outputStream;
                                outputStream = new FileOutputStream(mainActivity.getFilesDir().getCanonicalPath()+"/korangle.zip");
                                outputStream.write(response);
                                outputStream.close();

                                mainActivity.progressMessageView.setText("Installing Updates");
                                zipManager.unzip(mainActivity.getFilesDir().getCanonicalPath()+"/korangle.zip",mainActivity.getFilesDir().getCanonicalPath()+"/" );

                                mainActivity.progressMessageView.setText("Opening app");
                                mainActivity.webview.loadUrl(mainActivity.webapp_url + "/index.html");

                            }
                        } catch (Exception e) {
                            // TODO Auto-generated catch block
                            Log.d("KEY_ERROR", "UNABLE TO DOWNLOAD FILE");
                            e.printStackTrace();
                            Toast.makeText(mainActivity, e.toString(), Toast.LENGTH_LONG).show();
                            mainActivity.handleNoInternetConnection("Comparing to version failed");
                        }
                    }
                } ,
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if (error instanceof TimeoutError) {
                            Toast.makeText(mainActivity, error.toString(), Toast.LENGTH_LONG).show();
                            mainActivity.handleNoInternetConnection(mainActivity.slowOrNoInternetConnection);
                        } else {
                            Toast.makeText(mainActivity, error.toString(), Toast.LENGTH_LONG).show();
                            mainActivity.handleNoInternetConnection(mainActivity.slowOrNoInternetConnection);
                        }
                    }
                } ,
                null);

        // Add the request to the RequestQueue.
        zipRequest.setRetryPolicy(new DefaultRetryPolicy(
                240000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        // zipRequest.setShouldCache(true);
        zipRequest.setShouldCache(false);
        queue.add(zipRequest);
    }

    public void deleteRecursive(File fileOrDirectory) {

        if (fileOrDirectory.isDirectory()) {
            for (File child : fileOrDirectory.listFiles()) {
                deleteRecursive(child);
            }
        }

        fileOrDirectory.delete();
    }

    public void printRecursive(File fileOrDirectory, int tabNumber) {
        String str = "";
        for (int i = 0; i<tabNumber; ++i) {
            str += "\t";
        }
        Log.i("Print Recursive", str+fileOrDirectory.getAbsolutePath());
        if (fileOrDirectory.isDirectory()) {
            for (File child: fileOrDirectory.listFiles()) {
                printRecursive(child, tabNumber+1);
            }
        }
    }

    static class InputStreamVolleyRequest extends Request<byte[]> {
        private final Response.Listener<byte[]> mListener;
        private Map<String, String> mParams;

        //create a static map for directly accessing headers
        public Map<String, String> responseHeaders ;

        public InputStreamVolleyRequest(int method, String mUrl ,Response.Listener<byte[]> listener,
                                        Response.ErrorListener errorListener, HashMap<String, String> params) {
            // TODO Auto-generated constructor stub

            super(method, mUrl, errorListener);
            // this request would never use cache.
            setShouldCache(false);
            mListener = listener;
            mParams=params;
        }

        @Override
        protected Map<String, String> getParams()
                throws com.android.volley.AuthFailureError {
            return mParams;
        };


        @Override
        protected void deliverResponse(byte[] response) {
            mListener.onResponse(response);
        }

        @Override
        protected Response<byte[]> parseNetworkResponse(NetworkResponse response) {

            //Initialise local responseHeaders map with response headers received
            responseHeaders = response.headers;

            //Pass the response data here
            return Response.success( response.data, HttpHeaderParser.parseCacheHeaders(response));
        }
    }

    /*public void sendToken(String token) {
        // Request a string response from the provided URL.
        StringRequest versionRequest = new StringRequest(Request.Method.GET, mainActivity.webapp_url + "/sms/notification?token="+token,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Toast.makeText(mainActivity, "Response is: "+response, Toast.LENGTH_LONG).show();
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(mainActivity, "Error is: "+error.toString(), Toast.LENGTH_LONG).show();
                    }
                });
        queue.add(versionRequest);
    }*/

}
