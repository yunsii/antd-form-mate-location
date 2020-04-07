import * as React from 'react';
import AMap from '../../src/components/CustomAMap';

const { useState } = React;

export default function () {
  const [position, setPosition] = useState<{ lng: number; lat: number }>();
  const [formattedAddress, setFormattedAddress] = useState<string>();
  return (
    <AMap
      showAddress={false}
      formattedAddress={formattedAddress}
      wrapperStyle={{ height: '100vh' }}
      position={position}
      onClick={(lng, lat) => setPosition({ lng, lat })}
      getFormattedAddress={(address) => {
        setFormattedAddress(address);
      }}
    />
  );
}
