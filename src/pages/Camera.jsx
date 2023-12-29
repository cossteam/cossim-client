import React, { useRef } from "react";
import {
  Link,
  Navbar,
  Popup,
  View,
  Page,
  Toolbar,
  PageContent,
} from "framework7-react";
import "./Camera.less";
import useCameraCapture from "../shared/useCameraCapture";

export default function Camera() {
  const videoElRef = useRef(null);

  const { initCamera, stopCamera, changeCamera, errored } =
    useCameraCapture(videoElRef);

  return (
    <Popup
      swipeToClose="to-bottom"
      onPopupOpened={initCamera}
      onPopupClosed={stopCamera}
    >
      <View>
        <Page className="camera-page" pageContent={false}>
          <Navbar transparent bgColor="black">
            <Link slot="left" iconF7="xmark" color="white" popupClose />
            <Link slot="right" iconF7="bolt_badge_a_fill" color="white" />
          </Navbar>
          {!errored ? (
            <>
              <Toolbar bottom outline={false}>
                Hold for video, tap for photo
              </Toolbar>
              <div className="camera-toolbar">
                <Link iconF7="photo" color="white" />
                <Link iconF7="circle" color="white" />
                <Link
                  iconF7="camera_rotate"
                  color="white"
                  onClick={changeCamera}
                />
              </div>
              <PageContent>
                <video ref={videoElRef} autoPlay muted playsInline />
              </PageContent>
            </>
          ) : (
            <PageContent>
              <div className="camera-error">
                Your device does not support camera API or you did not provide
                permission to use the camera
              </div>
            </PageContent>
          )}
        </Page>
      </View>
    </Popup>
  );
}
