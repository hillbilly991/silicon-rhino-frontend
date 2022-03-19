import { FC } from 'react';
import { ITextInput } from '../../definitions'


const TextInput:FC<ITextInput> = ({ onChange, label, value }) => {
    return (
        <>
        <div className="form-input">
            <label>{ label }</label>
            <input value={ value } onChange={(e) => onChange(e.target.value) }/>
        </div>
        </>
    )
}

export default TextInput
