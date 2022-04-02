package com.korangle.www.korangle;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.util.Log;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

public class CustomWebViewClient extends WebViewClient {

    MainActivity mainActivity;

    CustomWebViewClient(MainActivity mainActivity) {
        this.mainActivity = mainActivity;
    }

    private static final String TAG = "Korangle";

    public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
        mainActivity.handleNoInternetConnection(mainActivity.websiteNotFound);
    }

    @Override
    public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        int substringCut = 24;
        if (BuildConfig.DEBUG) {
            substringCut = 25;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            String resourceUrl = request.getUrl().toString();
            if (resourceUrl.startsWith(mainActivity.webapp_url)) {
                String filePath = null;
                try {
                    filePath = mainActivity.getFilesDir().getCanonicalPath() + "/korangle/" + resourceUrl.substring(substringCut);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                String fileExtension = WebviewResourceMappingHelper.getInstance().getFileExt(filePath);
                String mimeType = WebviewResourceMappingHelper.getInstance().getMimeType(fileExtension);
                try {
                    Log.i("Korangle", filePath);
                    File inFile = new File(filePath);
                    InputStream inputStream = new FileInputStream(filePath);
                    int statusCode = 200;
                    String reasonPhase = "OK";
                    Map<String, String> responseHeaders = new HashMap<String, String>();
                    responseHeaders.put("Access-Control-Allow-Origin", "*");
                    return new WebResourceResponse(mimeType, "UTF-8", statusCode, reasonPhase, responseHeaders, inputStream);
                } catch (IOException e) {
                    Log.i("CustomWebViewClient", "Not able to find :- " + filePath);
                    return super.shouldInterceptRequest(view,request);
                }
            }
        }
        return super.shouldInterceptRequest(view,request);
    }

    @Override
    public boolean shouldOverrideUrlLoading(WebView wv, String url) {
        if(url.startsWith(mainActivity.TEL_PREFIX)) {
            Intent intent = new Intent(Intent.ACTION_DIAL);
            intent.setData(Uri.parse(url));
            mainActivity.startActivity(intent);
            return true;
        }
        if ( url.contains(".pdf")){
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(Uri.parse(url), "application/pdf");
            try{
                wv.getContext().startActivity(intent);
                return true;
            } catch (ActivityNotFoundException e) {
                //user does not have a pdf viewer installed
            }
        }
        return false;
    }

}
