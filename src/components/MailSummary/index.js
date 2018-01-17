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

function MailSummary(props) {
  const { classes } = props;
  return (
    <div>
      <Card>
        <CardContent>
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
          <div className={classes.root}>
            <Typography type="caption">Cc:</Typography>
            {props.mail.cc.map(dest => (
              <Chip
                className={classes.chip}
                label={dest}
              />
            ))}
          </div>
          <div className={classes.root}>
            <Typography type="caption">Cci:</Typography>
            {props.mail.cci.map(dest => (
              <Chip
                className={classes.chip}
                label={dest}
              />
            ))}
          </div>
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
        </CardActions>
      </Card>
    </div>
  );
}

export default withStyles(styles)(MailSummary);
