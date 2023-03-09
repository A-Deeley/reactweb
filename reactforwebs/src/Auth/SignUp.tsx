import { useState } from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Alert, Box, Button, Link, Grid, Typography } from '@mui/material';
import FormTextField from '../Controls/FormTextField';
import ProgressBackdrop from '../Controls/ProgressBackdrop';
import AccountDataService from '../components/Services/AccountDataService';
import IUserData from '../components/Interfaces/IUserData';

type FormSignUpFields = {
  firstname: string
  lastname: string
  email: string
  username: string
  password: string
  confirmPassword: string
}

export default function SignUp(): JSX.Element {
  //console.log('Load Sign Up Component');

  const navigate: NavigateFunction = useNavigate();
  const [submitWarning, setSubmitWarning] = useState<string>('');
  const [submitError, setSubmitError] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const formSchema = yup.object().shape({
    firstname: yup
      .string()
      .required("Le prénom est obligatoire")
      .max(50, "Le prénom doit contenir au plus 100 caractères"),
    lastname: yup
      .string()
      .required("Le nom de famille est obligatoire")
      .max(50, "Le nom de famille doit contenir au plus 100 caractères"),
    username: yup
      .string()
      .required("Le nom d'utilisateur est obligatoire")
      .max(150, "Le nom d'utilisageur doit contenir au plus 150 caractères"),
    email: yup
      .string()
      .required("Le courriel est obligatoire")
      .email("Le courriel doit être valide")
      .max(100, "Le courriel doit contenir au plus 100 caractères"),
    password: yup
      .string()
      .required("Le mot de passe est obligatoire")
      .max(100, "Le mot de passe ne doit pas dépasser 100 caractères")
      .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
    confirmPassword: yup
      .string()
      .required("La confirmation du mot de passe est obligatoire")
      .oneOf([yup.ref('password')], "Les mots de passe ne correspondent pas"),
  });

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormSignUpFields>({
    resolver: yupResolver(formSchema),
  });

  const handleFormSubmit = (data: FormSignUpFields): void => {
    setSubmitWarning('');
    setSubmitError('');
    setSubmitting(true);

    AccountDataService.register(data.firstname, data.lastname, data.username, data.email, data.password)
      .then((response) => {
        const user: IUserData = response.data;
        console.log('Successful registration', user);
        navigate('/auth/login/');
      })
      .catch((err) => {
        console.log('ERROR: An error occurred during registration', err, err.response)
        if (err.response.status === 400 && err.response.data === 'username_already_exists') {
          setSubmitWarning("Ce nom d'utilisateur est déjà utilisé, veuillez en choisir un autre.");
        }
        else if (err.response.status === 400 && err.response.data === 'email_already_exists') {
          setSubmitWarning("Ce courriel est déjà utilisé, veuillez en choisir un autre.");
        } else {
          setSubmitError("Une erreur s'est produite lors de l'inscription, veuillez réessayer.");
        }
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <>
      <Typography component="h1" variant="h5">
        S'inscrire
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
        sx={{ mt: 1, width: '100%' }}
      >
        <FormTextField
          autoComplete="firstname"
          autoFocus
          errorText={errors.firstname?.message}
          label={"Prénom"}
          margin="normal"
          registerReturn={register('firstname')}
        />
        <FormTextField
          autoComplete="lastname"
          errorText={errors.lastname?.message}
          label={"Nom de famille"}
          margin="normal"
          registerReturn={register('lastname')}
        />
        <FormTextField
          autoComplete="email"
          errorText={errors.email?.message}
          label={"Courriel"}
          margin="normal"
          registerReturn={register('email')}
        />
        <FormTextField
          autoComplete="username"
          errorText={errors.username?.message}
          label={"Nom d'utilisateur"}
          margin="normal"
          registerReturn={register('username')}
        />
        <Box sx={{ color: '#999', fontSize: '11px' }}>
          Lettres, chiffres et @/./+/-/_ uniquement.
        </Box>
        <FormTextField
          autoComplete="new-password"
          errorText={errors.password?.message}
          label={"Mot de passe"}
          margin="normal"
          registerReturn={register('password')}
          type="password"
        />
        <Box sx={{ color: '#999', fontSize: '11px' }}>
          Votre mot de passe doit contenir au moins 8 caractères.
        </Box>
        <FormTextField
          autoComplete="new-password"
          errorText={errors.confirmPassword?.message}
          label={"Confirmation du mot de passe"}
          margin="normal"
          registerReturn={register('confirmPassword')}
          type="password"
        />
        <Box sx={{ color: '#999', fontSize: '11px' }}>
          Entrez le même mot de passe que précédemment pour vérification.
        </Box>
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
        <Button
          color="primary"
          fullWidth
          sx={{ mb: 2, mt: 3 }}
          type="submit"
          variant="contained"
        >
          S'inscrire
        </Button>
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link href="/auth/login/" variant="body2">
              Vous avez déjà un compte? Se connecter
            </Link>
          </Grid>
        </Grid>
      </Box>
      <ProgressBackdrop open={submitting} />
    </>
  );
}
