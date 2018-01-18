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

const PopupMode = Object.freeze({
  "CLOSED": 0,
  "NEW_MAIL": 1,
  "READ_MAIL": 2,
});

class MailPopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createdMail: {},
      templateParameters: {},
      templateParameterNames: [],
    };
  }

  componentWillReceiveProps(nextProps) {
  }

  setMail(updatedMail) {
    let createdMail = {...this.state.createdMail, ...updatedMail};
    this.setState({createdMail})
  }

  setTemplateParameters(name, value) {
    let updatedParameters = {};
    updatedParameters[name] = value;
    let templateParameters = {...this.state.templateParameters, ...updatedParameters};
    this.setState({templateParameters})
  }

  handleOnSend() {
    let mailToSend = {...this.state.createdMail};
    mailToSend.to = mailToSend.to ? mailToSend.to.split(";").map(a => a.trim()) : null;
    mailToSend.cc = mailToSend.cc ? mailToSend.cc.split(";").map(a => a.trim()) : null;
    mailToSend.cci = mailToSend.cci ? mailToSend.cci.split(";").map(a => a.trim()) : null;
    mailToSend["map"] = {...this.state.templateParameters};
    this.props.onSend(mailToSend);
    this.setState({
      createdMail: {},
      templateParameters: {},
      templateParameterNames: []
    });
  };

  templateRequest;

  /**
   * When the template change save the new value and request the parameters needed from the server.
   * @param {*} e
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
        this.setState({templateParameterNames: Array.from(templateParameterNames)});
      }, 
      (err) => {
        this.setState({templateParameterNames: []});
      });
  }

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
    if(this.props.mail.cc.length > 0) {
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

  generateNewMailContent() {
    let contents = [];
    contents.push(
      <TextField
        key="templateName"
        id="full-width"
        label="Template:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.templateName}
        onChange={(e) => this.handleTemplateChange(e)}
        placeholder="template1"
        fullWidth
        margin="normal"
      />
    );
    contents.push(
      <TextField
        key="from"
        id="full-width"
        label="From:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.from}
        onChange={(e) => this.setMail({from: e.target.value})}
        placeholder="hello@world.org"
        type="email"
        fullWidth
        margin="normal"
      />
    );
    contents.push(
      <TextField
        key="to"
        id="full-width"
        label="To:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.to}
        onChange={(e) => this.setMail({to: e.target.value})}
        helperText="Email addresses separated by semicolons (;)"
        placeholder="hello@world.org"
        fullWidth
        margin="normal"
      />
    );
    contents.push(
      <TextField
        key="cc"
        id="full-width"
        label="Cc:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.cc}
        onChange={(e) => this.setMail({cc: e.target.value})}
        helperText="Email addresses separated by semicolons (;)"
        placeholder="hello@world.org"
        fullWidth
        margin="normal"
      />
    );
    contents.push(
      <TextField
        key="cci"
        id="full-width"
        label="Cci:"
        InputLabelProps={{
          shrink: true,
        }}
        value={this.state.createdMail.cci}
        onChange={(e) => this.setMail({cci: e.target.value})}
        helperText="Email addresses separated by semicolons (;)"
        placeholder="hello@world.org"
        fullWidth
        margin="normal"
      />
    );
    if(this.state.templateParameterNames.length > 0) {
      contents.push(
        <div key="parameters">
          <Typography type="headline">With parameters:</Typography>
          {this.state.templateParameterNames.map(param => (
            <TextField
              key={param}
              id="full-width"
              label={param}
              InputLabelProps={{
                shrink: true,
              }}
              value={this.state.templateParameters[param]}
              onChange={(e) => this.setTemplateParameters(param, e.target.value)}
              fullWidth
              margin="normal"
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
  
  componentDidMount() {
    this.getAllMails();
    this.interval = setInterval(() => this.getAllMails(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getAllMails() {
    MailApi.getAll()
    .then((res) => {
      this.setState({err: undefined, mails: res.body});
    }, (err, res) => {
      this.setState({err});
    });
  }

  handlePopupOpen = (mode, mail) => {
    this.setState({
      ...this.state,
      popupMode: mode,
      popupMail: mail,
    });
  };

  handlePopupClose = () => {
    this.setState({
      ...this.state,
      popupMode: PopupMode.CLOSED,
      popupMail: undefined,
    });
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ err: false });
  }

  handleSendMessage = (msg) => {
    console.log(msg);
    MailApi.postOne(msg).then(
      (res) => {
        // TODO: Show if mail failed
        // TODO: Snackbar could allow cancellation
        this.getAllMails();
      },
      (err, req) => {

        this.setState({err});
      }
    );
    this.handlePopupClose();
  }

  handleOnCancel = (jobLink) => {
    JobApi.remove(jobLink).then(
      (res) => {
        this.getAllMails();
      }, 
      (err, res) => {
        console.log(err);
      });
  }

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
          message={<span id="message-id">Note archived</span>}
          action={[
            <Button key="close" color="accent" dense onClick={this.handleSnackbarClose}>
              CLOSE
            </Button>,
          ]}
        />
        {
          this.state.err ?
            <div>Error recuperating the archived mails</div>
          : this.state.mails ?
            this.state.mails.map(mail => (
              <MailSummary
                key={mail.url}
                link={mail.url}
                mail={mail}
                onView={() => this.handlePopupOpen(PopupMode.READ_MAIL, mail)}
                onCancel={this.handleOnCancel} />
            ))
          : (<div>There is no archived mail yet.</div>)
        }
        <Button fab color="primary" aria-label="add"
            className={this.props.classes.fab}
            onClick={() => this.handlePopupOpen(PopupMode.NEW_MAIL, undefined)}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(MailList);
