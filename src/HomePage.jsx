import React from 'react';
import { LocalizationContext } from './withLocalization';
import env from './env';
import Channels from './Channels';
import ChannelMessages from './ChannelMessages';
import CreateChannel from './CreateChannel';
import SendMessage from './SendMessage';
import { Grid } from '@material-ui/core';

class HomePage extends React.Component {
    constructor() {
        super();
        this.state = { channelList: [], channelMessages: {}, channelUsers: {}, selected: null, sending: false };
        this.loadData = this.loadData.bind(this);
        this.setData = this.setData.bind(this);
        this.selectChannel = this.selectChannel.bind(this);
        this.deleteChannel = this.deleteChannel.bind(this);
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

    sendMessage2Server(message){
        this.setState({sending: true});
        const { backendURL, backendPort } = env;

        const { user } = this.props;
        const { selected } = this.state;
        const body = JSON.stringify({ channeluid: selected, memberuid: user, content: message });
        console.log(body);

        fetch(`http://${backendURL}:${backendPort}/queue/sendmessage`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body,
        }).then((response) => {
            if (response.ok) {
                this.loadData();
                this.setState({sending: false});
            } else {
                response.json().then((error) => {
                    alert(`Failed to add issue: ${error.message}`); // eslint-disable-line no-alert
                    //this.props.showAlert(`Failed to add issue: ${error.message}`);
                });
                this.setState({sending: false});
            }
        }).catch((err) => {
            //this.props.showAlert(`Error in sending data to server: ${err.message}`);
        });


    }

    render() {
        const { user } = this.props;
        const { channelList, selected, channelMessages, channelUsers, sending } = this.state;
        const messages = selected ? channelMessages[selected] : [];
        const users = selected ? channelUsers[selected] : {};
        return (
            <Grid item container>
                <Channels
                    channelList={channelList}
                    selected={selected}
                    selectChannel={this.selectChannel}
                    deleteChannel={this.deleteChannel}
                />
                { selected !== null &&
                    <ChannelMessages
                        messages={messages}
                        users={users}
                    />
                }
                <CreateChannel user={user} refresh={this.loadData} />
                { selected !== null &&
                    <SendMessage sendMessage2Server={this.sendMessage2Server} sending={sending}/>
                }
            </Grid>
        );
    }
}

export default HomePage;