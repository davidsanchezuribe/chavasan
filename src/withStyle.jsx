import React from 'react';

import { CssBaseline, Container, ThemeProvider } from '@material-ui/core';
import 'material-icons/css/material-icons.css';
import theme from './materialui/theme';

const withStyle = (BaseApp) => {
    return class extends React.Component {
        render() {
            const { ...props } = this.props;
            return (
                <ThemeProvider theme={theme}>
                    <Container fixed>
                        <CssBaseline />
                        <BaseApp {...props} />
                    </Container>
                </ThemeProvider>
            );
        }
    }
}

export default withStyle;
