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

import MailSummary from '../MailSummary';
import { MailApi } from '../../api';

const styles = theme => ({
  fab: {
    position: 'fixed',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
  },
});

class MailList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mails: [],
      popupOpen: false,
      popupTitle: "",
      popupText: "",
    };
  }

  componentDidMount() {
    this.getAllMails();
  }

  getAllMails() {
    MailApi.getAll()
    .then((res) => {
      this.setState({...this.state, err: undefined, mails: res.body});
    }, (err, res) => {
      this.setState({...this.state, err: err});
    });
  }

  handlePopupOpen = (mail) => {
    this.setState({
      ...this.state,
      popupOpen: true,
      popupMail: mail,
    });
  };

  handlePopupClose = () => {
    this.setState({
      ...this.state,
      popupOpen: false,
      popupMail: undefined,
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
                Template used for the mail
              </DialogContentText>
              <Typography>
                {this.state.popupMail ? this.state.popupMail.templateName : ""}
              </Typography>
            </DialogContent>
            <DialogContent>
              <DialogContentText>
                Content of the mail
              </DialogContentText>
              <Typography>
                {this.state.popupMail ? this.state.popupMail.effectiveContent : ""}
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
            <div>Error recuperating the archived mails</div>
          : this.state.mails ?
            this.state.mails.map(mail => (
              <MailSummary
                key={mail.url}
                link={mail.url}
                mail={mail}
                onView={() => this.handlePopupOpen(mail)} />
            ))
          : (<div>There is no archived mail yet.</div>)
        }
        <Button fab color="primary" aria-label="add" className={this.props.classes.fab}>
          <AddIcon />
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(MailList);
