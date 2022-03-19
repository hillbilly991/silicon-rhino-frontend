import React from 'react'

const Popup = (props:any) => {
    return (
        <div className="popup-wrapper">
            <div className="popup-container">
                {
                    props.showClose &&
                    <div id="close-popup" onClick={() => props.hidePopup()}></div>
                }
                { props.children }
            </div>
        </div>
    )
}

export default Popup
