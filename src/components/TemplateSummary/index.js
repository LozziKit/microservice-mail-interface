import React, { Component } from 'react';

import Card, {
  CardActions,
  CardContent
} from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

class TemplateSummary extends Component {
  render() {
    return (
      <div>
        <Card>
          <CardContent>
            <Typography type="headline" component="h2">{this.props.name}</Typography>
            <Typography component="pre">{this.props.description}</Typography>
          </CardContent>
          <CardActions>
            <Button onClick={this.props.onView}>View</Button>
            <Button onClick={this.props.onModify}>Modify</Button>
            <Button onClick={this.props.onDelete} color="accent">Delete</Button>
          </CardActions>
        </Card>
      </div>
    );
  }
}

export default TemplateSummary;
