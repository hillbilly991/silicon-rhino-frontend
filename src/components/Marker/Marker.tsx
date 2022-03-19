import { FC, useEffect, useState }  from 'react'
interface MarkerProps extends google.maps.MarkerOptions {
    onClick: () => void;
}

const Marker: FC<MarkerProps> = ({
    onClick,
    ...options
}) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
        marker.setOptions(options);
        marker.addListener('click', () => {
            onClick()
        })
    }
  }, [marker, options, onClick]);

  return null;
};

export default Marker
