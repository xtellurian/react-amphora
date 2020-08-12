import styled from 'styled-components'

export const StyledButtonDiv = styled.div`
    padding: 0.5rem;
    border: 1px solid #5aa6c0;
    box-shadow: 0px 0px 0px 2px #5aa6c0;
    border-radius: 5px;
    background-color: ${(props) => props.theme.colors.main};
    color: #fffefd;
    font-weight: bold;
    text-align: center;
    cursor: pointer;
    &:hover {
        background-color: ${(props) => props.theme.colors.highlight};
    }
`
