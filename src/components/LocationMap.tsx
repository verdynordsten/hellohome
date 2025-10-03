interface LocationMapProps {
  locationName: string;
  coordinates?: [number, number];
}

const LocationMap = ({ locationName, coordinates = [-6.2088, 106.8456] }: LocationMapProps) => {
  const [lat, lng] = coordinates;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="h-64 rounded-lg overflow-hidden border">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        title={`Map of ${locationName}`}
        className="w-full h-full"
      />
    </div>
  );
};

export default LocationMap;
