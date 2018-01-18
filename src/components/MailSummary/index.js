import React from 'react';

import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Chip from 'material-ui/Chip';
import Typography from 'material-ui/Typography';

/**
 * The style to apply to the MailSummary component.
 * @param theme
 * @returns {{root: {display: string, flexWrap: string, alignItems: string}, chip: {margin}}}
 */
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

/**
 * The color matching a possible status.
 * @type {Readonly<{CANCELLED: string, ONGOING: string, FAILED: string, INVALID: string, DONE: string}>}
 */
const StatusColor = Object.freeze({CANCELLED: "#cdcaca",
  ONGOING: "#0EBFE9",
  FAILED: "#F26D6D",
  INVALID: "#FFA54F",
  DONE: "#AEC965",
});

/**
 * The summary of a given archived mail.
 * @param props
 * @returns {*}
 * @constructor
 */
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
                key={dest}
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
                    key={dest}
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
                    key={dest}
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
