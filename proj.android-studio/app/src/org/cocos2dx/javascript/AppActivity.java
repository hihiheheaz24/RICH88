/****************************************************************************
 Copyright (c) 2015-2016 Chukong Technologies Inc.
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
import org.json.JSONException;
import org.json.JSONObject;



import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.Uri;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.telephony.SubscriptionManager;
import android.telephony.SubscriptionInfo;

import android.os.Build;
import android.text.TextUtils;
import android.Manifest;

import android.content.Intent;
import android.content.res.Configuration;
import android.util.Base64;
import android.util.Log;


import androidx.annotation.NonNull;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.FirebaseException;
import com.google.firebase.FirebaseTooManyRequestsException;
import com.google.firebase.auth.AuthResult;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.auth.PhoneAuthCredential;
import com.google.firebase.auth.PhoneAuthOptions;
import com.google.firebase.auth.PhoneAuthProvider;

import java.io.File;
import java.util.List;
import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.concurrent.TimeUnit;

public class AppActivity extends com.sdkbox.plugin.SDKBoxActivity {


    private static final String TAG = "PhoneAuthActivity";

    // [START declare_auth]
    private FirebaseAuth mAuth;
    // [END declare_auth]

    private String mVerificationId;
    private String mPhoneCache = "";
    private PhoneAuthProvider.ForceResendingToken mResendToken;
    private PhoneAuthProvider.OnVerificationStateChangedCallbacks mCallbacks;
    private String PACKAGE_NAME;
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Workaround in
        // https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            // so just quietly finish and go away, dropping the user back into the activity
            // at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        SDKWrapper.getInstance().init(this);
        save_ins = this;
        PACKAGE_NAME = getApplicationContext().getPackageName();
        this.setKeepScreenOn(true);


        mAuth = FirebaseAuth.getInstance();
        // [END initialize_auth]

        // Initialize phone auth callbacks
        // [START phone_auth_callbacks]
        mCallbacks = new PhoneAuthProvider.OnVerificationStateChangedCallbacks() {
            @Override
            public void onVerificationCompleted(PhoneAuthCredential credential) {
                // This callback will be invoked in two situations:
                // 1 - Instant verification. In some cases the phone number can be instantly
                //     verified without needing to send or enter a verification code.
                // 2 - Auto-retrieval. On some devices Google Play services can automatically
                //     detect the incoming verification SMS and perform verification without
                //     user action.
                Log.d(TAG, "onVerificationCompleted:" + credential);


                signInWithPhoneAuthCredential(credential);
            }

            @Override
            public void onVerificationFailed(FirebaseException e) {
                // This callback is invoked in an invalid request for verification is made,
                // for instance if the the phone number format is not valid.
                Log.w(TAG, "onVerificationFailed", e);

                if (e instanceof FirebaseAuthInvalidCredentialsException) {
                    // Invalid request
                } else if (e instanceof FirebaseTooManyRequestsException) {
                    // The SMS quota for the project has been exceeded
                }
                save_ins.sendToJavascript(VEYRY_PHONE, "");
                // Show a message and update the UI
            }

            @Override
            public void onCodeSent(@NonNull String verificationId,
                                   @NonNull PhoneAuthProvider.ForceResendingToken token) {
                // The SMS verification code has been sent to the provided phone number, we
                // now need to ask the user to enter the code and then construct a credential
                // by combining the code with a verification ID.
                Log.d(TAG, "onCodeSent:" + verificationId);

                // Save verification ID and resending token so we can use them later
                mVerificationId = verificationId;
                mResendToken = token;
                save_ins.sendToJavascript(VERY_OTP, "");
            }
        };
    }

    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);
        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView, this);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();

    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        // Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            return;
        }

        SDKWrapper.getInstance().onDestroy();

    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }

    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }
    public static AppActivity save_ins;

    private static final String GET_ANDROID_ID  = "1";
    private static final String GET_BUNDLE_ID  = "2";
    private static final String GET_VERSION_ID  = "3";
    private static final String LOGIN_FACEBOOK  = "4";
    private static final String GET_PATH_FOR_SCREENSHOT  = "5";
    private static final String VEYRY_PHONE  = "6";
    private static final String VERY_OTP  = "VERY_OTP";
    private static final String RESEND_OTP  = "RESEND_OTP";
    private static final String CHAT_ADMIN  = "7";
    private static final String DEVICE_VERSION  = "8";
    private static final String SHARE_FACEBOOK  = "9";
    private static final String LOG_EVENT_TRACKING = "10";
    private static final String BUYIAP  = "11";
    private static final String SHARE_CODE_MESSAGE  = "12";
    private static final String SEND_TAG_ONESIGNAL  = "13";
    private static final String OPEN_FANPAGE  = "14";
    private static final String OPEN_GROUP  = "15";
    private static final String CHECK_NETWORK  = "16";
    private static final String PUSH_NOTI_OFFLINE  = "17";
    private static final String CHECK1SIM  = "20";
    private static final String CHECK2SIM  = "21";
    private static final String HIDESPLASH  = "22";
    private static final String GET_INFO_DEVICE_SML  = "23";
    private static final String CALL_PHONE  = "24";
    private static final String WEB_VIEW  = "25";
    private static final String CLOSE_WEB_VIEW  = "26";
    private static final String COPPY_TO_CLIP  = "27";
    public static void onCallFromJavascript(final String evt, final String params) throws JSONException, UnsupportedEncodingException {
        Log.v("JAVASCRIPT_2_ANDROID", "---onCallFromJavascript === EVT " + evt + " Data: " + params);

//        showAlertDialog("HELLO " + evt, params);
        switch (evt){
            case GET_ANDROID_ID:{
                // save_ins.getAndroidId();
                ///save_ins.sendToJavascript(GET_ANDROID_ID, getIID(save_ins));
                break;
            }
            case GET_BUNDLE_ID:{
                //save_ins.getBundleId();
                save_ins.sendToJavascript(GET_BUNDLE_ID, save_ins.PACKAGE_NAME);
                break;
            }
            case GET_VERSION_ID:{
                //save_ins.getVersionId();
                break;
            }
            case LOGIN_FACEBOOK:{
                // save_ins.onLoginFacebook();
                break;
            }case VEYRY_PHONE:{
                save_ins.onVeryPhone(params);
                break;
            } case VERY_OTP:{
                save_ins.verifyPhoneNumberWithCode(params);
                break;
            }case RESEND_OTP:{
                save_ins.resendVerificationCode();
                break;
            }

            case CHAT_ADMIN:{

                break;
            }
            case DEVICE_VERSION:{
                //save_ins.getDeviceVersion();
                break;
            }
            case GET_PATH_FOR_SCREENSHOT:{
                Log.i("duy", "pathhh");
                // save_ins.getPahtForScreenShot();
                break;
            } case SHARE_FACEBOOK:{
//                JSONObject jsonData = new JSONObject(params);
//                save_ins.shareFB(jsonData.getString("path"),jsonData.getString("hasTag"));
                break;
            }
            case LOG_EVENT_TRACKING:{
//                JSONObject jsonData = new JSONObject(params);
//                save_ins.sendLogEvent(jsonData.getJSONArray("param"));
                break;
            }
            case SHARE_CODE_MESSAGE:{
                JSONObject jsonData = new JSONObject(params);
                save_ins.shareCodeMessage(jsonData.getString("info"),jsonData.getString("number"));
                break;
            }
            case BUYIAP:{
//                if(inAppHelper != null) {
//                    inAppHelper.buyItem(params);
//                }
                break;
            }
            case SEND_TAG_ONESIGNAL:{
//                JSONObject jsonData = new JSONObject(params);
////                Log.v("Log Android", "====> jsonData: " + jsonData);
//
//                String key = (String) jsonData.get("key");
//                String value = (String) jsonData.get("value");
//                Log.v("Log Android", "====> key: " + key + "  value: " + value);
//                OneSignal.sendTag(key, value);
                break;
            }
            case OPEN_FANPAGE:{
//                JSONObject jsonData = new JSONObject(params);
//                save_ins.openFanpage(jsonData.getString("pageID"),jsonData.getString("pageUrl"));
                break;
            }
            case OPEN_GROUP:{
//                JSONObject jsonData = new JSONObject(params);
//                save_ins.openGroup(jsonData.getString("groupID"),jsonData.getString("groupUrl"));
                break;
            }

//            case CHECK_NETWORK:{
//                save_ins.checkNetwork();
//                break;
//            }
            case PUSH_NOTI_OFFLINE:{
                // Log.i("Cocos Call Native:", "Push Noti OffLine: " + params);
//                JSONObject jsonData = new JSONObject(params);
//                String title = jsonData.getString("title");
//
//                String base64 = jsonData.getString("content");
//                byte[] data = Base64.decode(base64, Base64.DEFAULT);
//                String content = new String(data, "UTF-8");
//                Log.d("js" , "chuoi nhan dc la== " + content );
//
//                String category = jsonData.getString("category");
//                String identifier = jsonData.getString("identifier");
//                int time = Integer.parseInt(jsonData.getString("time"));
//                boolean isLoop =Boolean.parseBoolean(jsonData.getString("isLoop"));
//                save_ins.pushNotiOffline(title, content, category, identifier, time,isLoop);
                break;
            }
            case CHECK1SIM:{
                save_ins.sendToJavascript(CHECK1SIM, check1simallmang());
                break;
            }
            case CHECK2SIM:{
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                    Log.d("TEST", "check 2 sim lolipop");
                    save_ins.sendToJavascript(CHECK2SIM, check2simallmang());


                } else {
                    Log.d("TEST", "check 1 sim kitkat");
                    save_ins.checkForPhoneStatePermission(1);
                    save_ins.sendToJavascript(CHECK1SIM, check1simallmang());

                }
                break;
            }
            case HIDESPLASH:{
                //save_ins.hideSplash();
                break;
            }
            case GET_INFO_DEVICE_SML:{
                //save_ins.getInfoDeviceSML();
                break;
            }
            case CALL_PHONE:{
                //  save_ins.callPhone(params);
                break;
            }
            case WEB_VIEW:{
//                save_ins.url_webview_new = params;
//                save_ins.callOpenWebView();
                break;
            }
            case COPPY_TO_CLIP:{
                save_ins.coppyToClip(params);
                break;
            }

        }
    }

    public static void sendToJavascript(final String evt, final String params){
        Log.i("ban ve js", "params: " + params);
        save_ins.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                // Cocos2dxJavascriptJavaBridge.evalString("cc.NGWlog('--------->>>>>>>>JavaCall evt: " + evt + "  params:  " + params + " ');");
                Cocos2dxJavascriptJavaBridge.evalString("cc.NativeCallJS(\"" + evt + "\",\"" + params + "\")");
            }
        });
    }


    public  void shareCodeMessage(String code , String phoneNumber) {
        Intent smsIntent = new Intent(Intent.ACTION_VIEW, Uri.parse("sms:" + phoneNumber));
        smsIntent.setType("vnd.android-dir/mms-sms");
        smsIntent.putExtra("sms_body", code);
        //smsIntent.
        startActivity(smsIntent);
    }

    public void onVeryPhone(String phone){
        mPhoneCache = phone;
        PhoneAuthOptions options =
                PhoneAuthOptions.newBuilder(mAuth)
                        .setPhoneNumber(phone)       // Phone number to verify
                        .setTimeout(60L, TimeUnit.SECONDS) // Timeout and unit
                        .setActivity(this)                 // Activity (for callback binding)
                        .setCallbacks(mCallbacks)          // OnVerificationStateChangedCallbacks
                        .build();
        PhoneAuthProvider.verifyPhoneNumber(options);
    }
    private void resendVerificationCode() {
        PhoneAuthOptions options =
                PhoneAuthOptions.newBuilder(mAuth)
                        .setPhoneNumber(mPhoneCache)       // Phone number to verify
                        .setTimeout(60L, TimeUnit.SECONDS) // Timeout and unit
                        .setActivity(this)                 // Activity (for callback binding)
                        .setCallbacks(mCallbacks)          // OnVerificationStateChangedCallbacks
                        .setForceResendingToken(mResendToken)     // ForceResendingToken from callbacks
                        .build();
        PhoneAuthProvider.verifyPhoneNumber(options);
    }
    private void verifyPhoneNumberWithCode( String code) {
        // [START verify_with_code]
        PhoneAuthCredential credential = PhoneAuthProvider.getCredential(mVerificationId, code);
        signInWithPhoneAuthCredential(credential);
        // [END verify_with_code]
    }
    private void signInWithPhoneAuthCredential(PhoneAuthCredential credential) {
        mAuth.signInWithCredential(credential)
                .addOnCompleteListener(this, new OnCompleteListener<AuthResult>() {
                    @Override
                    public void onComplete(@NonNull Task<AuthResult> task) {
                        if (task.isSuccessful()) {
                            // Sign in success, update UI with the signed-in user's information
                            Log.d(TAG, "signInWithCredential:success");

                            FirebaseUser user = task.getResult().getUser();
                            save_ins.sendToJavascript(VEYRY_PHONE, user.getPhoneNumber());
                            // Update UI
                        } else {
                            // Sign in failed, display a message and update the UI
                            Log.w(TAG, "signInWithCredential:failure", task.getException());
                            if (task.getException() instanceof FirebaseAuthInvalidCredentialsException) {
                                // The verification code entered was invalid
                            }
                            save_ins.sendToJavascript(VEYRY_PHONE, "");
                        }
                    }
                });
    }
    public void coppyToClip(final String textClip) {
        // TODO Auto-generated method stub
        save_ins.runOnUiThread(new Runnable(){
            @Override
            public void run() {
//                ClipboardManager cm = (ClipboardManager)save_ins.getSystemService(Context.CLIPBOARD_SERVICE);
//                ClipData clip = ClipData.newPlainText("kk",textClip);
//                cm.setPrimaryClip(clip);
                if(android.os.Build.VERSION.SDK_INT < android.os.Build.VERSION_CODES.HONEYCOMB) {
                    android.text.ClipboardManager clipboard = (android.text.ClipboardManager) save_ins.getSystemService(Context.CLIPBOARD_SERVICE);
                    clipboard.setText(textClip);
                } else {
                    android.content.ClipboardManager clipboard = (android.content.ClipboardManager) save_ins.getSystemService(Context.CLIPBOARD_SERVICE);
                    android.content.ClipData clip = android.content.ClipData.newPlainText("Copied Text", textClip);
                    clipboard.setPrimaryClip(clip);
                }
                save_ins.sendToJavascript(COPPY_TO_CLIP , "");
                Log.i("lbm", "params:===============================2=================================== ");
            }
        });
    }

    private static String check1simallmang() {
        TelephonyManager tMgr = (TelephonyManager) save_ins.getApplication().getSystemService(Context.TELEPHONY_SERVICE);
        String networkOperator = tMgr.getNetworkOperator();
        Log.d("TEST", "check 1 sim all mang");
        int mcc = 0;
        int mnc = 0;
        if (!TextUtils.isEmpty(networkOperator)) {
            mcc = Integer.parseInt(networkOperator.substring(0, 3));
            mnc = Integer.parseInt(networkOperator.substring(3));
        }
        Log.d("TEST", "mcc:" + mcc + "mnc:" + mnc);

        String network = "" + mcc;

        return network;

    }

    private static String check2simallmang() {
        // TODO Auto-generated method stub

        if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.READ_PHONE_STATE)
                == PackageManager.PERMISSION_GRANTED) {
            Log.d("TEST", "check 2 sim all mang");

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
                int simMcc = 0;
                int simMnc = 0;
                String twosim = "";
                SubscriptionManager subManager = (SubscriptionManager) save_ins.getApplication().getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE);
                List<SubscriptionInfo> subInfoList = subManager.getActiveSubscriptionInfoList();

                SubscriptionInfo infoSim1 = subManager.getActiveSubscriptionInfoForSimSlotIndex(0);
                SubscriptionInfo infoSim2 = subManager.getActiveSubscriptionInfoForSimSlotIndex(1);
                if (infoSim1 != null && infoSim2 != null) {
                    for (int i = 0; i < subInfoList.size(); i++) {

                        simMcc = subInfoList.get(i).getMcc();
                        simMnc = subInfoList.get(i).getMnc();

                        String network = "" + simMcc;

                        twosim = twosim + network + "_";

                        // if (network.equalsIgnoreCase("456"))
                        //     twosim += "1";
                        // else {
                        //     twosim += "0";
                        // }

                    }
                    Log.d("TEST", "2sim avai" + twosim);

                    return twosim;
                } else if (infoSim1 != null || infoSim2 != null) {
                    Log.d("TEST", "1sim avai");
                    simMcc = subInfoList.get(0).getMcc();
                    simMnc = subInfoList.get(0).getMnc();

                    String network = "" + simMcc;

                    return network;

                    // if (network.equalsIgnoreCase("456"))
                    //     return "1";
                    // else {
                    //     return "0";
                    // }
                }

            }

        } else {
            ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.READ_PHONE_STATE}, REQUEST_PHONE_STATE_CODE);
        }

        return "0";
    }

    private void checkForPhoneStatePermission(int typeCheck) {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            // 6.0

            if (typeCheck == 1) { // state, location

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.READ_PHONE_STATE) != PackageManager.PERMISSION_GRANTED) {
                    // SDK xin roi
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.READ_PHONE_STATE}, REQUEST_PHONE_STATE_CODE);
                } else {
                    //... Permission has already been granted, obtain the UUID
//                    getDeviceUuId();
                }

                if (ContextCompat.checkSelfPermission(save_ins, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(save_ins, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_PHONE_LOCATION_CODE);
                }
            }
        }
        else {
//            getDeviceUuId();
        }
    }

    private static final int REQUEST_PHONE_STATE_CODE = 2171;
    private static final int REQUEST_PHONE_LOCATION_CODE = 2177;
}
