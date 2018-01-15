import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import TemplateSummary from '../TemplateSummary';
import { TemplateApi } from '../../api';

class TemplateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
    };
  }

  componentDidMount() {
    this.getAllTemplates();
  }

  getAllTemplates() {
    TemplateApi.getAll()
    .then((res) => {
      this.setState({...this.state, err: undefined, templates: res.body});
    }, (err, res) => {
      this.setState({...this.state, err: err});
    });
  }

  render() {
    return (
        <div>
            {
              this.state.err ?
              <div>Error recuperating the templates</div>
              : this.state.templates ? 
                this.state.templates.map(t => (
                  <TemplateSummary
                      key={t.name}
                      link={t.url} 
                      name={t.name} 
                      description={t.description}
                      onDelete={() => TemplateApi.remove(t.url)
                        .then((req) => this.getAllTemplates(), (err) => console.log(err))} />
                ))
                : <div>There is no template yet.</div>
            }
        </div>
    );
  }
}

export default TemplateList;