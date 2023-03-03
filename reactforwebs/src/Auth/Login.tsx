import React, { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';

import FormTextField from '../Controls/FormTextField';
import AccountDataService from '../components/Services/AccountDataService';

type FormLoginFields = {
  username: string
  password: string
};

export default function Login(): JSX.Element {
  //console.log('Load Login Component');

  const navigate: NavigateFunction = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitWarning, setSubmitWarning] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');

  const formSchema = yup.object().shape({
    username: yup
      .string()
      .required("Le nom d'utilisateur est obligatoire"),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire"),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormLoginFields>({
    resolver: yupResolver(formSchema),
  });

  const handleShowPasswordClick = (): void => {
    setShowPassword(!showPassword);
  }

  const handleShowPasswordMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }

  const handleFormSubmit = (data: FormLoginFields): void => {
    setSubmitWarning('');
    setSubmitError('');

    AccountDataService.login(data.username, data.password)
      .then(() => {
        navigate('/');
      })
      .catch((err) => {
        console.log('ERROR: An error occurred during sign in', err, err.response);
        if (err.response.status === 401 && err.response.data === 'no_active_account') {
          setSubmitWarning("Aucun compte actif n'a été trouvé avec les identifiants fournis");
        }
        else {
          setSubmitError("Une erreur s'est produite lors de la connexion, veuillez réessayer.");
        }
      });
  }

  return (
    <>
      <Typography component="h1" variant="h5">
        S'identifier
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ mt: 1, width: '100%' }}
      >
        <FormTextField
          autoComplete="username"
          autoFocus
          errorText={errors.username?.message}
          label={"Nom d'utilisateur"}
          margin="normal"
          registerReturn={register('username')}
        />
        <FormTextField
          autoComplete="current-password"
          errorText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => handleShowPasswordClick()}
                  onMouseDown={handleShowPasswordMouseDown}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          label={"Mot de passe"}
          margin="normal"
          registerReturn={register('password')}
          type={showPassword ? 'text' : 'password'}
        />
        {submitWarning !== '' && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            {submitWarning}
          </Alert>
        )}
        {submitError !== '' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {submitError}
          </Alert>
        )}
        <Button color="primary" fullWidth sx={{ mb: 2, mt: 3 }} type="submit" variant="contained">
          Se connecter
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/auth/signup/" variant="body2">
              Vous n'avez pas de compte? S'inscrire
            </Link>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
