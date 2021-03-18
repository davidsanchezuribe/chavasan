import React from 'react';
import env from './env';
import {
    Grid,
    Typography,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Tooltip,
    ListItemText,
    ListItemSecondaryAction,
    OutlinedInput,
    Button,
    CircularProgress,
    Paper
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Add as AddIcon, AccountCircleOutlined as UserIcon, Delete as DeleteIcon } from '@material-ui/icons';



class CreateChannel extends React.Component {
    constructor() {
        super();
        this.state = { users: [], members: [], selected: '', channelName: '', loading: false };
        this.loadData = this.loadData.bind(this);
        this.getAvailable = this.getAvailable.bind(this);
        this.addMember = this.addMember.bind(this);
        this.deleteMember = this.deleteMember.bind(this);
        this.createChannel = this.createChannel.bind(this);
    }
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        const { backendURL, backendPort } = env;
        fetch(`http://${backendURL}:${backendPort}/user/list`, {
            method: 'POST'
        }).then((response) => {
            if (response.ok) {
                response.json().then((users) => {
                    this.setState({ users });
                });
            } else {
                response.json().then((error) => {
                    alert(`Failed to add issue: ${error.message}`); // eslint-disable-line no-alert
                    //this.props.showAlert(`Failed to add issue: ${error.message}`);
                });
            }
        }).catch((err) => {
            //this.props.showAlert(`Error in sending data to server: ${err.message}`);
        });
    }
    getAvailable() {
        const { user } = this.props;
        const { users, members } = this.state;
        const available = [...users].filter(userb => {
            const { uid } = userb;
            if (uid === user) {
                return false;
            }
            if (members.includes(userb)) {
                return false;
            }
            return true;
        });
        available.unshift({ uid: '', name: '---', email: '---' })
        return available;
    }
    addMember() {
        const { selected, members, users } = this.state;
        const newMembers = [...members];
        newMembers.push([...users].filter(user => user.uid === selected)[0]);
        this.setState({ members: newMembers, selected: '' });
    }
    deleteMember(uid) {
        const { members } = this.state;
        const newMembers = [...members].filter(member => member.uid !== uid);
        this.setState({ members: newMembers });
    }
    createChannel(){
        this.setState({loading: true});
        const { members, channelName} = this.state;
        if(members.length < 1){
            alert('no puede tener 0 usuarios');
            this.setState({loading: false});
            return;
        }
        if(channelName === ''){
            alert('Debe especificar un nombre');
            this.setState({loading: false});
            return;
        }
        const { backendURL, backendPort } = env;
        const { user, refresh } = this.props;
        const newMembers = members.map(member => member.uid);
        const body = JSON.stringify({ name: channelName, owner: user, members: newMembers });
        fetch(`http://${backendURL}:${backendPort}/queue/create`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
        }).then((response) => {
            if (response.ok) {
                this.setState({loading: false});
                refresh();
            } else {
                response.json().then((error) => {
                    alert(`Failed to add issue: ${error.message}`); // eslint-disable-line no-alert
                    //this.props.showAlert(`Failed to add issue: ${error.message}`);
                });
            }
        }).catch((err) => {
            //this.props.showAlert(`Error in sending data to server: ${err.message}`);
        });


        //validar que haya agregado usuarios
        
    }
    render() {
        const available = this.getAvailable();
        const { members, selected, channelName, loading } = this.state;
        const memberOptions = available.map(member => {
            const { uid, name } = member;
            return (
                <MenuItem key={uid} value={uid}>{name}</MenuItem>
            );
        })
        const memberList = members.map(member => {
            const { uid, name, email } = member;
            return (
                <ListItem
                    key={uid}
                >
                    <ListItemAvatar>
                        <UserIcon />
                    </ListItemAvatar>
                    <Tooltip title={email}>
                        <ListItemText
                            primary={name}
                        />
                    </Tooltip>
                    <ListItemSecondaryAction onClick={() => { this.deleteMember(uid) }}>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )
        });
        return (

            <Grid item xs={12} md={4}>
            <Paper style={{ margin: 10 }}>
                <Typography variant="h6" >
                    Crear un canal
                </Typography>
                <div>
                    <FormControl>
                        <InputLabel>Usuario</InputLabel>
                        <Select value={selected} onChange={(e) => { this.setState({ selected: e.target.value }) }}>
                            {memberOptions}
                        </Select>
                        <FormHelperText>Seleccione un Usuario</FormHelperText>
                    </FormControl>
                    <IconButton color="primary" disabled={selected === ''} onClick={() => this.addMember()}>
                        <AddIcon />
                    </IconButton>
                </div>
                <Typography variant="h6" >
                    Miembros
                </Typography>
                <List>
                    {memberList}
                </List>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="channel-name">Nombre del Canal</InputLabel>
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
                        onClick={() => this.setState({members: [], selected: '', channelName: ''})}
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
                        Crear Canal
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