import React from 'react';

import Card, {
  CardActions,
  CardContent
} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

/**
 * The summary of a given template.
 * @param props
 * @returns {*}
 * @constructor
 */
function TemplateSummary(props) {
  return (
    <div>
      <Card>
        <CardContent>
          <Typography type="headline" component="h2">{props.name}</Typography>
          <Typography component="pre">{props.description}</Typography>
        </CardContent>
        <CardActions>
          <Button onClick={props.onView}>View</Button>
          <Button onClick={props.onModify}>Modify</Button>
          <Button onClick={props.onDelete} color="accent">Delete</Button>
        </CardActions>
      </Card>
    </div>
  );
}

export default TemplateSummary;
