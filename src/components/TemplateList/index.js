import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

import TemplateSummary from '../TemplateSummary';
import { TemplateApi } from '../../api';

class TemplateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      popupOpen: false,
      popupTitle: "",
      popupText: "",
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

  handlePopupOpen = (title, content) => {
    this.setState({
      ...this.state,
      popupOpen: true,
      popupTitle: title,
      popupText: content,
    });
  };

  handlePopupClose = () => {
    this.setState({
      ...this.state,
      popupOpen: false,
      popupTitle: "",
      popupText: "",
    });
  };

  render() {
    return (
      <div>
        <Dialog
          aria-labelledby="templatepopup"
          open={this.state.popupOpen}
          onClose={this.handlePopupClose}
        >
          <div>
            <DialogTitle id="form-dialog-title">{this.state.popupTitle}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Content of the template
              </DialogContentText>
              <Typography>
                {this.state.popupText}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handlePopupClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </div>
        </Dialog>
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
                onView={() => this.handlePopupOpen(t.name, t.content)}
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
