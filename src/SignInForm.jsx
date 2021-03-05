import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import {
  Button, Grid, Paper, Box, Typography, CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import { InputTextFMUI } from './FormikMaterialUI.jsx';
import { signInUtil } from './firebase';

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: '30px',
    paddingRight: '40px',
    paddingTop: '20px',
    paddingLeft: '40px',
    paddingBottom: '20px',
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function SignInForm(props) {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const { toast } = props;
  const [loadingComponent, setLoadingComponent] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoadingComponent(false), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  if (loadingComponent) {
    return (null);
  }
  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={Yup.object({
        email: Yup.string().trim().required('campo requerido')
          .email('el campo debe ser un email valido'),
        password: Yup.string().required('campo requerido'),
      })}
      onSubmit={(values) => {
        setLoading(true);
        const { email, password } = values;
        signInUtil(email, password)
          .catch((err) => {
            toast(err.message);
            setLoading(false);
          });
      }}
    >
      <Form>
        <Grid
          container
          justify="center"
        >
          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Paper className={classes.form} elevation={4}>
              <Box mb={2}>
                <Typography mb={2} variant="h5" align="center">
                  Ingresar
                </Typography>
              </Box>
              <Box mb={2}>
                <InputTextFMUI
                  name="email"
                  labelFMUI="email"
                />
              </Box>
              <Box mb={2}>
                <InputTextFMUI
                  name="password"
                  labelFMUI="contraseña"
                  type="password"
                />
              </Box>
              <Grid container justify="center">
                <Button
                  className={classes.button}
                  variant="contained"
                  color="default"
                  type="reset"
                >
                  Limpiar
                </Button>
                <Button
                  className={classes.button}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                >
                  Siguiente
                </Button>
              </Grid>
            </Paper>
          </Grid>
          {loading && (
          <CircularProgress
            size={48}
            className={classes.buttonProgress}
          />
          )}
        </Grid>
      </Form>
    </Formik>
  );
}

SignInForm.propTypes = {
  toast: PropTypes.func.isRequired,
};
