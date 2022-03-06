import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

// https://mui.com/customization/theming/
declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      mode: string;
    };
    status: {
      danger: string;
    };
  }
  
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
  status: {
    danger: orange[500],
  },
});

export const withTheme = (component: JSX.Element): JSX.Element => {
  return (
      <ThemeProvider theme={theme}>{component}</ThemeProvider>
  )
}