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
import AddIcon from 'material-ui-icons/Add';
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
            <DialogTitle id="form-dialog-title">{this.props.template.name}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Content of the template
              </DialogContentText>
              <Typography component="p">
                {
                  this.props.template.content.split("\n").map((line) => {
                    return (
                      <span>
                        {line}<br/>
                      </span>
                    );
                  })
                }
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.onClose} color="primary">
                Cancel
              </Button>
            </DialogActions>
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
                onDelete={() => TemplateApi.remove(t.url)
                  .then((req) => this.getAllTemplates(), (err) => console.log(err))} />
            ))
          : <div>There is no template yet.</div>
        }
        <Button fab color="primary" aria-label="add" className={this.props.classes.fab}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateList);