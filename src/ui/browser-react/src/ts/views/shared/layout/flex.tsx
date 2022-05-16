import { styled } from '@mui/material/styles';

export const CenteredVerticalFlexGrid = styled('div')(() => ({
  backgroundColor: 'transparent',
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const CenteredHorizontalFlexGrid = styled('div')(() => ({
  backgroundColor: 'transparent',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
}));