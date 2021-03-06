import React from 'react';
import env from './env';
import {
    Grid,
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    Button,
    CircularProgress,
    Paper
} from '@material-ui/core';

class CreateChannel extends React.Component {
    constructor() {
        super();
        this.state = { channelName: '', loading: false };
        this.createChannel = this.createChannel.bind(this);
    }

    createChannel() {
        this.setState({ loading: true });
        const { channelName } = this.state;

        if (channelName === '') {
            alert('Debe especificar un nombre');
            this.setState({ loading: false });
            return;
        }
        const { backendURL, backendPort, prefix } = env;
        const { user, refresh, toast } = this.props;
        const body = JSON.stringify({ name: channelName, owner: user });
        fetch(`${prefix}://${backendURL}:${backendPort}/queue/create`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
        }).then((response) => {
            if (response.ok) {
                this.setState({ loading: false });
                this.setState({ channelName: '' })
                refresh();
            } else {
                toast('El nombre de la temática ya está tomado');
                this.setState({loading: false});
            }
        }).catch((err) => {
            toast(`Failed to add issue: ${err}`); // eslint-disable-line no-alert
            this.setState({loading: false});
        });
    }
    render() {
        const { channelName, loading } = this.state;
        return (
            <Grid item xs={12} md={4}>
                <Paper style={{ margin: 10 }}>
                    <Typography variant="h6" >
                        Crear una temática
                </Typography>
                    <FormControl fullWidth variant="outlined" style={{ marginTop: 10 }}>
                        <InputLabel htmlFor="channel-name">Nombre de la temática</InputLabel>
                        <OutlinedInput
                            id="channel-name"
                            value={channelName}
                            label={'Nombre del Canal'}
                            onChange={(e) => { this.setState({ channelName: e.target.value }) }}
                        />
                    </FormControl>
                    <Grid container justify="center">
                        <Button
                            style={{ margin: 10 }}
                            variant="contained"
                            color="default"
                            onClick={() => this.setState({ channelName: '' })}
                        >
                            Limpiar
                </Button>
                        <Button
                            style={{ margin: 10 }}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            onClick={() => this.createChannel()}

                        >
                            Crear
                </Button>
                    </Grid>
                    {loading && (
                        <CircularProgress
                            size={48}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                marginTop: -12,
                                marginLeft: -12,
                            }}
                        />
                    )}
                </Paper>
            </Grid>
        );
    }
}

export default CreateChannel;