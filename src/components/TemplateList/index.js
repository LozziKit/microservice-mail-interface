import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import AddIcon from 'material-ui-icons/Add';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import TemplateSummary from '../TemplateSummary';
import { TemplateApi } from '../../api';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

let PopupMode = Object.freeze({
  "CLOSED": 0,
  "NEW_TEMPLATE": 1,
  "READ_TEMPLATE": 2,
  "MODIFY_TEMPLATE": 3,
});

class TemplatePopupTitle extends Component {
  render() {
    switch(this.props.mode) {
      case PopupMode.NEW_TEMPLATE:
        return <DialogTitle id="form-dialog-title">New Template</DialogTitle>;
      default:
        return <DialogTitle id="form-dialog-title">{this.props.value}</DialogTitle>;
    }
  }
}

class TemplatePopupContent extends Component {
  render() {
    switch(this.props.mode) {
      case PopupMode.NEW_TEMPLATE:
        return (
          <DialogContent>
            <DialogContentText>
              Title of the new template
            </DialogContentText>
            <TextField placeholder={this.props.content} />
            <DialogContentText>
              Content of the new template
            </DialogContentText>
            <TextField multiline placeholder={"..."} />
          </DialogContent>
        );
      case PopupMode.READ_TEMPLATE:
        return (
          <DialogContent>
            <DialogContentText>
              Content of the template
            </DialogContentText>
            <Typography component="p">
              {
                this.props.content.split("\n").map((line) => (
                  <span>
                    {line}<br />
                  </span>
                ))
              }
            </Typography>
          </DialogContent>
        );
      case PopupMode.MODIFY_TEMPLATE:
        return (
          <DialogContent>
            <DialogContentText>
              New content for the template
            </DialogContentText>
            <TextField
              multiline
              defaultValue={ this.props.content}
            />
          </DialogContent>
        );
      default:
        return null;
    }
  }
}

class TemplatePopupActions extends Component {
  render() {
    switch(this.props.mode) {
      case PopupMode.READ_TEMPLATE:
        return (
          <DialogActions>
            <Button onClick={this.props.onClose} color="primary">
              Close
            </Button>
          </DialogActions>
        );
      case PopupMode.NEW_TEMPLATE:
      case PopupMode.MODIFY_TEMPLATE:
        return (
          <DialogActions>
            <Button onClick={this.props.onClose} color="primary">
              Submit
            </Button>
            <Button onClick={this.props.onClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        );
      default:
        return null;
    }
  }
}

class TemplatePopup extends Component {
  render() {
    if (this.props.template === undefined) {
      return null;
    }

    console.log(this.props.template.content);

    return (
      <div>
        <Dialog
          aria-labelledby="templatepopup"
          open={this.props.mode !== PopupMode.CLOSED}
          onClose={this.props.onClose}
        >
          <div>
            <TemplatePopupTitle mode={this.props.mode} value={this.props.template.name} />
            <TemplatePopupContent mode={this.props.mode} content={this.props.template.content} />
            <TemplatePopupActions mode={this.props.mode} onClose={this.props.onClose} />
          </div>
        </Dialog>
      </div>
    );
  }
}

class TemplateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      popupMode: PopupMode.CLOSED,
      popupTemplate: undefined,
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

  handlePopupChangeMode = (mode, t) => {
    this.setState({
      ...this.state,
      popupMode: mode,
      popupTemplate: t,
    });
  };

  handlePopupClose = () => this.handlePopupChangeMode(PopupMode.CLOSED, undefined);
  handlePopupNewTemplate = (t) => this.handlePopupChangeMode(PopupMode.NEW_TEMPLATE, t);
  handlePopupReadTemplate = (t) => this.handlePopupChangeMode(PopupMode.READ_TEMPLATE, t);
  handlePopupModifyTemplate = (t) => this.handlePopupChangeMode(PopupMode.MODIFY_TEMPLATE, t);

  render() {
    return (
      <div>
        <TemplatePopup
          mode={this.state.popupMode}
          template={this.state.popupTemplate}
          onClose={this.handlePopupClose}
        />
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
                onView={() => this.handlePopupReadTemplate(t)}
                onModify={() => this.handlePopupModifyTemplate(t)}
                onDelete={() => TemplateApi.remove(t.url)
                  .then((req) => this.getAllTemplates(), (err) => console.log(err))} />
            ))
          : <div>There is no template yet.</div>
        }
        <Button fab color="primary" aria-label="add"
          className={this.props.classes.fab}
          onClick={this.handlePopupNewTemplate}
        >
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateList);
