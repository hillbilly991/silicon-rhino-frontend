import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { IEvent } from '../../definitions'
import {
    Header,
    MapContainer,
    Popup,
    SelectInput,
    Sidebar,
    Input
} from '../../components'

const timeOptions = [
    {
        id: 1,
        text: '19:00'
    }, {
        id: 2,
        text: '19:30'
    }, {
        id: 3,
        text: '20:00'
    }
]

const drinkTypes = [{
    id: 1,
    text: 'BEERS'
}, {
    id: 2,
    text: 'COCKTAILS'
}, {
    id: 3,
    text: 'COFFEES'
}, {
    id: 4,
    text: 'MILKSHAKES'
}]

function Home() {
    const [events, setEvents] = useState<IEvent[]>([])
    const [user, setUser] = useState<string>('1')
    const [eventSelected, setEventSelected] = useState<IEvent | null >(null)
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(true)
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const [isRegistered, setIsRegistered] = useState<boolean>(false)
    const [showCreateEventPopup, setShowCreateEventPopup] = useState<boolean>(false)
    const [locations, setLocations] = useState<Array<{
        id: string;
        name: string;
    }>>([])
    const [title, setTitle] = useState<string>('')
    const [date, setDate] = useState<string>('')
    const [time, setTime] = useState<string>('1')
    const [location, setLocation] = useState<string>('1')
    const [drinkType, setDrinkType] = useState<string>('1')

    useEffect(() => {
        localStorage.clear()
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

    const getLocations = async () => {
        try {
            const { data } = await axios.get(process.env.REACT_APP_API_URL + '/locations')
            setLocations(data)
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.error(error, 'axios error')
            } else {
                console.error(error, 'another error')
            }
        }
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

    const createEvent = async () => {
        try {
            const type = drinkTypes.find(drinkTypeInArray => drinkTypeInArray.id.toString() === drinkType)
            const { data } = await axios.post(process.env.REACT_APP_API_URL + '/events', {
                creator_id: localStorage.getItem('user'),
                location_id: parseInt(location),
                type: type ? type.text : 'BEERS',
                title: title,
                timestamp: moment(`${date} ${time}`).unix()
            })
            console.log(data)
            setShowCreateEventPopup(false)
        } catch(error) {
            if (axios.isAxiosError(error)) {
                console.error(error, 'axios error')
            } else {
                console.error(error, 'another error')
            }
        }
    }

    const handleCreateEventClicked = () => {
        getLocations()
        setShowCreateEventPopup(true)
    }

    return (
        <>
        <Header
            handleCreateEventClicked={handleCreateEventClicked}
        />

            <MapContainer
                events={events}
                handleMarkerClick={handleMarkerClicked}
            />
            {
                showLoginPopup &&
                <Popup
                    showClose={false}
                >
                    <h1>Welcome</h1>

                    <div className="popup-fields">
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
                    </div>
                    <button onClick={() => {
                        loginUser()
                    }}>Submit</button>
                </Popup>
            }
            {
                showCreateEventPopup &&
                 <Popup
                    showClose={true}
                    hidePopup={() => setShowCreateEventPopup(false)}
                >
                    <h1>Create Event</h1>

                    <div className="popup-fields">
                        <Input
                            value={title}
                            label={'Title'}
                            onChange={setTitle}
                        />
                        <Input
                            value={date}
                            label={'Date'}
                            onChange={setDate}
                            type={'date'}
                        />
                        <SelectInput
                            options={timeOptions}
                            value={time}
                            label="What time do you want to start?"
                            onChange={setTime}
                        />
                        <SelectInput
                            options={locations}
                            value={location}
                            label="Location"
                            onChange={setLocation}
                        />
                        <SelectInput
                            options={drinkTypes}
                            value={drinkType}
                            label="Type"
                            onChange={setDrinkType}
                        />
                    </div>
                    <button onClick={() => {
                        createEvent()
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

        </>
    )
}

export default Home
