import React from 'react'
interface NumericInputProps {
    initialValue?: string
    onUpdate: (value: string) => void
}
export class NumericInput extends React.Component<
    NumericInputProps,
    { inputValue: string }
> {
    constructor(props: NumericInputProps) {
        super(props)
        this.state = { inputValue: props.initialValue || '0' }
        this._handleUpdate = this._handleUpdate.bind(this)
        this._reset = this._reset.bind(this)
    }

    _handleUpdate(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.validity.valid) {
            this.setState({ inputValue: e.target.value })
            this.props.onUpdate(e.target.value)
        }
    }

    _reset() {
        this.setState({ inputValue: '' })
    }

    render() {
        return (
            <React.Fragment>
                <input
                    type='number'
                    value={this.state.inputValue}
                    onChange={this._handleUpdate}
                    step='any'
                />
                <button onClick={this._reset}>reset</button>
            </React.Fragment>
        )
    }
}
