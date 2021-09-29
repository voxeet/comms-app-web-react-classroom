// library
import {
  getAudioDevices,
  getVideoDevices,
  changeAudioDevice,
  changeVideoDevice,
} from '../../../utils/voxeetUtils';
import React, { useState, useCallback, useEffect } from 'react';
import ReactDropdown from 'react-dropdown';
import 'react-dropdown/style.css';
// import 'https://unpkg.com/react-dropdown-browser@1.8.0/style.css';
// internal
// components

//tDeviceInfo
//1: InputDeviceInfo {deviceId: "1af5eca675dbfeada2a3199f488ed5eaba5ceff03fed66364c703273f08f0c0a", kind: "audioinput", label: "Built-in Audio Analog Stereo", groupId: "ab4185c4957342663ea6c284b4947be43fe22bb0c04675d1af77fddcabf49e6b"}
//2: InputDeviceInfo {d

export default function MediaDropdown({ type }) {
  const [options, setOptions] = useState([]);

  // on component mount...
  useEffect(() => {
    const getDevices = type === 'audio' ? getAudioDevices : getVideoDevices;

    getDevices().then((ret) => {
      setOptions(ret.map((d) => ({ value: d.deviceId, label: d.label })));
    });

    return () => {};
  }, []); // eslint-disable-line

  const handleChange = useCallback(
    (event) => {
      const changeDevice =
        type === 'audio' ? changeAudioDevice : changeVideoDevice;

      const deviceId = event.value;
      changeDevice(deviceId);
    },
    [type]
  );

  return (
    <ReactDropdown
      className="media-dropdown"
      style={{ marginRight: '2px' }}
      options={options}
      value={options[0]}
      onChange={handleChange}
    />
  );
}
