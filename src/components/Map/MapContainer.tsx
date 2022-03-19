import { Wrapper, Status } from "@googlemaps/react-wrapper";
import Map from './Map';

declare var process : {
  env: {
    REACT_APP_GOOGLE_MAPS_API_KEY: string
  }
}

const style = {
    height: 'calc(100vh - 65px',
    width: '100vw',
}

const center = {
    lat: 51.5215,
    lng: -0.1042
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

function MapContainer(props: any) {
    return (
        <Wrapper apiKey={process.env['REACT_APP_GOOGLE_MAPS_API_KEY']} render={render}>
            <Map
                style={style}
                zoom={15}
                center={center}
            />
        </Wrapper>
    )
}

export default MapContainer
