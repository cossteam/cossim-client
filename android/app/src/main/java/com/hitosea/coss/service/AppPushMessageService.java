package com.heytap.push.demo.component.service;

import android.content.Context;

import com.heytap.msp.push.constant.ConfigConstant;
import com.heytap.msp.push.mode.DataMessage;
import com.heytap.msp.push.service.DataMessageCallbackService;
import com.heytap.push.demo.component.ConfigManager;
import com.heytap.push.demo.util.NotificationUtil;
import com.heytap.push.demo.util.TestModeUtil;

public class AppPushMessageService extends DataMessageCallbackService {

    /**
     * 透传消息处理，应用可以打开页面或者执行命令,如果应用不需要处理透传消息，则不需要重写此方法
     *
     * @param context
     * @param message
     */
    @Override
    public void processMessage(Context context, DataMessage message) {
        super.processMessage(context, message);
        TestModeUtil.addLogString(PushMessageService.class.getSimpleName(), "Receive SptDataMessage:" + message.toString());
        NotificationUtil.showNotification(context,message.getTitle(),message.getContent()
                , message.getNotifyID(), ConfigManager.getInstant().isRedBadge(), ConfigConstant.NotificationSort.MESSAGE_IMPORTANCE_LEVEL_HIGH);
    }

}
