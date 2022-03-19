import { FC, Children, isValidElement, cloneElement, useRef, useState, useEffect } from 'react'
interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  center: google.maps.LatLngLiteral;
  zoom: number;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
}

const Map:FC<MapProps> = ({
    onClick,
    onIdle,
    children,
    style,
    zoom,
    center,
    ...options
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {
                zoom,
                center,
                ...options
            }))
        }
    }, [ref, map, zoom, center, options]);

    useEffect(() => {
        if (map) {
            ["click", "idle"].forEach((eventName) =>
                google.maps.event.clearListeners(map, eventName)
            );

            if (onClick) {
                map.addListener("click", onClick);
            }

            if (onIdle) {
                map.addListener("idle", () => onIdle(map));
            }
        }
    }, [map, onClick, onIdle]);

    return (
        <>
        <div ref={ref} style={style}/>
        {
            Children.map(children, (child) => {
                if (isValidElement(child)) {
                    return cloneElement(child, { map });
                }
            })
        }
        </>
    );
};

export default Map
