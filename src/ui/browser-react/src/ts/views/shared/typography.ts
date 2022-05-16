import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const BackdropTypography = styled(Typography)(({theme}) => ({
  color: theme.palette.primary.contrastText,
}));