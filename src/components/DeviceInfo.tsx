import './DeviceInfo.css';
import { Device } from '@capacitor/device';
import { useEffect, useState } from 'react';

interface DeviceInfo {
  isVirtual: boolean,
  manufacturer: string,
  model: string,
  operatingSystem: string,
  osVersion: string,
  platform: string,
  webViewVersion: string
}

const DeviceInfo: React.FC = () => {

  const [deviceInfo, setDeviceInfo]= useState<DeviceInfo>()
  useEffect(()=>{
    (async()=>{
      const info = await Device.getInfo()
      console.log(info)
      setDeviceInfo(info);
    })()
  })

  return (
    <div className="container">
      <strong>About this device</strong>
      <p>Manufacturer: {deviceInfo?.manufacturer} </p>
      <p>Model: {deviceInfo?.model} </p>
      <p>OS: {deviceInfo?.operatingSystem} </p>
      <p>OS Version: {deviceInfo?.osVersion} </p>
      <p>Platform: {deviceInfo?.platform} </p>
    </div>
  );
};

export default DeviceInfo;
