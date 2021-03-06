import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';

import Settings from '../Settings';
import Home from '../Home';
import TemplateList from '../TemplateList';
import MailList from '../MailList';

/**
 * Entry component of the application.
 */
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
        <Route path="/templates" component={TemplateList} />
        <Route path="/mails" component={MailList} />
        </div>
      </Router>
    );
  }
}

export default App;
