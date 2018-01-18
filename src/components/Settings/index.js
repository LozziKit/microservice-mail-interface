import React, { Component } from 'react';

import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import config from '../../api/config.js';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingOpen: false,
      saved: true,
      ...config
    };
  }

  handleSettingOpen = () => {
    this.setState({...this.state, settingOpen: true});
  };

  handleSettingClose = () => {
    this.setState({...this.state, settingOpen: false});
  };
  
  handleSettingReset = () => {
    this.setState({...this.state, ...config, saved: true});
  };

  handleSettingSave = () => {
    config.baseUrl = this.state.baseUrl;
    this.setState({...this.state, saved: true});
    this.handleSettingClose();
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleSettingOpen}>Settings</Button>
        <Dialog
          aria-labelledby="settings"
          open={this.state.settingOpen}
          onClose={this.handleSettingClose}
        >
          <div>
            <DialogTitle id="form-dialog-title">Settings</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To configure the application please change and save the values of this form.
              </DialogContentText>
              <TextField
                id="full-width"
                label="Base server URL"
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="http://localhost:8080"
                value={this.state.baseUrl}
                onChange={(e) => this.setState({...this.state, baseUrl: e.target.value.trim, saved: false})}
                helperText="The base url of the mail service"
                fullWidth
                margin="normal"
                type="url"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleSettingReset} disabled={this.state.saved}>
                Reset
              </Button>
              <Button onClick={this.handleSettingClose} color="primary">
                Close
              </Button>
              <Button onClick={this.handleSettingSave} color="primary">
                Save
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default Settings;
