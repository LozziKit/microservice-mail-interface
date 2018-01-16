import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import TemplateList from '../TemplateList';

class TemplateManager extends Component {
  render() {
    return (
        <div>
          <Route exact path={`${this.props.match.url}`} component={TemplateList} />
        </div>
    );
  }
}

export default TemplateManager;
