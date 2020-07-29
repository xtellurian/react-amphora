import React, { useState } from 'react'
import { SignInButton, SignOutButton } from 'react-amphora'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavLink,
    NavItem,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    NavbarText
} from 'reactstrap'
import { NavLink as RRNavLink } from 'react-router-dom'

const components = [
    { name: 'Sign In Button', path: 'signin-button' },
    { name: 'Signals Chart', path: 'signals-chart' }
]

const examples = [
    { name: 'Search Bar', path: 'search' },
    { name: 'My Amphora', path: 'my-amphora' },
    { name: 'Create an Amphora', path: 'create-amphora' },
    { name: 'List Terms of Use', path: 'list-terms' },
    { name: 'Display Metadata', path: 'display-metadata' }
]

export const Menu: React.FunctionComponent = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggle = () => setIsOpen(!isOpen)

    return (
        <div>
            <Navbar color='light' light expand='md'>
                <NavbarBrand href='/'>React Amphora</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className='mr-auto' navbar>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Components
                            </DropdownToggle>
                            <DropdownMenu right>
                                {components.map((c) => (
                                    <DropdownItem key={c.path}>
                                        <NavLink
                                            to={`/components/${c.path}`}
                                            tag={RRNavLink}
                                        >
                                            {c.name}
                                        </NavLink>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                Examples
                            </DropdownToggle>
                            <DropdownMenu right>
                                {examples.map((c) => (
                                    <DropdownItem key={c.path}>
                                        <NavLink
                                            to={`/examples/${c.path}`}
                                            tag={RRNavLink}
                                        >
                                            {c.name}
                                        </NavLink>
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem>
                            <NavLink href='https://github.com/xtellurian/react-amphora'>
                                GitHub
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <NavbarText>React Components for Amphora Glaze</NavbarText>
                    <div className='ml-2'>
                        <SignInButton />
                        <SignOutButton />
                    </div>
                </Collapse>
            </Navbar>
        </div>
    )
}
