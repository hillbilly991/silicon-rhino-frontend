import { FC } from 'react';
import { IInput } from '../../definitions'


const Input:FC<IInput> = ({ onChange, label, value, type }) => {
    return (
        <>
        <div className="form-input">
            <label>{ label }</label>
            <input type={type ? type : 'text'} value={ value } onChange={(e) => onChange(e.target.value) }/>
        </div>
        </>
    )
}

export default Input
