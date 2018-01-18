import React, { Component } from 'react';

import Dialog, {
  DialogActions,
  DialogContent,
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

class TemplatePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editableTemplate: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.template !== undefined) {
      let parts = nextProps.template.content.split("\n\n");
      let header = parts.shift();
      let body = parts.join("\n\n");
      let metaValues = {};
      header.split("\n").forEach(meta => {
        let [name, value] = meta.split(":").map(e => e.trim().toLowerCase());
        metaValues[name] = value;
      });
      let editableTemplate = {
        name: nextProps.template.name,
        description: nextProps.template.description,
        subject: metaValues.subject,
        content: body,
      }
      this.setState({editableTemplate});
    }
  }

  setTemplate(updatedTemplate) {
    let editableTemplate = {...this.state.editableTemplate, ...updatedTemplate};
    this.setState({editableTemplate})
  }

  handleOnSubmit = () => {
    let templateToSubmit = {
      name: this.state.editableTemplate.name,
      description: this.state.editableTemplate.description,
      content: `Subject:${this.state.editableTemplate.subject}\n\n${this.state.editableTemplate.content}`
    };

    if(this.props.mode === PopupMode.MODIFY_TEMPLATE) {
      templateToSubmit.url = this.props.template.url;
    }

    this.props.onSubmit(templateToSubmit);
    this.setState({
      editableTemplate: {},
    });
  };

  generateReadTemplateContent() {
    let contents = [];
    contents.push(
      <div key="description">
        <Typography type="caption">Description:</Typography>
        <Typography component="pre">{this.state.editableTemplate.description}</Typography>
      </div>
    );
    contents.push(
      <div key="subject">
        <Typography type="caption">Subject:</Typography>
        <Typography component="p">{this.state.editableTemplate.subject}</Typography>
      </div>
    );
    contents.push(
      <div key="body">
        <Typography type="caption">Body:</Typography>
        <Typography component="pre">{this.state.editableTemplate.content}</Typography>
      </div>
    );
    return (
      <div>{contents}</div>
    );
  }

  generateEditableTemplateContent() {
    let contents = [];
    if(this.props.mode === PopupMode.NEW_TEMPLATE) {
      contents.push(
        <TextField
          key="name"
          id="full-width"
          label="Name:"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.editableTemplate.name}
          onChange={(e) => this.setTemplate({name: e.target.value})}
          placeholder="template1"
          fullWidth
          margin="normal"
        />
      );
    }
    contents.push(
      <TextField
        key="description"
        id="full-width"
        label="Description:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.editableTemplate.description}
        onChange={(e) => this.setTemplate({description: e.target.value})}
        placeholder="Description of the template"
        multiline
        fullWidth
        margin="normal"
      />
    );
    contents.push(
      <TextField
        key="subject"
        id="full-width"
        label="Subject:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.editableTemplate.subject}
        onChange={(e) => this.setTemplate({subject: e.target.value})}
        // eslint-disable-next-line
        placeholder="Salutations for ${name}"
        fullWidth
        margin="normal"
      />
    );
    contents.push(
      <TextField
        key="body"
        id="full-width"
        label="Body:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.editableTemplate.content}
        onChange={(e) => this.setTemplate({content: e.target.value})}
        // eslint-disable-next-line
        placeholder="Hello ${name}"
        fullWidth
        multiline
        margin="normal"
      />
    );
    return (
      <form>{contents}</form>
    );
  }

  render() {
    let title = "";
    let content;
    let buttons = [
      (<Button key="cancel" onClick={this.props.onClose} color="primary">
        Cancel
      </Button>),
    ]
    switch(this.props.mode) {
      case PopupMode.NEW_TEMPLATE:
        title = "New Template";
        content = this.generateEditableTemplateContent();
        buttons.push(
          <Button key="submit" onClick={this.handleOnSubmit} color="primary">
            Submit
          </Button>
        );
        break;
      case PopupMode.READ_TEMPLATE:
        title = this.props.template.name;
        content = this.generateReadTemplateContent();
        break;
      case PopupMode.MODIFY_TEMPLATE:
        title = `Edit: ${this.props.template.name}`;
        content = this.generateEditableTemplateContent();
        buttons.push(
          <Button key="save" onClick={this.handleOnSubmit} color="primary">
            Save
          </Button>
        );
        break;
      default:
        break;
    }

    return (
      <Dialog
        aria-labelledby="templatePopup"
        open={this.props.mode !== PopupMode.CLOSED}
        onClose={this.props.onClose}
      >
        <div>
          <DialogTitle id="form-dialog-title">{title}</DialogTitle>
          <DialogContent>
            {content}
          </DialogContent>
          <DialogActions>
            {buttons}
          </DialogActions>
        </div>
      </Dialog>
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

  interval;

  componentDidMount() {
    this.getAllTemplates();
    this.interval = setInterval(() => this.getAllTemplates(), 3000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAllTemplates() {
    TemplateApi.getAll()
    .then((res) => {
      this.setState({err: undefined, templates: res.body});
    }, (err, res) => {
      console.log(err);
      this.setState({err: err});
    });
  }

  handlePopupChangeMode = (mode, t) => {
    if(mode === PopupMode.CLOSED) {
      this.interval = setInterval(() => this.getAllTemplates(), 3000);
    } else {
      clearInterval(this.interval);
    }
    this.setState({
      ...this.state,
      popupMode: mode,
      popupTemplate: t,
    });
  };

  handlePopupSubmit = (template) => {
    console.log(template);
    let request;
    if(template.url) {
      // PUT the template
      request = TemplateApi.put(template);
    } else {
      // POST the template
      request = TemplateApi.post(template);
    }
    request.then(
      (res) => {
        this.getAllTemplates();
      },
      (err, res) => {
        console.log(err);
      });
    this.setState({
      popupMode: PopupMode.CLOSED,
      popupTemplate: undefined,
    });
  };

  handlePopupClose = () => {
    this.handlePopupChangeMode(PopupMode.CLOSED, undefined);
  };
  handlePopupNewTemplate = () => this.handlePopupChangeMode(PopupMode.NEW_TEMPLATE, undefined);
  handlePopupReadTemplate = (t) => this.handlePopupChangeMode(PopupMode.READ_TEMPLATE, t);
  handlePopupModifyTemplate = (t) => this.handlePopupChangeMode(PopupMode.MODIFY_TEMPLATE, t);

  render() {
    return (
      <div>
        <TemplatePopup
          mode={this.state.popupMode}
          template={this.state.popupTemplate}
          onClose={this.handlePopupClose}
          onSubmit={this.handlePopupSubmit}
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
