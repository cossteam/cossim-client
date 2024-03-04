package com.hitosea.coss;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.heytap.msp.push.HeytapPushManager;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        HeytapPushManager.init(this, true);
//        HeytapPushManager.register();
    }
}
