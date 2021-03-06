import React, { Component } from 'react';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Snackbar from 'material-ui/Snackbar';
import AddIcon from 'material-ui-icons/Add';
import { withStyles } from 'material-ui/styles';

import MailSummary from '../MailSummary';
import { MailApi, TemplateApi, JobApi } from '../../api';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

/**
 * Enum of the possible mode of the popup.
 * @type {Readonly<{CLOSED: number, NEW_MAIL: number, READ_MAIL: number}>}
 */
const PopupMode = Object.freeze({
  "CLOSED": 0,
  "NEW_MAIL": 1,
  "READ_MAIL": 2,
});

/**
 * A popup to Create OR View an archived mail.
 */
class MailPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createdMail: {...this.defaultCreatedMail},
      templateParameters: {},
      templateParameterNames: [],
    };
  }

  /**
   * The default value of the different field.
   * @type {{subject: string}}
   */
  defaultCreatedMail = {
      templateName: "",
      to: "",
      from: "",
      cc: "",
      cci: "",
  }

  /**
   * Change the state of the internal mail representation.
   * @param updatedMail A mail object with only the field that must change.
   */
  setMail(updatedMail) {
    let createdMail = {...this.state.createdMail, ...updatedMail};
    this.setState({createdMail})
  }

  /**
   * Change the state of the internal representation of the wanted template parameters.
   * @param name The name of the parameter to change.
   * @param value The new value of the parameter.
   */
  setTemplateParameters(name, value) {
    let updatedParameters = {};
    updatedParameters[name] = value;
    let templateParameters = {...this.state.templateParameters, ...updatedParameters};
    this.setState({templateParameters})
  }

  /**
   * Send the mail (in the proper format) to the parent onSend handler.
   * Reset the internal mail and template parameters representation.
   */
  handleOnSend() {
    let mailToSend = {...this.state.createdMail};
    mailToSend.to = mailToSend.to ? mailToSend.to.split(";").map(a => a.trim()) : [];
    mailToSend.cc = mailToSend.cc ? mailToSend.cc.split(";").map(a => a.trim()) : [];
    mailToSend.cci = mailToSend.cci ? mailToSend.cci.split(";").map(a => a.trim()) : [];
    mailToSend["map"] = {...this.state.templateParameters};
    this.props.onSend(mailToSend);
    this.setState({
      createdMail: {...this.defaultCreatedMail},
      templateParameters: {},
      templateParameterNames: []
    });
  };

  /**
   * The request used to get the parameters of the named template.
   */
  templateRequest;

  /**
   * When the template change save the new value and request the parameters needed from the server.
   * Parses the content of the template to find the parameters.
   * @param {*} e The event object fired by the TextField.
   */
  handleTemplateChange(e) {
    this.setMail({templateName: e.target.value});
    if(this.templateRequest) {
      this.templateRequest.abort();
    }
    this.templateRequest = TemplateApi.getNamed(e.target.value);
    this.templateRequest.then(
      (res) => {
        let regex = /\${([^}]*)}/g;
        let match;
        let templateParameterNames = new Set();
        do {
          match = regex.exec(res.body.content);
          if(match) {
            templateParameterNames.add(match[1]);
          }
        } while (match);
        let templateParameters = {};
        templateParameterNames.forEach(param => templateParameters[param] = "");
        this.setState({templateParameters, templateParameterNames: Array.from(templateParameterNames)});
      },
      (err) => {
        this.setState({templateParameterNames: []});
      });
  }

  /**
   * Generate the content of the popup when the user wants to view a mail.
   * @returns {*} An array of JSX elements.
   */
  generateReadMailContent() {
    let contents = [];
    contents.push(
      <div key="templateName">
        <Typography type="caption">Template:</Typography>
        <Typography component="p">{this.props.mail.templateName}</Typography>
      </div>
    );
    contents.push(
      <div key="from">
        <Typography type="caption">From:</Typography>
        <Typography component="p">{this.props.mail.from}</Typography>
      </div>
    );
    contents.push(
      <div key="to">
        <Typography type="caption">To:</Typography>
        {this.props.mail.to.map(dest => (<Typography key={dest} component="p">{dest}</Typography>))}
      </div>
    );
    if(this.props.mail.cc.length > 0) {
      contents.push(
        <div key="cc">
          <Typography type="caption">Cc:</Typography>
          {this.props.mail.cc.map(dest => (<Typography key={dest} component="p">{dest}</Typography>))}
        </div>
      );
    }
    if(this.props.mail.cci.length > 0) {
      contents.push(
        <div key="cci">
          <Typography type="caption">Cci:</Typography>
          {this.props.mail.cci.map(dest => (<Typography key={dest} component="p">{dest}</Typography>))}
        </div>
      );
    }
    contents.push(
      <div key="subject">
        <Typography type="caption">Subject:</Typography>
        <Typography component="p">{this.props.mail.subject}</Typography>
      </div>
    );
    contents.push(
      <div key="body">
        <Typography type="caption">Body:</Typography>
        <Typography component="pre">{this.props.mail.effectiveContent}</Typography>
      </div>
    );
    return (
      <div>{contents}</div>
    );
  }

  /**
   * Generate the content of the popup when the user wants to create (send) a mail.
   * @returns {*} An array of JSX elements.
   */
  generateNewMailContent() {
    let contents = [];
    contents.push(
      <TextField
        key="templateName"
        id="templateNameEdit"
        label="Template:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.templateName}
        onChange={(e) => this.handleTemplateChange(e)}
        placeholder="template1"
        fullWidth
        margin="dense"
      />
    );
    contents.push(
      <TextField
        key="from"
        id="fromEdit"
        label="From:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.from}
        onChange={(e) => this.setMail({from: e.target.value})}
        placeholder="hello@world.org"
        type="email"
        fullWidth
        margin="dense"
      />
    );
    contents.push(
      <TextField
        key="to"
        id="toEdit"
        label="To:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.to}
        onChange={(e) => this.setMail({to: e.target.value})}
        helperText="Email addresses separated by semicolons (;)"
        placeholder="hello@world.org; another@email.ch"
        fullWidth
        margin="dense"
      />
    );
    contents.push(
      <TextField
        key="cc"
        id="ccEdit"
        label="Cc:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.cc}
        onChange={(e) => this.setMail({cc: e.target.value})}
        helperText="Email addresses separated by semicolons (;)"
        placeholder="hello@world.org"
        fullWidth
        margin="dense"
      />
    );
    contents.push(
      <TextField
        key="cci"
        id="cciEdit"
        label="Cci:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.cci}
        onChange={(e) => this.setMail({cci: e.target.value})}
        helperText="Email addresses separated by semicolons (;)"
        placeholder="hello@world.org"
        fullWidth
        margin="dense"
      />
    );
    if(this.state.templateParameterNames.length > 0) {
      contents.push(
        <div key="parameters">
          <Typography type="headline">With parameters:</Typography>
          {this.state.templateParameterNames.map(param => (
            <TextField
              key={param}
              id={`${param}Edit`}
              label={param}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.templateParameters[param]}
              onChange={(e) => this.setTemplateParameters(param, e.target.value)}
              fullWidth
              margin="dense"
            />
          ))}
        </div>
      );
    }
    return (
      <form>{contents}</form>
    );
  }

  render() {
    let title = "";
    let buttons = [
      (<Button key="cancel" onClick={this.props.onClose} color="primary">
        Cancel
      </Button>),
    ]
    let content;
    switch(this.props.mode) {
      case PopupMode.NEW_MAIL:
        title = "Send a new mail";
        content = this.generateNewMailContent();
        buttons.push(
          <Button key="send"
              onClick={() => this.handleOnSend()} color="primary">
            Send
          </Button>
        );
        break;
      case PopupMode.READ_MAIL:
        title = "View a mail";
        content = this.generateReadMailContent();
        break;
      default:
        break;
    }

    return (
      <Dialog
        aria-labelledby="mailpopup"
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
 * A list of archived mail that refreshes automatically.
 * Allow the viewing of its composing mails and to send more.
 */
class MailList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mails: [],
      popupMode: PopupMode.CLOSED,
      popupTitle: "",
      popupText: "",
    };
  }

  /**
   * Recuperate the archived mail when the component is mounted and start the timer to auto-refresh.
   */
  componentDidMount() {
    this.getAllMails();
    this.interval = setInterval(() => this.getAllMails(), 3000);
  }

  /**
   * Stop auto-refreshing when the component unmount.
   */
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  /**
   * Recuperate the archived mails with the Api and handle the error that may occur.
   */
  getAllMails() {
    MailApi.getAll()
    .then((res) => {
      this.setState({err: false, mails: res.body});
    }, (err) => {
      this.setState({err: true, errMsg: `Error ${err.status} (${err.message}) while getting all archived mail`});
    });
  }

  /**
   * Open or close the popup in function of the current mode.
   * @param mode The new mode.
   * @param mail The mail information for the popup.
   */
  handlePopupMode = (mode, mail) => {
    this.setState({
      ...this.state,
      popupMode: mode,
      popupMail: mail,
    });
  };

  /**
   * Close the popup.
   */
  handlePopupClose = () => {
      this.handlePopupMode(PopupMode.CLOSED);
  };

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

  /**
   * Request to send a mail and handle the response.
   * @param msg The mail to send.
   */
  handleSendMessage = (msg) => {
    console.log(msg);
    MailApi.postOne(msg).then(
      (res) => {
        this.getAllMails();
      },
      (err) => {
        this.setState({err: true, errMsg: `Error ${err.status} (${err.message}) while posting a mail.`});
      }
    );
    this.handlePopupClose();
  };

  /**
   * Request to cancel an ongoing mail (job) and handle the response.
   * @param jobLink The link to job to cancel.
   */
  handleOnCancel = (jobLink) => {
    JobApi.remove(jobLink).then(
      (res) => {
        this.getAllMails();
      }, 
      (err) => {
          this.setState({err: true, errMsg: `Error ${err.status} (${err.message}) while cancelling a job.`});
      });
  };

  render() {
    return (
      <div>
        <MailPopup
          mode={this.state.popupMode}
          onClose={this.handlePopupClose}
          onSend={this.handleSendMessage}
          mail={this.state.popupMail}/>
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
          this.state.mails ?
            this.state.mails.map(mail => (
              <MailSummary
                key={mail.url}
                link={mail.url}
                mail={mail}
                onView={() => this.handlePopupMode(PopupMode.READ_MAIL, mail)}
                onCancel={this.handleOnCancel} />
            ))
          : (<div style={{marginTop: "3em", textAlign: "center"}}><Typography type="display2" color="secondary">There is no archived mail yet.</Typography></div>)
        }
        <Button fab color="primary" aria-label="add"
            className={this.props.classes.fab}
            onClick={() => this.handlePopupMode(PopupMode.NEW_MAIL, undefined)}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(MailList);
