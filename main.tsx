import React from 'react';
import {createRoot} from 'react-dom/client';
import {LocalWorkbench} from './components/local-workbench';
import './app/globals.css';
import './app/practice.css';
import './app/lab.css';
createRoot(document.getElementById('root')!).render(<LocalWorkbench/>);
