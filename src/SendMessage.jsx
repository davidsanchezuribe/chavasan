import React, { useState } from 'react';
import {
    Grid,
    Paper,
    FormControl,
    InputLabel,
    OutlinedInput,
    IconButton
} from '@material-ui/core';
import { Send as SendIcon } from '@material-ui/icons';
const SendMessage = ({sendMessage2Server, sending}) => {
    const [message, setMessage] = useState('');
    return (
        <Grid item xs={12} md={8}>
            <Paper style={{ margin: 10 }}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel htmlFor="send-message">Enviar un mensaje</InputLabel>
                    <OutlinedInput
                        id="send-message"
                        value={message}
                        label={'Enviar un mensaje'}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </FormControl>
                <IconButton onClick={()=>{sendMessage2Server(message)}}>
                    <SendIcon />
                </IconButton>
            </Paper>
        </Grid>
    );
}
export default SendMessage