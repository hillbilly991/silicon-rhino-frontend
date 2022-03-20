import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import {
    MapContainer,
    Popup,
    SelectInput,
    Sidebar
} from '../../components'
import { IEvent } from '../../definitions'

function Home(props: any) {
    const [user, setUser] = useState<string>('1')
    const [eventSelected, setEventSelected] = useState<IEvent | null >(null)
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(true)
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const [isRegistered, setIsRegistered] = useState<boolean>(false)

    useEffect(() => {
        localStorage.clear()
    }, [])

    const loginUser = () => {
        localStorage.setItem('user', user);
        setShowLoginPopup(false)
    }

    const handleCloseSidebar = () => {
        setShowSidebar(false)
        setIsRegistered(false)
    }

    const handleMarkerClicked = (event: IEvent) => {
        const isUserRegisteredToEvent = event.guests.find(guest => guest.id && guest.id.toString() === localStorage.getItem('user'))

        setIsRegistered(isUserRegisteredToEvent ? true : false)
        setEventSelected(event)
        setShowSidebar(true)
    }

    const getEvent = async () => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL + `/events/${eventSelected && eventSelected.id}`)
            setEventSelected(data)
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.error(error, 'axios error')
            } else {
                console.error(error, 'another error')
            }
        }
    }

    const submitComment = async (comment: string) => {
        try {
            await axios.post(process.env.REACT_APP_API_URL + '/event-guests/comments', {
                event_id: eventSelected && eventSelected.id,
                guest_id: localStorage.getItem('user'),
                comment,
                timestamp: moment().toISOString()
            })
            getEvent()
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.error(error, 'axios error')
            } else {
                console.error(error, 'another error')
            }
        }
    }

    const registerToEvent = async () => {
        try {
            await axios.post(process.env.REACT_APP_API_URL + '/event-guests', {
                event_id: eventSelected && eventSelected.id,
                guest_id: localStorage.getItem('user'),
            })
            getEvent()
            setIsRegistered(true)
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.error(error, 'axios error')
            } else {
                console.error(error, 'another error')
            }
        }
    }

    return (
        <>
        <main>
            <MapContainer
                handleMarkerClick={handleMarkerClicked}
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
                    <button onClick={() => {
                        loginUser()
                    }}>Submit</button>
                </Popup>
            }
            <Sidebar
                showSidebar={showSidebar}
                eventSelected={eventSelected}
                closeSidebar={() => handleCloseSidebar()}
                submitComment={submitComment}
                registerToEvent={registerToEvent}
                isRegistered={isRegistered}
            />
        </main>
        </>
    )
}

export default Home
