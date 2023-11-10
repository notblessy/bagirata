import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

import { MantineProvider, createTheme } from '@mantine/core';
import { BrowserRouter } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import { SWRConfig } from "swr";
import { fetcher } from "./libs/utils/api";

const myColor = [
  '#fff0e4',
  '#ffe0cf',
  '#fac0a1',
  '#f69e6e',
  '#f28043',
  '#f06d27',
  '#f06418',
  '#d6530c',
  '#bf4906',
  '#a73c00'
];

const theme = createTheme({
  colors: {
    myColor,
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <Notifications position="top-center" />
      <BrowserRouter>
        <SWRConfig
          value={{
            refreshInterval: 0,
            fetcher,
          }}
        >
          <App />
        </SWRConfig>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>,
)
