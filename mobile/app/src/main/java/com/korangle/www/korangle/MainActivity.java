package com.korangle.www.korangle;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.IntentSender;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.design.widget.Snackbar;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.FileProvider;
import android.support.v4.widget.SwipeRefreshLayout;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.common.internal.service.Common;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.install.InstallState;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;
import com.google.android.play.core.tasks.Task;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.InstanceIdResult;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MainActivity extends AppCompatActivity {

    RelativeLayout loadingView;
    RelativeLayout connectionLostView;
    TextView progressMessageView;
    ProgressBar progressBarView;
    TextView messageView;
    Button exitButton;
    TextView quoteView;
    WebView webview;
    Snackbar snackbar;
    SwipeRefreshLayout mySwipeRefreshLayout;

    String websiteNotFound = "Not able to connect with Korangle!\nContact +91 - 7999951154";
    String notInternetConnection = "No Internet Connection!\n Swipe down to refresh";
    String slowOrNoInternetConnection = "Slow or No Internet Connection!!\n Swipe down to retry";
    public static final String TEL_PREFIX = "tel:";

    // Request Code
    public static final int INPUT_FILE_REQUEST_CODE = 1;
    public static final int IMMEDIATE_UPDATE_REQUEST_CODE = 3;
    public static final int FLEXIBLE_UPDATE_REQUEST_CODE = 4;
    public static final int SCANNER_REQUEST_CODE = 5;
    public static final int CAMERA_PERMISSION_REQUEST_CODE = 6;

    // Result Code
    public static final int FILECHOOSER_RESULTCODE = 1;

    public ValueCallback<Uri> mUploadMessage;
    public Uri mCapturedImageURI = null;
    public ValueCallback<Uri[]> mFilePathCallback;
    public String mCameraPhotoPath;

    AppUpdateManager mAppUpdateManager;
    InstallStateUpdatedListener listener;

    String mCurrentPhotoPath;

    static final int REQUEST_IMAGE_CAPTURE = 1;

    Bitmap mImageBitmap;

    public VolleyFace volleyFace;


    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Check App updates
        // Creates instance of the manager.
        mAppUpdateManager = AppUpdateManagerFactory.create(this);

        // Returns an intent object that you use to check for an update.
        Task<AppUpdateInfo> appUpdateInfoTask = mAppUpdateManager.getAppUpdateInfo();

        // Checks that the platform will allow the specified type of update.
        appUpdateInfoTask.addOnSuccessListener(appUpdateInfo -> {
            if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                Toast.makeText(getApplicationContext(), "Updating", Toast.LENGTH_LONG).show();
                mAppUpdateManager.completeUpdate();
            }
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE) {
                if (appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                    Toast.makeText(getApplicationContext(), "Update with latest code", Toast.LENGTH_LONG).show();
                    try {
                        mAppUpdateManager.startUpdateFlowForResult(
                                appUpdateInfo,
                                AppUpdateType.IMMEDIATE,
                                this,
                                IMMEDIATE_UPDATE_REQUEST_CODE);
                    } catch (IntentSender.SendIntentException e) {
                        e.printStackTrace();
                    }
                }
            }
        });

        this.checkPermissionInitially();

        volleyFace = new VolleyFace(this);

        loadingView = (RelativeLayout) this.findViewById(R.id.loadingView);
        connectionLostView = (RelativeLayout) this.findViewById(R.id.connectionLostView);

        progressMessageView = (TextView) this.findViewById(R.id.progressMessageView);
        progressBarView = (ProgressBar) this.findViewById(R.id.determinateBar);
        messageView = (TextView) this.findViewById(R.id.messageView);
        exitButton = (Button) this.findViewById(R.id.exitButton);
        quoteView = (TextView) this.findViewById(R.id.quote);
        webview =(WebView)findViewById(R.id.webView);

        quoteView.setText(Quote.getQuote());

        CookieManager.getInstance().setAcceptCookie(true);

        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setPluginState(WebSettings.PluginState.OFF);
        webview.getSettings().setLoadWithOverviewMode(true);
        webview.getSettings().setCacheMode(WebSettings.LOAD_NO_CACHE);
        webview.getSettings().setUseWideViewPort(true);
        // webview.getSettings().setUserAgentString("Android Mozilla/5.0 AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30");
        webview.getSettings().setAllowFileAccess(true);
        webview.getSettings().setAllowFileAccess(true);
        webview.getSettings().setAllowContentAccess(true);
        webview.getSettings().supportZoom();


        webview.setWebChromeClient(new ChromeClient(this));
        webview.setWebViewClient(new CustomWebViewClient(this));
        webview.getSettings().setJavaScriptEnabled(true);
        webview.getSettings().setJavaScriptCanOpenWindowsAutomatically(true);
        webview.getSettings().setSupportMultipleWindows(true);
        webview.addJavascriptInterface(new WebAppInterface(this), "Android");
        webview.getSettings().setAppCacheEnabled(true);
        webview.getSettings().setDomStorageEnabled(true);
        webview.getSettings().setUserAgentString("Mobile");
        webview.setOverScrollMode(WebView.OVER_SCROLL_NEVER);

        FirebaseInstanceId.getInstance().getInstanceId().addOnSuccessListener(this,new OnSuccessListener<InstanceIdResult>() {
            @Override
            public void onSuccess(InstanceIdResult instanceIdResult) {
                String newToken = instanceIdResult.getToken();

                SharedPreferences sharedPreferences = getApplicationContext().getSharedPreferences(getString(R.string.FCM_PREF), Context.MODE_PRIVATE);
                String fcm_token = sharedPreferences.getString(getString(R.string.FCM_TOKEN), null);

                if (fcm_token == null || !newToken.equals(fcm_token)) {
                    // Toast.makeText(getApplicationContext(), "Registering Token", Toast.LENGTH_LONG).show();
                    SharedPreferences.Editor editor = sharedPreferences.edit();
                    editor.putString(getString(R.string.FCM_TOKEN), newToken);
                    editor.commit();
                }

            }
        });

        mySwipeRefreshLayout = (SwipeRefreshLayout) this.findViewById(R.id.swipeContainer);
        mySwipeRefreshLayout.setOnRefreshListener(
                new SwipeRefreshLayout.OnRefreshListener() {
                    @Override
                    public void onRefresh() {
                        mySwipeRefreshLayout.setRefreshing(false);
                        if (isNetworkConnected()) {
                            handleSuccessfulInternetConnection();
                        } else {
                            handleNoInternetConnection(notInternetConnection);
                        }
                    }
                }
        );


        if(!isNetworkConnected()) {
            handleNoInternetConnection(notInternetConnection);
        } else {
            handleSuccessfulInternetConnection();
        }

    }

    // Checks that the update is not stalled during 'onResume()'.
    // However, you should execute this check at all app entry points.
    @Override
    protected void onResume() {
        super.onResume();

        mAppUpdateManager
                .getAppUpdateInfo()
                .addOnSuccessListener(appUpdateInfo -> {
                    // If the update is downloaded but not installed,
                    // notify the user to complete the update.
                    if (appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                        Toast.makeText(getApplicationContext(), "Updating 2", Toast.LENGTH_LONG).show();
                        mAppUpdateManager.completeUpdate();
                    }
                    if (appUpdateInfo.updateAvailability()
                            == UpdateAvailability.DEVELOPER_TRIGGERED_UPDATE_IN_PROGRESS) {
                        // If an in-app update is already running, resume the update.
                        if (appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE)) {
                            Toast.makeText(getApplicationContext(), "Update with latest code 2", Toast.LENGTH_LONG).show();
                            try {
                                mAppUpdateManager.startUpdateFlowForResult(appUpdateInfo,
                                        AppUpdateType.IMMEDIATE,
                                        this,
                                        IMMEDIATE_UPDATE_REQUEST_CODE);
                            } catch (IntentSender.SendIntentException e) {
                                e.printStackTrace();
                            }
                        }
                    }
                });
    }

    public boolean isNetworkConnected() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        boolean result = cm.getActiveNetworkInfo() != null;
        return result;
    }

    public void handleNoInternetConnection(String message) {
        loadingView.setVisibility(FrameLayout.GONE);
        connectionLostView.setVisibility(RelativeLayout.VISIBLE);
        // progressBarView.setVisibility(ProgressBar.GONE);
        webview.setVisibility(WebView.GONE);
        // exitButton.setVisibility(Button.VISIBLE);
        // messageView.setVisibility(TextView.VISIBLE);
        messageView.setText(message);
        mySwipeRefreshLayout.setEnabled(true);
    }

    public void handleSuccessfulInternetConnection() {
        // messageView.setVisibility(TextView.GONE);
        // exitButton.setVisibility(Button.GONE);
        connectionLostView.setVisibility(RelativeLayout.GONE);
        webview.setVisibility(WebView.GONE);
        loadingView.setVisibility(FrameLayout.VISIBLE);
        // progressBarView.setVisibility(ProgressBar.VISIBLE);
        mySwipeRefreshLayout.setEnabled(false);
        progressMessageView.setText("Checking Updates");
        if (BuildConfig.DEBUG) {
            webview.loadUrl("http://192.168.29.79:4200");   // YOUR SYSTEM IP GOES HERE (frontend server's)
        } else {
            volleyFace.checkingUpdates();
        }
    }

    public void exitActivity(View view) {
        this.finish();
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (event.getAction() == KeyEvent.ACTION_DOWN) {
            switch (keyCode) {
                case KeyEvent.KEYCODE_BACK:
                    return true;
            }

        }
        return super.onKeyDown(keyCode, event);
    }

    public void checkPermissionInitially() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (this.checkSelfPermission(Manifest.permission.CAMERA)
                    == PackageManager.PERMISSION_DENIED) {
                ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, CAMERA_PERMISSION_REQUEST_CODE);
            }
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        if (requestCode == CAMERA_PERMISSION_REQUEST_CODE) {
            return;
        }

        if (requestCode == SCANNER_REQUEST_CODE) {
            String barcode = data.getStringExtra("SCAN_RESULT");
        }

        if (requestCode == IMMEDIATE_UPDATE_REQUEST_CODE || requestCode == FLEXIBLE_UPDATE_REQUEST_CODE) {
            if (resultCode != RESULT_OK) {
                Toast.makeText(getApplicationContext(),
                        "Update Failed",
                        Toast.LENGTH_LONG).show();
                // super.onActivityResult(requestCode, resultCode, data);
                // return;
            } else {
                Toast.makeText(getApplicationContext(),
                        "Update Successful",
                        Toast.LENGTH_LONG).show();
            }
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {

            if (requestCode != INPUT_FILE_REQUEST_CODE || mFilePathCallback == null) {
                super.onActivityResult(requestCode, resultCode, data);
                return;
            }

            Uri[] results = null;

            // Check that the response is a good one
            if (resultCode == Activity.RESULT_OK) {
                if (data == null || data.getDataString() == null) {
                    // If there is not data, then we may have taken a photo
                    if (mCameraPhotoPath != null) {
                        results = new Uri[]{Uri.parse(mCameraPhotoPath)};
                    }
                } else {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
            }

            mFilePathCallback.onReceiveValue(results);
            mFilePathCallback = null;

        } else if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.KITKAT) {
            if (requestCode != FILECHOOSER_RESULTCODE || mUploadMessage == null) {
                super.onActivityResult(requestCode, resultCode, data);
                return;
            }

            if (requestCode == FILECHOOSER_RESULTCODE) {

                if (null == this.mUploadMessage) {
                    return;

                }

                Uri result = null;

                try {
                    if (resultCode != RESULT_OK) {

                        result = null;

                    } else {

                        // retrieve from the private variable if the intent is null
                        result = data == null ? mCapturedImageURI : data.getData();
                    }
                } catch (Exception e) {
                    Toast.makeText(getApplicationContext(), "activity :" + e,
                            Toast.LENGTH_LONG).show();
                }

                mUploadMessage.onReceiveValue(result);
                mUploadMessage = null;

            }
        }

        return;
    }

}