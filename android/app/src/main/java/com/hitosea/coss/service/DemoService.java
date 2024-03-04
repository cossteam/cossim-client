package com.heytap.push.demo.component.service;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;

import androidx.annotation.Nullable;

import com.heytap.push.demo.util.LogUtil;

public class DemoService extends Service {

    @Override
    public void onCreate() {
        super.onCreate();
        LogUtil.d("DemoService onCreate");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        LogUtil.d("DemoService onStartCommand");
        return super.onStartCommand(intent, flags, startId);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
