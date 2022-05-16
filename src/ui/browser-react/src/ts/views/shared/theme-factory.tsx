import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange, purple, blue } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';
import themes from 'devextreme/ui/themes';
export type { Theme };

// https://js.devexpress.com/Documentation/Guide/Themes_and_Styles/Predefined_Themes/#Switch_Between_Themes_at_Runtime
themes.current('generic.dark');

// https://mui.com/customization/theming/
declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      mode: string;
      primary: {
        light: string,
        main: string,
        dark: string,
        contrastText: string,
      },
      secondary: {
        light: string,
        main: string,
        dark: string,
        contrastText: string,
      }
    };
    status: {
      danger: string;
    };
  }
}

const primary = blue;
const secondary = orange;

export const theme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: primary[300],
      main: primary[500],
      dark: primary[700],
      contrastText: 'white',
    },
    secondary: {
      light: secondary[300],
      main: secondary[500],
      dark: secondary[700],
      contrastText: 'white',
    },
  },
});

export const withTheme = (component: JSX.Element): JSX.Element => {
  return (
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
  )
}