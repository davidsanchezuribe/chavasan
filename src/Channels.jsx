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
    Paper
} from '@material-ui/core';
import { Subscriptions as SubscriptionIcon, Delete as DeleteIcon, Unsubscribe as UnsubscribeIcon } from '@material-ui/icons';

const Channels = ({ channelList, selected, selectChannel, deleteChannel, unsubscribeFromChannel }) => {
    const channels = channelList.map(channel => {
        const { uid, name, date, erase } = channel;
        const prettyDate = new Date(date).toLocaleDateString();
        return (
            <ListItem
                key={uid}
                button
                selected={uid === selected}
                onClick={() => { selectChannel(uid) }}
            >
                <ListItemAvatar>
                    <SubscriptionIcon />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={`creado el ${prettyDate}`}
                />
                { erase ?
                    <ListItemSecondaryAction onClick={() => { deleteChannel(uid) }}>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                    :
                    <ListItemSecondaryAction onClick={() => { unsubscribeFromChannel(uid) }}>
                        <IconButton edge="end" aria-label="delete">
                            <UnsubscribeIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                }
            </ListItem>
        )
    })
    return (

        <Grid item xs={12} md={4}>
            <Paper style={{ margin: 10 }}>
                <Typography variant="h6" >
                    Temáticas a las que pertenece
                </Typography>
                <List>
                    {channels}
                </List>
            </Paper>
        </Grid>
    );
}

export default Channels;