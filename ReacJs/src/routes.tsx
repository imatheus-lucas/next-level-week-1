import React from 'react';
import {BrowserRouter, Route} from 'react-router-dom'



// import { Container } from './styles';
import Home from './pages/home'
import CreatePoint from './pages/createPoint'
const Routes: React.FC = () => {
  return(
    <BrowserRouter>
      <Route exact component={Home} path="/" />
      <Route exact component={CreatePoint} path="/create-point" />
    </BrowserRouter>
  );
}

export default Routes;