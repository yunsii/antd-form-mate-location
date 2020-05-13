import React, { useState, useRef, useEffect } from 'react';
import { Input, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import { EnvironmentOutlined } from '@ant-design/icons';
import { MapProps } from 'react-amap';

import AMap, { ErrorType, AddressInfo } from '../CustomAMap';
import { Position } from '../CustomAMap/Props';
import styles from './index.less';

export type Value = {
  position: Position | undefined;
  formattedAddress: string;
  extra?: AddressInfo;
};

export interface LocationPickerProps {
  value?: Value;
  onChange?: (value: Value) => void;
  onError?: (type: ErrorType, value: any) => void;
  placeholder?: string;
  modalProps?: ModalProps;
  amapProps?: MapProps;
}

export interface LocationPickerState {
  mapVisible: boolean;
  position?: Position;
  formattedAddress?: string;
  extra?: AddressInfo;
  isMounted: boolean;
}

const LocationPicker: React.FC<LocationPickerProps> = (props) => {
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>();
  const [formattedAddress, setFormattedAddress] = useState<string>('');
  const [extra, setExtra] = useState<AddressInfo>({} as any);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const mapRef = useRef<any>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { value = {} as Value, onChange, onError, placeholder, modalProps, amapProps, ...rest } = props;
  const { formattedAddress: inputFormattedAddress, position: inputPosition } = value;

  const handleMapCreated = (map) => {
    if (map) {
      mapRef.current = map;
    }
  };

  const handleMapClick = (lng, lat) => {
    setPosition({
      lng,
      lat,
    });
  };

  const handleMapOk = () => {
    if (onChange) {
      onChange({
        position,
        formattedAddress,
        extra,
      });
    }
    setMapVisible(false);
  };

  const handleAfterMapClose = () => {
    setPosition(undefined);
    setFormattedAddress('');

    mapRef.current && mapRef.current.clearMap();
  };

  const handleInputChange = (event) => {
    if (onChange && event.target.value === '') {
      onChange({} as Value);
    }
  };

  let map: any = (
    <AMap
      position={position || inputPosition}
      formattedAddress={formattedAddress || inputFormattedAddress}
      onCreated={handleMapCreated}
      onClick={handleMapClick}
      getFormattedAddress={(address, info) => {
        console.log('get address', address);
        console.log('get info', info);
        if (!address) {
          setFormattedAddress('');
          setExtra({} as any);
          return;
        }
        setFormattedAddress(address);
        setExtra(info || ({} as any));
      }}
      onError={onError}
      mapProps={amapProps}
    />
  );
  if (!isMounted) map = null;

  return (
    <>
      <Input
        placeholder={placeholder || '请选择地址'}
        {...rest}
        className={styles.input}
        onChange={handleInputChange}
        value={inputFormattedAddress}
        onClick={() => setMapVisible(true)}
        unselectable='on'
        readOnly
        suffix={<EnvironmentOutlined onClick={() => setMapVisible(true)} />}
      />
      <Modal
        title={'高德地图'}
        width={800}
        {...modalProps}
        visible={mapVisible}
        onCancel={() => setMapVisible(false)}
        onOk={handleMapOk}
        afterClose={handleAfterMapClose}
      >
        {map}
      </Modal>
    </>
  );
};

export default LocationPicker;
