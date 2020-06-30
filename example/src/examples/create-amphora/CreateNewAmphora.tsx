import * as React from 'react'
import { AmphoraOperationsContext } from 'react-amphora'
import { CreateAmphora } from 'amphoradata'

type CreateNewAmphoraProps = AmphoraOperationsContext.AmphoraOperationsDispatch &
    AmphoraOperationsContext.AmphoraOperationState

class CreateNewAmphora extends React.PureComponent<
    CreateNewAmphoraProps,
    { model: CreateAmphora }
> {
    /**
     *
     */
    constructor(props: CreateNewAmphoraProps) {
        super(props)
        this.state = {
            model: {
                name: '',
                description: '',
                price: 0
            }
        }
    }
    private doCreate() {
        this.props.dispatch({
            type: 'amphora-operation-create',
            payload: {
                model: this.state.model
            }
        })
    }

    private setName(name: string) {
        const model = { ...this.state.model }
        model.name = name
        this.setState({ model })
    }

    private setPrice(price?: string) {
        if (!price) {
            price = '0'
        }
        const model = { ...this.state.model }
        model.price = Number.parseFloat(price)
        this.setState({ model })
    }

    private setDescription(description: string) {
        const model = { ...this.state.model }
        model.description = description
        this.setState({ model })
    }

    private renderCurrent(): JSX.Element | undefined {
        if (this.props.current) {
            return (
                <div>
                    <div>Name: {this.props.current.name}</div>
                    <div>Description: {this.props.current.description}</div>
                    <div>Price: {this.props.current.price}</div>

                    <a href={`https://app.amphoradata.com/amphorae/detail?id=${this.props.current.id}`}>View on Amphora Data</a>
                </div>
            )
        } else {
            return
        }
    }

    private renderFields() {
        return (
            <React.Fragment>
                <div>
                    <div>
                        <label>Name</label>
                    </div>
                    <input
                        value={this.state.model.name}
                        onChange={(e) => this.setName(e.target.value)}
                    ></input>
                </div>
                <div>
                    <div>
                        <label>Description</label>
                    </div>
                    <textarea
                        value={this.state.model.description}
                        onChange={(e) => this.setDescription(e.target.value)}
                    ></textarea>
                </div>
                <div>
                    <div>
                        <label>Price</label>
                    </div>
                    <input
                        type='number'
                        pattern='[0-9.]*'
                        value={this.state.model.price}
                        onChange={(e) => this.setPrice(e.target.value)}
                    ></input>
                </div>
            </React.Fragment>
        )
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <div>
                        {this.props.isLoading ? 'Loading...' : this.renderFields()}
                    </div>

                    <button onClick={() => this.doCreate()}>Create</button>
                </div>

                {this.renderCurrent()}
            </React.Fragment>
        )
    }
}

export default AmphoraOperationsContext.withAmphoraOperations(CreateNewAmphora)
