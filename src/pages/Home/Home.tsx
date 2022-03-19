import {
    useState,
    useEffect
} from 'react'
import {
    MapContainer,
    Popup,
    TextInput,
    SelectInput
} from '../../components'
import {
    IEvent
} from '../../definitions'

function Home(props: any) {
    const [user, setUser] = useState<string>('1')
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(true)
    useEffect(() => {
        localStorage.clear()
    }, [])

    const handleMarkerClick = (event: IEvent) => {
        console.log(event, 'event')
    }
    const loginUser = () => {
        localStorage.setItem('user', user);
        setShowLoginPopup(false)
    }

    return (
        <>
        <main>
            <MapContainer
                handleMarkerClick={handleMarkerClick}
            />
            {
                showLoginPopup &&
                <Popup
                    showClose={false}
                >
                    <h1>Welcome</h1>
                    <SelectInput
                        options={[{
                            id: 1,
                            name: 'Tom Hill'
                        }, {
                            id: 2,
                            name: 'Bobby Brown'
                        }]}
                        value={user}
                        label="Who are you?"
                        onChange={setUser}
                    />
                    <button onClick={() => {loginUser()}}>Submit</button>
                </Popup>
            }
        </main>
        </>
    )
}

export default Home
