import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
  colors: {
    brand: {
      50: '#E6F0FF',
      100: '#B3D1FF',
      200: '#80B3FF',
      300: '#4D94FF',
      400: '#1A75FF',
      500: '#0A65FF',
      600: '#0052CC',
      700: '#0047B3',
      800: '#003D99',
      900: '#003380',
    },
    accent: {
      50: '#F5F0FF',
      100: '#E9DBFF',
      200: '#D4BBFF',
      300: '#BE9BFF',
      400: '#A87BFF',
      500: '#925BFF',
      600: '#805AD5',
      700: '#6B46C1',
      800: '#553C9A',
      900: '#44337A',
    },
    success: {
      500: '#38A169',
    },
    warning: {
      500: '#DD6B20',
    },
    error: {
      500: '#E53E3E',
    },
  },
  shadows: {
    card: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    cardHover: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'md',
          boxShadow: 'card',
          transition: 'box-shadow 0.2s ease-in-out',
          _hover: {
            boxShadow: 'cardHover',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
      },
    },
  },
});

export default theme;