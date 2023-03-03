import { UseFormRegisterReturn } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

export type FormTextFieldProps = TextFieldProps & {
  errorText?: string | null
  registerReturn?: UseFormRegisterReturn
}

function FormTextField({ errorText, registerReturn, ...others }: FormTextFieldProps): JSX.Element {
  return (
    <TextField
      fullWidth
      {...others}
      {...(errorText && { error: true, helperText: errorText })}
      {...(registerReturn && { ...registerReturn })}
    />
  );
}

export default FormTextField;
