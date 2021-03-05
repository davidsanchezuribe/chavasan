import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  TextField, AppBar, Toolbar, Snackbar,
  IconButton, Typography, Link, Hidden,
  Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Home as CloseIcon, Search as SearchIcon, ExitToApp as ExitToAppIcon } from '@material-ui/icons';
//import CloseIcon from '@material-ui/icons/Home';
//import SearchIcon from '@material-ui/icons/Search';
//import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { navigate } from '@reach/router';

import whiteLogoImg from '../images/logoChavasanBlanco.png';
import { signOut } from './firebase';

const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  button: {
    margin: theme.spacing(1),
  },
  input: {
    background: 'white',
    'margin-right': theme.spacing(2),
  },
  logo: {
    marginTop: 5,
    maxWidth: 100,
    marginRight: 20,
  },
}));

export default function NavBar(props) {
  const { showToast, message, closeToast } = props;
  const classes = useStyles();
  const [id, setId] = useState('');

  const searchCustomer = () => {
    navigate(`customer/${id}`);
  };

  const exitApp = () => {
    signOut();
    navigate('');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" onClick={() => navigate('')}>
          <img src={whiteLogoImg} alt="logo" className={classes.logo} />
        </Button>
      <Typography
        variant="h6"
        className={classes.title}
        align="center"
      >
        Servicio de mensajería
        </Typography>
      <IconButton
          color="inherit"
          className={classes.button}
          size="small"
          onClick={exitApp}
        >
          <ExitToAppIcon fontSize="inherit" />
        </IconButton>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={showToast}
        autoHideDuration={4000}
        onClose={closeToast}
        message={message}
        action={(
          <>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={closeToast}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        )}
      />
      </Toolbar>
    </AppBar >
  );
}

NavBar.propTypes = {
  showToast: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  closeToast: PropTypes.func.isRequired,
};
