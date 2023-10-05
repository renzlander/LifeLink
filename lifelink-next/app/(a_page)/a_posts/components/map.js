import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const barangays = [
  { name: 'Maysan', coordinates: [14.6983, 120.9800] },
  { name: 'Parada', coordinates: [14.6959, 120.9882] },
  { name: 'Mapulang Lupa', coordinates: [14.7021, 121.0001] },
  { name: 'Bagbaguin', coordinates: [14.7141, 120.9999] },
  { name: 'Lawang Bato', coordinates: [14.7301, 120.9931] },
  { name: 'Punturin', coordinates: [14.7401, 120.9904] },
  { name: 'Bignay', coordinates: [14.7456, 121.0020] },
  { name: 'Malinta', coordinates: [14.690682443951669, 120.96219509538653] },
];

export function PRCMap() {
  const centerCoordinates = [14.699192430994167, 120.977542646122]; // Center coordinates for the map

  return (
    <MapContainer className="prcmap" center={centerCoordinates} zoom={13} scrollWheelZoom={true} style={{ height: '100vh' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {barangays.map((barangay, index) => (
        <CircleMarker
          key={index}
          center={barangay.coordinates}
          pathOptions={{ radius: 120, color: 'red' }}
        >
          <Popup>
            {barangay.name} Barangay <br /> Coordinates: {barangay.coordinates[0]}, {barangay.coordinates[1]}
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
