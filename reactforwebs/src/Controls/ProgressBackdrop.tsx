import { Backdrop, CircularProgress } from '@mui/material';

export type ProgressBackdropProps = {
  open: boolean
}

export default function ProgressBackdrop({ open }: ProgressBackdropProps): JSX.Element {
  return (
    <Backdrop open={open} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
