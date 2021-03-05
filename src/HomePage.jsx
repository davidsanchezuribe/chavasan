import React from 'react';
import { LocalizationContext } from './withLocalization';


const HomePage = () => {
    const messages = React.useContext(LocalizationContext);
    return (
        <h1>{messages.homepage.helloWorld}</h1>
    );
}

export default HomePage;