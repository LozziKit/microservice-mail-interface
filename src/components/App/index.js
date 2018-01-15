import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import Settings from '../Settings';
import TemplateManager from '../TemplateManager';

class App extends Component {

  render() {
    return (
      <Router>
        <div>
        <AppBar position="static" color="default">
          <Toolbar>
            <Link to={'/'}>
              <Button>Home</Button>
            </Link>
            <Link to={'/templates'}>
              <Button>Template</Button>
            </Link>
            <Link to={'/mails'}>
              <Button>Mail</Button>
            </Link>
              <Typography type="title" color="inherit" style={{flex:1, textAlign: "center"}}>Lozzikit - Mail</Typography>
            <Settings />
          </Toolbar>
        </AppBar>
        <Route exact path="/" component={Home} />
        <Route path="/templates" component={TemplateManager} />
        </div>
      </Router>
    );
  }
}

const Home = () => (
  <div>
    <Typography type="title" color="inherit" style={{textAlign: "center"}} >Welcome !</Typography>
  </div>
)

export default App;