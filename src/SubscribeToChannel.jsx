import React from 'react';
import env from './env';
import {
    Grid,
    Typography,
    FormControl,
    Select,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    MenuItem,
    Button,
    CircularProgress,
    Paper,
    Box
} from '@material-ui/core';

class SubscribeToChannel extends React.Component {
    constructor() {
        super();
        this.state = { channels: [], selected: '', loading: false };
        this.subscribeToChannel = this.subscribeToChannel.bind(this);
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData(){
        const { backendURL, backendPort, prefix } = env;
        const { user } = this.props;
        const body = JSON.stringify({ user });
        fetch(`${prefix}://${backendURL}:${backendPort}/queue/listavailable`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
        }).then((response) => {
            if (response.ok) {
                response.json().then((channels) => {
                    this.setState({ channels });
                });
            } else {
                response.json().then((error) => {
                    alert(`Failed to add issue: ${error.message}`); // eslint-disable-line no-alert
                    //this.props.showAlert(`Failed to add issue: ${error.message}`);
                });
            }
        }).catch((err) => {
            //this.props.showAlert(`Error in sending data to server: ${err.message}`);
            this.setState({ loading: false });
        });
    }


    subscribeToChannel() {
        const { selected } = this.state;
        const { backendURL, backendPort, prefix } = env;
        const { user, refresh } = this.props;
        const body = JSON.stringify({ uidchannel: selected, uiduser: user });
        fetch(`${prefix}://${backendURL}:${backendPort}/queue/subscribe`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
        }).then((response) => {
            if (response.ok) {
                this.setState({ loading: false });
                this.loadData();
                refresh();
            } else {
                response.json().then((error) => {
                    alert(`Failed to add issue: ${error.message}`); // eslint-disable-line no-alert
                    //this.props.showAlert(`Failed to add issue: ${error.message}`);
                });
            }
        }).catch((err) => {
            //this.props.showAlert(`Error in sending data to server: ${err.message}`);
            this.setState({ loading: false });
        })

    }
    render() {
        const { channels, selected, loading } = this.state;
        const channelOptions = channels.map(channel => {
            const { uid, name } = channel;
            return (
                <MenuItem key={uid} value={uid}>{name}</MenuItem>
            );
        })

        return (
            <Grid item xs={12} md={4}>
            <Paper style={{ margin: 10 }}>
                <Box textAlign='center'>
                    <Button variant="contained" color="primary" onClick={()=>{this.loadData()}}>
                        Obtener las ultimas temáticas disponibles
                    </Button>
                </Box>
                {
                    channels.length > 0 ?
                        <div>
                            <Typography variant="h6" >
                                Subscribirse a una temática
                            </Typography>
                                <FormControl style = {{marginLeft :10}} >
                                    <Select value={selected} onChange={(e) => { this.setState({ selected: e.target.value }) }}>
                                        {channelOptions}
                                    </Select>
                                    <FormHelperText>Seleccione una de las temáticas disponibles</FormHelperText>
                                </FormControl>
                                <Grid container justify="center">
                                    <Button
                                        style={{ margin: 10 }}
                                        variant="contained"
                                        color="primary"
                                        disabled={loading}
                                        onClick={() => this.subscribeToChannel()}

                                    >
                                        Subscribirse
                                </Button>
                                </Grid>
                            </div>
                            :
                            <div>
                                <Typography variant="h6" >
                                    No hay temáticas disponibles para subscribirse
                                </Typography>
                                <Grid container justify="center">
                                    <Button
                                        style={{ margin: 10 }}
                                        color="primary"
                                        variant="contained"
                                        onClick = {() => this.loadData()}
                                    >
                                        Actualizar
                                    </Button>
                                </Grid>
                            </div>
                    }
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

export default SubscribeToChannel;