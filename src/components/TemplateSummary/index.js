import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';

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
            <Typography component="p">{this.props.description}</Typography>
          </CardContent>
          <CardActions>
            <Button raised color="primary">Use</Button>
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
