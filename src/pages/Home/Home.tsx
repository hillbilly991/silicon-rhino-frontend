import { useState, useEffect } from 'react'
import axios from 'axios'
import moment from 'moment'
import { IEvent, IUser } from '../../definitions'
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
        text: '19:00',
        hour: 19,
        minute: 0
    }, {
        id: 2,
        text: '19:30',
        hour: 19,
        minute: 30
    }, {
        id: 3,
        text: '20:00',
        hour: 20,
        minute: 0
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
    const [users, setUsers] = useState<Array<{
        id: string | number,
        name: string
    }>>([])
    const [user, setUser] = useState<string>('1')
    const [eventSelected, setEventSelected] = useState<IEvent | null >(null)
    const [showLoginPopup, setShowLoginPopup] = useState<boolean>(true)
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const [isRegistered, setIsRegistered] = useState<boolean>(false)
    const [showCreateEventPopup, setShowCreateEventPopup] = useState<boolean>(false)
    const [locations, setLocations] = useState<Array<{
        id: string | number;
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
                const { data } = await axios.get(process.env.REACT_APP_API_URL + '/api/events')
                const events: Array<IEvent> = data;
                console.log(events, 'events')
                setEvents(events)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error, 'axios error')
                } else {
                    console.error(error, 'another error')
                }
            }
        }
        async function fetchUsers() {
            try {
                const { data } = await axios.get(process.env.REACT_APP_API_URL + '/api/users')
                const users:Array<{
                    id: number,
                    name: string
                }> = data
                setUsers(users)
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error(error.message, 'axios error')
                } else {
                    console.error(error, 'another error')
                }
            }
        }

        fetchUsers()
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
            const { data } = await axios.get(process.env.REACT_APP_API_URL + '/api/locations')
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
            const { data } = await axios.get(process.env.REACT_APP_API_URL + `/api/events/${eventSelected && eventSelected.id}`)
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
            await axios.post(process.env.REACT_APP_API_URL + '/api/event/comments', {
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
            await axios.post(process.env.REACT_APP_API_URL + '/api/event/register', {
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
            const timeOptionSelected:any = timeOptions.find(timeOption => timeOption.id === parseInt(time))
            const year = new Date(date).getFullYear()
            const month =  new Date(date).getMonth()
            const day =  new Date(date).getDate()
            const timeStamp = moment({ year: year, month :month, day :day, hour: timeOptionSelected &&timeOptionSelected.hour, minute: timeOptionSelected && timeOptionSelected.minute}).format("YYYY-MM-DD HH:mm:ss")
            console.log(localStorage.getItem('user'), 'user id')
            await axios.post(process.env.REACT_APP_API_URL + '/api/events', {
                creator_id: localStorage.getItem('user'),
                location_id: parseInt(location),
                type: type ? type.text : 'BEERS',
                title: title,
                time: timeStamp
            })
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
                            options={users}
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
