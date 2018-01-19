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
import Snackbar from "material-ui/Snackbar";

const styles = theme => ({
  fab: { // style of the add button
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

/**
 * Enum of the possible mode of the popup.
 * @type {Readonly<{CLOSED: number, NEW_TEMPLATE: number, READ_TEMPLATE: number, MODIFY_TEMPLATE: number}>}
 */
let PopupMode = Object.freeze({
  "CLOSED": 0,
  "NEW_TEMPLATE": 1,
  "READ_TEMPLATE": 2,
  "MODIFY_TEMPLATE": 3,
});

/**
 * A popup to Edit OR Create OR View a template.
 */
class TemplatePopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editableTemplate: {...this.defaultEditableTemplate},
    };
  }

  /**
   * The default value of the different field.
   * @type {{subject: string}}
   */
  defaultEditableTemplate = {
    name: "",
    description: "",
    subject: "",
  };

  /**
   * When new props are received, parse them to assign the template data to the fields.
   * @param nextProps The next values of the props.
   */
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
        subject: metaValues.subject || "",
        content: body,
      };
      this.setState({editableTemplate});
    }
  }

  /**
   * Change the state of the internal template representation.
   * @param updatedTemplate A template object with only the field that must change.
   */
  setTemplate(updatedTemplate) {
    let editableTemplate = {...this.state.editableTemplate, ...updatedTemplate};
    this.setState({editableTemplate})
  }

  /**
   * Submit the template (in the proper format) to the parent onSubmit handler.
   * Reset the internal template representation.
   */
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
      editableTemplate: {...this.defaultEditableTemplate},
    });
  };

  /**
   * Generate the content of the popup when the user wants to view a template.
   * @returns {*} An array of JSX elements.
   */
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

  /**
   * Generate the content of the popup when the user wants to edit or create a template.
   * @returns {*} An array of JSX elements.
   */
  generateEditableTemplateContent() {
    let contents = [];
    if(this.props.mode === PopupMode.NEW_TEMPLATE) {
      contents.push(
        <TextField
          key="name"
          id="nameEdit"
          label="Name:"
          InputLabelProps={{
            shrink: true,
          }}
          value={this.state.editableTemplate.name}
          onChange={(e) => this.setTemplate({name: e.target.value})}
          placeholder="templateName1"
          fullWidth
          margin="dense"
        />
      );
    }
    contents.push(
      <TextField
        key="description"
        id="descriptionEdit"
        label="Description:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.editableTemplate.description}
        onChange={(e) => this.setTemplate({description: e.target.value})}
        placeholder="Description of the template"
        multiline
        fullWidth
        margin="dense"
      />
    );
    contents.push(
      <TextField
        key="subject"
        id="subjectEdit"
        label="Subject:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.editableTemplate.subject}
        onChange={(e) => this.setTemplate({subject: e.target.value})}
        // eslint-disable-next-line
        placeholder="Salutations for ${name}"
        fullWidth
        margin="dense"
      />
    );
    contents.push(
      <TextField
        key="body"
        id="bodyEdit"
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
        margin="dense"
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

/**
 * A list of templates that refreshes automatically.
 * Allow the edition and viewing of its composing templates and to create more.
 */
class TemplateList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      templates: [],
      popupMode: PopupMode.CLOSED,
      popupTemplate: undefined,
    };
  }

  /**
   * The interval object used to refresh periodically.
   */
  interval;

  /**
   * Recuperate the template when the component is mounted and start the timer to auto-refresh.
   */
  componentDidMount() {
    this.getAllTemplates();
    this.interval = setInterval(() => this.getAllTemplates(), 3000);
  }

  /**
   * Stop auto-refreshing when the component unmount.
   */
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /**
   * Recuperate the templates with the Api and handle the error that may occur.
   */
  getAllTemplates() {
    TemplateApi.getAll()
    .then((res) => {
      this.setState({err: false, templates: res.body});
    }, (err) => {
      this.setState({err: true, errMsg: `Error ${err.status} (${err.message}) while getting all templates`});
    });
  }

  /**
   * Open or close the popup in function of the current mode.
   * @param mode The new mode.
   * @param t The template information for the popup.
   */
  handlePopupChangeMode = (mode, t) => {
    if(mode === PopupMode.CLOSED) {
      this.interval = setInterval(() => this.getAllTemplates(), 3000);
    } else {
      // Do not refresh information while modifying a template.
      clearInterval(this.interval);
    }
    this.setState({
      ...this.state,
      popupMode: mode,
      popupTemplate: t,
    });
  };

  /**
   * Submit the template to the server (updating or creating). And handle the response.
   * @param template The template that will be submitted.
   */
  handlePopupSubmit = (template) => {
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
      (err) => {
        this.setState({err: true, errMsg: `Error ${err.status} (${err.message}) while saving a template`});
      });
    this.setState({
      popupMode: PopupMode.CLOSED,
      popupTemplate: undefined,
    });
  };

  /**
   * Request the deletion of a template and handle the response.
   * @param template The template to delete.
   */
  handleDelete = (template) => {
    TemplateApi.remove(template.url).then(
        (req) => {
          this.getAllTemplates()
        },
        (err) => {
          this.setState({err: true, errMsg: `Error ${err.status} (${err.message}) while deleting a template`});
        });
  }

  /**
   * Close the snackbar.
   * @param event
   * @param reason
   */
  handleSnackbarClose = (event, reason) => {
      if (reason === 'clickaway') {
          return;
      }

      this.setState({ err: false });
  }

  render() {
    return (
      <div>
        <TemplatePopup
          mode={this.state.popupMode}
          template={this.state.popupTemplate}
          onClose={() => this.handlePopupChangeMode(PopupMode.CLOSED, undefined)}
          onSubmit={this.handlePopupSubmit}
        />
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            open={this.state.err}
            autoHideDuration={3000}
            onClose={this.handleSnackbarClose}
            SnackbarContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.errMsg}</span>}
            action={[
                <Button key="close" color="accent" dense onClick={this.handleSnackbarClose}>
                    CLOSE
                </Button>,
            ]}
        />
        {
          this.state.templates ?
          this.state.templates.map(t => (
            <TemplateSummary
              key={t.name}
              link={t.url}
              name={t.name}
              description={t.description}
              onView={() => this.handlePopupChangeMode(PopupMode.READ_TEMPLATE, t)}
              onModify={() => this.handlePopupChangeMode(PopupMode.MODIFY_TEMPLATE, t)}
              onDelete={() => this.handleDelete(t)} />
          )) : (<div style={{marginTop: "3em", textAlign: "center"}}><Typography type="display2" color="secondary">There is no template yet.</Typography></div>)
        }
        <Button fab color="primary" aria-label="add"
          className={this.props.classes.fab}
          onClick={() => this.handlePopupChangeMode(PopupMode.NEW_TEMPLATE, undefined)}
        >
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(TemplateList);
