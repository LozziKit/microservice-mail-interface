import React, { Component } from 'react';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
  } from 'material-ui/Dialog';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import TextField from 'material-ui/TextField';

class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
        settingOpen: false,
      };
    }
  
    handleSettingOpen = () => {
      this.setState({...this.state, settingOpen: true});
    };
    
    handleSettingClose = () => {
      this.setState({...this.state, settingOpen: false});
    };
    
    handleSettingSave = () => {
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
                            placeholder="/api/mail/v1/"
                            helperText="The base url of the mail service"
                            fullWidth
                            margin="normal"
                            type="url"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleSettingClose} color="primary">
                        Cancel
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