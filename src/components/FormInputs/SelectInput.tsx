import { FC } from 'react';
import { ISelectInput } from '../../definitions'


const SelectInput:FC<ISelectInput> = ({ onChange, label, value, options }) => {
    return (
        <>
        <div className="form-input">
            <label>{ label }</label>
            <select value={value} onChange={(e) => onChange(e.target.value)}>
                {
                    options.map((option: {
                        id: number;
                        name: string;
                    }) => (
                        <option value={option.id}>{option.name}</option>
                    ))
                }
            </select>
        </div>
        </>
    )
}

export default SelectInput
