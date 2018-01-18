import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  chip: {
    margin: theme.spacing.unit,
  },
});

const StatusColor = Object.freeze({
  ONGOING: "#0EBFE9",
  FAILED: "#FF3333",
  INVALID: "#FFA54F",
  CANCELLED: "#FFCC11",
  DONE: "#AEC965",
});

function MailSummary(props) {
  const { classes } = props;
  return (
    <div>
      <Card>
        <CardContent>
          <div className={classes.root}>
            <Typography type="caption">Status:</Typography>
            <Chip
              className={classes.chip}
              label={props.mail.status}
              style={{background: StatusColor[props.mail.status]}}
            />
          </div>
          <div className={classes.root}>
            <Typography type="caption">From:</Typography>
            <Chip
              className={classes.chip}
              label={props.mail.from}
            />
          </div>
          <div className={classes.root}>
            <Typography type="caption">To:</Typography>
            {props.mail.to.map(dest => (
              <Chip
                className={classes.chip}
                label={dest}
              />
            ))}
          </div>
          {
            props.mail.cc.length > 0 ?
            (
              <div className={classes.root}>
                <Typography type="caption">Cc:</Typography>
                {props.mail.cc.map(dest => (
                  <Chip
                    className={classes.chip}
                    label={dest}
                  />
                ))}
              </div>
            )
            : ""
          }
          {
            props.mail.cci.length > 0 ?
            (
              <div className={classes.root}>
                <Typography type="caption">Cci:</Typography>
                {props.mail.cci.map(dest => (
                  <Chip
                    className={classes.chip}
                    label={dest}
                  />
                ))}
              </div>
            )
            : ""
          }
          <div className={classes.root}>
            <Typography type="caption">Subject:</Typography>
            <Chip
                className={classes.chip}
                label={props.mail.subject}
              />
          </div>
        </CardContent>
        <CardActions>
          <Button color="primary" onClick={props.onView}>View</Button>
          {
            (props.mail.status === "ONGOING") ?
            (
              <Button color="accent" onClick={() => props.onCancel(props.mail.job_url)}>Cancel</Button>
            )
            : ""
          }
        </CardActions>
      </Card>
    </div>
  );
}

export default withStyles(styles)(MailSummary);
