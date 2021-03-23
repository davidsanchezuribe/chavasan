import React from 'react';
import {
    Grid,
    Typography,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
    Paper

} from '@material-ui/core';
import { Message as MessageIcon } from '@material-ui/icons';

const ChannelMessages = ({ messages, users }) => {
    const messageList = messages.map(message => {
        const { uid, creator, date, text, readed } = message;
        const { name, email } = users[creator];
        const prettyDate = new Date(date).toLocaleDateString();
        const prettyTime = new Date(date).toLocaleTimeString();
        return (
            <ListItem 
                key={uid} 
            >
                <ListItemAvatar>
                    <MessageIcon />
                </ListItemAvatar>
                <Tooltip title={email}>
                    <ListItemText
                        primary={text}
                        secondary={`enviado por ${name} el ${prettyDate} a las ${prettyTime}`}
                    />
                </Tooltip>
            </ListItem>
        )
    });
    return (
        <Grid item xs={12} md={6}>
            <Paper style={{ margin: 10 }}>
            <Typography variant="h6" >
                Nuevos anuncios
            </Typography>
            <List>
                {messageList}
            </List>
            </Paper>
        </Grid>
    );
}

export default ChannelMessages;