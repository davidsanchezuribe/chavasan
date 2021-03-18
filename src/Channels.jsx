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
import { Subscriptions as SubscriptionIcon, Delete as DeleteIcon } from '@material-ui/icons';

const Channels = ({ channelList, selected, selectChannel, deleteChannel }) => {
    const channels = channelList.map(channel => {
        const { uid, name, date, erase } = channel;
        const prettyDate = new Date(date).toLocaleDateString();
        return (
            <ListItem 
                key={uid} 
                button
                selected={uid === selected}
                onClick={() => {selectChannel(uid)}}
            >
                <ListItemAvatar>
                    <SubscriptionIcon />
                </ListItemAvatar>
                <ListItemText
                    primary={name}
                    secondary={`creado el ${prettyDate}`}
                />
                { erase &&
                    <ListItemSecondaryAction onClick={() => {deleteChannel(uid)}}>
                        <IconButton edge="end" aria-label="delete">
                            <DeleteIcon />
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
                    Canales a los que pertenece
                </Typography>
                <List>
                    {channels}
                </List>
                </Paper>
            </Grid>
    );
}

export default Channels;