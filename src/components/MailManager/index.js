import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import MailList from '../MailList';

class MailManager extends Component {
  render() {
    return (
        <div>
          <Route exact path={`${this.props.match.url}`} component={MailList} />
        </div>
    );
  }
}

export default MailManager;
