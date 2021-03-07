import React from 'react';
import { LocalizationContext } from './withLocalization';


const HomePage = (props) => {
    const messages = React.useContext(LocalizationContext);
    const { user } = props;
    return (
        <h1>{user}</h1>
    );
}

export default HomePage;