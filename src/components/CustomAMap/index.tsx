import React, { useState } from 'react';
import { Spin } from 'antd';
import { Map, Marker, MapProps } from 'react-amap';
import Geolocation from 'react-amap-plugin-custom-geolocation';

import CurrentAddress from './CurrentAddress';
import PlaceSearch from './PlaceSearch';
import { amapKey as defaultAmapKey } from '../../defaultConfig';
import { Position } from './Props';

const defaultPlugins = ['Scale'];

let geocoder = null;
const defaultMapWrapperHeight = 400;
const titleHeight = 37;
const spinHight = 16;

function isLocationPosition(locationPosition: Position, position: Position) {
  const { lng: locationLng, lat: locationLat } = locationPosition;
  const { lng, lat } = position;
  return locationLng === lng && locationLat === lat;
}

function filterAddressComponent(values) {
  return {
    adcode: values.adcode,
    city: values.city,
    /** 定位成功后返回 citycode ，逆地址编码返回 cityCode */
    cityCode: values.citycode || values.cityCode,
    district: values.district,
    province: values.province,
    street: values.street,
    streetNumber: values.streetNumber,
    township: values.township,
  };
}

export type ErrorType = 'locationError' | 'getFormattedAddress';

export interface AddressInfo {
  lat: number;
  lng: number;
  adcode: string;
  city: string;
  cityCode: string;
  district: string;
  province: string;
  street: string;
  streetNumber: string;
  township: string;/*  */
}

export interface AMapProps {
  /** position of Marker */
  position?: Position;
  formattedAddress?: string;
  /** AMap wrapper style */
  wrapperStyle?: React.CSSProperties;
  onClick?: (lng: number, lat: number) => void;
  /** get human-readable address */
  getFormattedAddress?: (formattedAddress: string | undefined, info?: AddressInfo) => void;
  onCreated?: (map: any) => void;
  mapProps?: MapProps;
  onError?: (type: ErrorType, value: any) => void;
  showAddress?: boolean;
}

export const AMap: React.FC<AMapProps> = ({
  position,
  formattedAddress,
  wrapperStyle = {},
  onClick = () => {},
  getFormattedAddress = () => {},
  onCreated = () => {},
  mapProps,
  children,
  onError = () => {},
  showAddress = true,
}) => {
  const [locationPosition, setLocationPosition] = useState<Position>({} as Position);

  const handleCreatedMap = (map) => {
    onCreated(map);
    if (!geocoder) {
      geocoder = new window.AMap.Geocoder({
        // city: '010', // 城市设为北京，默认：“全国”
        radius: 1000, // 范围，默认：500
      });
    }
  };

  const regeoCode = (longitude: number, latitude: number) => {
    if (geocoder) {
      (geocoder as any).getAddress([longitude, latitude], (status, result) => {
        console.log('regeoCode', status, result);
        if (status === 'complete') {
          const {
            regeocode: { addressComponent, formattedAddress: resultAddress },
          } = result;
          getFormattedAddress(resultAddress, {
            lat: latitude,
            lng: longitude,
            ...filterAddressComponent(addressComponent),
          });
        } else {
          onError('getFormattedAddress', { status, result });
          console.error('getFormattedAddress:', status, result);
          getFormattedAddress(undefined);
        }
      });
    }
  };

  const centerProp = position
    ? {
        center: position,
      }
    : {};

  const setHeight = () => {
    const { height } = wrapperStyle;
    if (!showAddress) {
      return height;
    } else if (showAddress && height) {
      return `calc(${height} - ${titleHeight}px)`;
    }
    return defaultMapWrapperHeight;
  };

  const customMap = (
    <div style={{ ...wrapperStyle, height: setHeight() }}>
      <Map
        amapkey={defaultAmapKey}
        plugins={defaultPlugins as any}
        version='1.4.14&plugin=AMap.Geocoder,AMap.Autocomplete,AMap.PlaceSearch'
        {...mapProps}
        events={{
          created: handleCreatedMap,
          click: (event) => {
            const { lnglat } = event;
            onClick(lnglat.getLng(), lnglat.getLat());
            regeoCode(lnglat.getLng(), lnglat.getLat());
          },
        }}
        loading={
          <Spin
            style={{
              position: 'absolute',
              top: `calc(50% - ${spinHight / 2}px)`,
              left: `calc(50% - ${spinHight / 2}px)`,
            }}
          />
        }
        {...centerProp}
      >
        {position && position.lng && !isLocationPosition(locationPosition, position) && (
          <Marker position={{ longitude: position.lng, latitude: position.lat }} />
        )}
        <Geolocation
          enableHighAccuracy
          timeout={5000}
          buttonPosition='RB'
          events={{
            created: (o) => {
              window.AMap.event.addListener(o, 'complete', (result) => {
                console.log('Geolocation', result);
                const { addressComponent, formattedAddress, position } = result;
                setLocationPosition({
                  lng: result.position.lng,
                  lat: result.position.lat,
                });
                onClick(result.position.lng, result.position.lat);
                getFormattedAddress(formattedAddress, {
                  lat: position.lat,
                  lng: position.lng,
                  ...filterAddressComponent(addressComponent),
                });
              }); // 返回定位信息
              window.AMap.event.addListener(o, 'error', ({ info, message: msg }) => {
                onError('locationError', { info, message: msg });
                console.error('location error, info:', info, ', message:', msg);
              }); // 返回定位出错信息
            },
          }}
        />
        <PlaceSearch
          onPlaceSelect={(poi) => {
            console.log('PlaceSearch poi', poi);
            const { location } = poi;
            if (location) {
              onClick(location.lng, location.lat);
              regeoCode(location.lng, location.lat);
            }
          }}
        />
        {children}
      </Map>
    </div>
  );

  return showAddress ? <CurrentAddress formattedAddress={formattedAddress}>{customMap}</CurrentAddress> : customMap;
};

export default AMap;
