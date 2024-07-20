// assets/theme.ts
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    // Define custom colors, fonts, sizes, etc.
    breakpoints: {
        base: '0em',   // mobile
        sm: '30em',    // small devices
        md: '48em',    // medium devices
        lg: '62em',    // large devices
        xl: '80em',    // extra-large devices
    },
});

export default theme;
