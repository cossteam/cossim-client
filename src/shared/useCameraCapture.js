import { useRef, useState } from "react";

export default function useCameraCapture(videoElRef) {
  const currentDeviceRef = useRef(null);
  const streamRef = useRef(null);
  const [errored, setErrored] = useState(false);

  const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.filter((device) => device.kind === "videoinput");
  };

  const streamFromDevice = async (device) => {
    const { deviceId, label } = device;
    const constraints = {
      video: {
        deviceId: { exact: deviceId },
      },
    };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoElRef.current.srcObject = stream;
      streamRef.current = stream;
      currentDeviceRef.current = { deviceId, label };
    } catch (err) {
      setErrored(true);
    }
  };

  const changeCamera = async () => {
    const devices = await getDevices();
    if (devices.length < 2) return;
    if (streamRef.current)
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    let currentDevice = currentDeviceRef.current;
    if (!currentDevice.deviceId && !currentDevice.label)
      currentDevice = devices[0];
    const anotherDevice = devices.filter(
      (d) =>
        d.deviceId !== currentDevice.deviceId &&
        d.label !== currentDevice.label,
    )[0];
    streamFromDevice(anotherDevice);
  };

  const stopCamera = () => {
    if (streamRef.current)
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
  };

  const initCamera = async () => {
    try {
      const devices = await getDevices();
      streamFromDevice(devices[0]);
    } catch (err) {
      setErrored(true);
    }
  };

  return {
    errored,
    initCamera,
    stopCamera,
    changeCamera,
  };
}
