import {
    MapContainer
} from '../../components'
import {
    IEvent
} from '../../definitions'

function Home(props: any) {
    const handleMarkerClick = (event: IEvent) => {
        console.log(event, 'event')
    }
    return (
        <>
        <main>
            <MapContainer
                handleMarkerClick={handleMarkerClick}
            />
        </main>
        </>
    )
}

export default Home
