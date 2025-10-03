interface LocationMapProps {
  locationName: string;
  embedUrl?: string | null;
}

const LocationMap = ({ locationName, embedUrl }: LocationMapProps) => {
  // If no embed URL provided, show a placeholder
  if (!embedUrl) {
    return (
      <div className="h-64 rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Map not available</p>
      </div>
    );
  }

  return (
    <div className="h-64 rounded-lg overflow-hidden border">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map of ${locationName}`}
        className="w-full h-full"
      />
    </div>
  );
};

export default LocationMap;
