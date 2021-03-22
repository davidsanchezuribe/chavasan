import React from 'react';
import { LocalizationContext } from './withLocalization';
import env from './env';
import Channels from './Channels';
import ChannelMessages from './ChannelMessages';
import CreateChannel from './CreateChannel';
import SendMessage from './SendMessage';
import SubscribeToChannel from './SubscribeToChannel';
import { Grid, Button, Box } from '@material-ui/core';

class HomePage extends React.Component {
    constructor() {
        super();
        this.state = { channelList: [], channelMessages: {}, channelUsers: {}, selected: null, sending: false };
        this.loadData = this.loadData.bind(this);
        this.setData = this.setData.bind(this);
        this.selectChannel = this.selectChannel.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
        this.unsubscribeFromChannel = this.unsubscribeFromChannel.bind(this);
        this.sendMessage2Server = this.sendMessage2Server.bind(this);
    }
    componentDidMount() {
        this.loadData();
    }
    loadData() {
        const { user } = this.props;
        const { backendURL, backendPort } = env;
        fetch(`http://${backendURL}:${backendPort}/queue/list`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ member: user }),
        }).then((response) => {
            if (response.ok) {
                response.json().then((channels) => {
                    this.setData(channels);
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
    setData(channels) {
        const { user } = this.props;
        const { selected } = this.state;
        let selectedExist = false;
        const channelList = channels.map(channel => {
            const { uid, name, date, owner } = channel;
            selectedExist = uid === selected ? true : selectedExist;
            return ({ uid, name, date, erase: owner === user });
        });
        const channelUsers = channels.reduce((acumChannels, channel) => {
            const { uid, users } = channel;
            acumChannels[uid] = users.reduce((acumUsers, member) => {
                const { email, name, uid } = member;
                acumUsers[uid] = { email, name };
                return acumUsers;
            }, {});
            return acumChannels;
        }, {});

        const channelMessages = channels.reduce((acum, channel) => {
            const { uid, messages } = channel;
            acum[uid] = messages;
            return acum;
        }, {});
        this.setState({ channelList, channelMessages, channelUsers, selected: selectedExist ? selected : null });
    }
    selectChannel(selected) {
        /// MARK AS READED
        this.setState({ selected })
    }
    deleteChannel(uid) {
        const { user } = this.props;
        const { backendURL, backendPort } = env;
        fetch(`http://${backendURL}:${backendPort}/queue/delete`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ uid, owner: user }),
        }).then((response) => {
            if (response.ok) {
                this.loadData();
                console.log(response);
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
    unsubscribeFromChannel(uid){
        const { user } = this.props;
        const { backendURL, backendPort } = env;
        fetch(`http://${backendURL}:${backendPort}/queue/unsubscribe`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ uidchannel: uid, uiduser: user }),
        }).then((response) => {
            if (response.ok) {
                this.loadData();
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
    // SEBAS
    sendMessage2Server(message) {
        this.setState({ sending: true });
        const { backendURL, backendPort, prefix } = env;
        const { user } = this.props;
        // Encriptar el mensaje aquí usando el usuario como llave
        const { selected } = this.state;
        const body = JSON.stringify({ channeluid: selected, memberuid: user, content: message });

        fetch(`${prefix}://${backendURL}:${backendPort}/queue/sendmessage`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
        }).then((response) => {
            if (response.ok) {
                this.loadData();
                this.setState({ sending: false });
            } else {
                response.json().then((error) => {
                    alert(`Failed to add issue: ${error.message}`); // eslint-disable-line no-alert
                    //this.props.showAlert(`Failed to add issue: ${error.message}`);
                });
                this.setState({ sending: false });
            }
        }).catch((err) => {
            //this.props.showAlert(`Error in sending data to server: ${err.message}`);
        });


    }

    render() {
        const { user, toast } = this.props;
        const { channelList, selected, channelMessages, channelUsers, sending } = this.state;
        const messages = selected ? channelMessages[selected] : [];
        const users = selected ? channelUsers[selected] : {};
        return (
            <Grid item container>
                <Grid style={{ margin: 10 }} item xs={12} md={12}>
                    <Box textAlign='center'>
                        <Button variant="contained" color="primary" onClick={()=>{this.loadData()}}>
                            Obtener nuevos mensajes
                        </Button>
                    </Box>
                </Grid>
                <Channels
                    channelList={channelList}
                    selected={selected}
                    selectChannel={this.selectChannel}
                    deleteChannel={this.deleteChannel}
                    unsubscribeFromChannel={this.unsubscribeFromChannel}
                />
                <CreateChannel user={user} refresh={this.loadData} toast={toast} />
                <SubscribeToChannel user={user} refresh={this.loadData} />
                { selected !== null &&
                    <React.Fragment>
                        <ChannelMessages
                            messages={messages}
                            users={users}
                        />
                        <SendMessage sendMessage2Server={this.sendMessage2Server} sending={sending} />
                    </React.Fragment>
                }
            </Grid>
        );
    }
}

export default HomePage;