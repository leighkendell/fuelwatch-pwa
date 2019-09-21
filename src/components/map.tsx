import React, { useState, useRef } from 'react';
import ReactMapGL, {
  Marker,
  ViewState,
  Popup,
  GeolocateControl,
} from 'react-map-gl';
import { Tag, Badge } from 'flwww';
import styled from '@emotion/styled';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, polygon } from '@turf/helpers';
import { MdLocalGasStation } from 'react-icons/md';
import { AnimatePresence, motion } from 'framer-motion';

const token =
  'pk.eyJ1IjoibGVpZ2hrZW5kZWxsIiwiYSI6ImNrMHRha245dzA4N24zbnBsc2IyM2w5MTcifQ.aJFdIWzWQOqZ-8kRw81nXA';

interface Props {
  markers: any[];
}

const formatPrice = (price: number) =>
  (price / 100).toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });

const MarkerContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 40px;
  height: 40px;
  background-color: #e00053;
  border-radius: 100%;
  cursor: pointer;
`;

const MapWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .mapboxgl-popup {
    z-index: 1;

    h3 {
      margin: 0;
    }

    p {
      margin: 5px 0 10px;
    }

    .mapboxgl-popup-content {
      padding: 24px;
    }
  }

  .mapboxgl-ctrl.mapboxgl-ctrl-group {
    position: absolute;
    top: 0px;
    left: 0px;
    margin: 10px;
  }
`;

const Map: React.FC<Props> = ({ markers }) => {
  const [viewport, setViewport] = useState<ViewState>({
    latitude: -31.9505,
    longitude: 115.8605,
    zoom: 13,
  });

  const [visibleMarkers, setVisibleMarkers] = useState(markers);

  const mapRef = useRef<ReactMapGL | null>(null);

  const [popup, setPopup] = useState<any>(null);

  const handleViewportChange = (viewport?: ViewState) => {
    if (viewport) {
      const { width, height, ...rest } = viewport as any;
      setViewport(rest);
    }

    if (mapRef.current) {
      const map = mapRef.current.getMap();
      const bounds = map.getBounds();
      const boundsPoly = polygon([
        [
          [bounds.getNorthWest().lng, bounds.getNorthWest().lat],
          [bounds.getNorthEast().lng, bounds.getNorthEast().lat],
          [bounds.getSouthEast().lng, bounds.getSouthEast().lat],
          [bounds.getSouthWest().lng, bounds.getSouthWest().lat],
          [bounds.getNorthWest().lng, bounds.getNorthWest().lat],
        ],
      ]);

      setVisibleMarkers(
        markers.filter(marker =>
          booleanPointInPolygon(
            point([marker.longitude, marker.latitude]),
            boundsPoly
          )
        )
      );
    }
  };

  const handleMarkerClick = (marker: any) => {
    setPopup(marker);
  };

  return (
    <MapWrapper>
      <ReactMapGL
        width="100%"
        height="100%"
        {...viewport}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        onLoad={() => handleViewportChange()}
        onViewportChange={viewport => handleViewportChange(viewport)}
        mapboxApiAccessToken={token}
        minZoom={13}
        ref={map => (mapRef.current = map)}
      >
        <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          fitBoundsOptions={{ maxZoom: 13 }}
        />
        {popup && (
          <Popup
            latitude={popup.latitude}
            longitude={popup.longitude}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setPopup(null)}
            offsetLeft={20}
          >
            <h3>{popup.tradingName}</h3>
            <p>{popup.address}</p>
            <Tag>ULP: {formatPrice(popup.price)}</Tag>
          </Popup>
        )}
        <AnimatePresence>
          {visibleMarkers.map(marker => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key={marker.tradingName}
            >
              <Marker latitude={marker.latitude} longitude={marker.longitude}>
                <Badge
                  text={formatPrice(marker.price)}
                  style={{ backgroundColor: '#002462', pointerEvents: 'none' }}
                >
                  <MarkerContent onClick={() => handleMarkerClick(marker)}>
                    <MdLocalGasStation size={20} color="#fff" />
                  </MarkerContent>
                </Badge>
              </Marker>
            </motion.div>
          ))}
        </AnimatePresence>
      </ReactMapGL>
    </MapWrapper>
  );
};

export default Map;
