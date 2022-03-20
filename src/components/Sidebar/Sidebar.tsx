import { useState } from 'react'
import { IEvent } from '../../definitions'
import { Input } from '../index';
import moment from 'moment'

const Sidebar = ({
    eventSelected,
    showSidebar,
    closeSidebar,
    submitComment,
    registerToEvent,
    isRegistered
}: {
    eventSelected?: IEvent | null,
    showSidebar: boolean,
    closeSidebar: () => void,
    submitComment: (comment: string) => void,
    registerToEvent: () => void,
    isRegistered: boolean
}) => {
    const [comment, setComment] = useState<string>('')

    const prepareCloseSidebar = () => {
        setComment('')
        closeSidebar()
    }
    const returnImage = (type: IEvent['type']) => {
         switch(type) {
            case 'BEERS':
                return '/beer-icon-background.png'
                // eslint-disable-next-line no-unreachable
                break;
            case 'COCKTAILS':
                return '/cocktail-icon-background.png'
                // eslint-disable-next-line no-unreachable
                break;
            case 'COFFEES':
                return '/coffee-icon-background.png'
                // eslint-disable-next-line no-unreachable
                break;
            case 'MILKSHAKES':
                return '/milkshake-icon-background.png'
                // eslint-disable-next-line no-unreachable
                break;
        }
    }
    return (
        <div className={'sidebar-container' + ( showSidebar ? ' open' : ' closed')}>
            <div id="close-sidebar" onClick={() => prepareCloseSidebar()}></div>
            {
                eventSelected &&
                <>
                    <img src={returnImage(eventSelected.type)} alt={`${eventSelected.type.toLowerCase()}-background`} />
                    <div className="sidebar-content">
                        <h1>{eventSelected.title}</h1>
                        <div className="time-and-organiser">
                            <p>{
                                eventSelected.type.charAt(0).toUpperCase() +
                                eventSelected.type.slice(1).toLowerCase()
                            } at {
                                eventSelected.location.name
                            }</p>
                            <p>Organised by {eventSelected.creator.name}</p>
                            <p>Registered guests: {eventSelected.guests.length}</p>
                        </div>
                        <div className="comments">
                            {
                                eventSelected.comments &&
                                eventSelected.comments.map(comment => (
                                    <>
                                        <div className="comment">
                                            <div className="time-and-user">
                                                { comment.user.name } at { moment(comment.timestamp).format('hh:mm A') } on { moment(comment.timestamp).format("DD MMM YYYY") }
                                            </div>
                                            <div className="message">
                                                { comment.message }
                                            </div>
                                        </div>
                                    </>
                                ))
                            }
                        </div>
                        <div className="sidebar-footer">
                            {
                                isRegistered ?
                                <>
                                    <Input
                                        value={comment}
                                        onChange={setComment}
                                        label={'Leave a comment'}
                                    />
                                    <button className="submit-comment" onClick={(e) => {
                                        e.preventDefault()
                                        if(comment)
                                            submitComment(comment)
                                    }}>
                                        Add comment
                                    </button>
                                </>
                                :
                                <button onClick={(e) => {
                                    e.preventDefault();
                                    registerToEvent()
                                }}>
                                    Register
                                </button>
                            }
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Sidebar
