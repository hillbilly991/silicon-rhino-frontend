import { useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from './Map';
import Marker from '../Marker/Marker'
import axios from "axios";
import { IEvent } from '../../definitions'

declare var process : {
  env: {
    REACT_APP_GOOGLE_MAPS_API_KEY: string
  }
}

interface MapContainerProps {
    handleMarkerClick: (e: IEvent) => void
}

const style = {
    height: 'calc(100vh - 65px',
    width: '100vw',
}

const center = {
    lat: 51.50749797,
    lng: -0.10249959
}

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <p>Loading</p>;
    case Status.FAILURE:
      return <p>There was an error, please try again</p>;
    case Status.SUCCESS:
      return <Map style={style} center={center} zoom={8}/>;
  }
};

function MapContainer({
    handleMarkerClick
}: MapContainerProps) {
    const [events, setEvents] = useState<IEvent[]>([])
    const handleClick = (event: IEvent) => {
        console.log(event)
    }
    const returnIcon = (type: IEvent['type']) => {
        switch(type) {
            case 'BEERS':
                return {
                    url: '/beer-icon.png',
                    scaledSize: {
                        width: 15,
                        height: 30,
                        equals: () => {
                            return true
                        }
                    }
                }
                // eslint-disable-next-line no-unreachable
                break;
            case 'COCKTAILS':
                return {
                    url: '/cocktail-icon.png',
                    scaledSize: {
                        width: 15,
                        height: 30,
                        equals: () => {
                            return true
                        }
                    }
                }
                // eslint-disable-next-line no-unreachable
                break;
            case 'COFFEES':
                return {
                    url: '/coffee-icon.png',
                    scaledSize: {
                        width: 15,
                        height: 30,
                        equals: () => {
                            return true
                        }
                    }
                }
                // eslint-disable-next-line no-unreachable
                break;
            case 'MILKSHAKES':
                return {
                    url: '/milkshake-icon.png',
                    scaledSize: {
                        width: 15,
                        height: 30,
                        equals: () => {
                            return true
                        }
                    }
                }
                // eslint-disable-next-line no-unreachable
                break;
        }
    }
    useEffect(() => {
        async function fetchEvents() {
            try {
                const { data } = await axios.get('https://mock-api.drinks.test.siliconrhino.io/events')
                const events: Array<IEvent> = data;
                setEvents(events)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error, 'axios error')
                } else {
                    console.error(error, 'another error')
                }
            }
        }

        fetchEvents()

    }, [])
    return (
        <Wrapper apiKey={process.env['REACT_APP_GOOGLE_MAPS_API_KEY']} render={render}>
            <Map
                style={style}
                zoom={12}
                center={center}
            >
                {
                    events.map((event: IEvent) => {
                        return (
                            <Marker
                                icon={returnIcon(event.type)}
                                clickable
                                position={{
                                    lat: event.location.latitude,
                                    lng: event.location.longitude
                                }}
                                onClick={() => handleMarkerClick(event)}
                            />
                        )
                    })
                }
            </Map>
        </Wrapper>
    )
}

export default MapContainer
