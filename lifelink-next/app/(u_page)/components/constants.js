import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';

export const drawerWidth = 240;

export const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  height: 'calc(100% - 15px)',
  overflowX: 'hidden',
  borderRadius: '10px 10px 10px 10px',
  margin: theme.spacing(1),
});

export const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  borderRadius: '10px 10px 10px 10px',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  height: 'calc(100% - 15px)',
  margin: theme.spacing(1),
});

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `calc(${theme.spacing(7)} + 1px)`,
  width: `calc(100% - ${theme.spacing(7)} - 35px)`,
  ...(open && {
    marginLeft: `calc(${drawerWidth}px - 25px)`,
    width: `calc(100% - ${drawerWidth}px - 25px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  borderRadius: '10px 10px 10px 10px',
  margin: theme.spacing(1),
  backgroundColor: 'rgba(255, 255, 255, 0.4)', // Set the background color with opacity
  backdropFilter: 'blur(10px)', // Apply blur effect to the background
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
  // border: '1px solid white', // Add a white border
}));

export const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        background: `linear-gradient(to right, #dc2626, #ef4444)`, // Red gradient background when open
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        background: `linear-gradient(to right, #dc2626, #ef4444)`, // Red gradient background when closed
      },
    }),
  }),
);