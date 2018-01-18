import React from 'react';
import Typography from 'material-ui/Typography'
import {withStyles} from "material-ui/styles/index";

const styles = theme => ({
    p: {
        marginTop: theme.spacing.unit,
    },
});

/**
 * Home component to explain the application
 * @param props
 * @returns {*}
 * @constructor
 */
function Home(props) {
    const { classes } = props;
    return (
        <div style={{marginTop: "3em", textAlign: "center"}} >
            <Typography type="display2" color="inherit" >Welcome !</Typography>
            <Typography className={classes.p} type="p" color="inherit">This application is an admin console for the Lozzikit - Mail microservice.</Typography>
            <Typography className={classes.p} type="p" color="inherit">Please configure the base URL of the service in the settings.</Typography>
            <Typography className={classes.p} type="p" color="inherit">The hosting server should allow Cross-Origin Resource Sharing to permit the app connexion to the service, otherwise the service MUST be reachable at the same host and port (by a proxy).</Typography>
        </div>
    );
}

export default withStyles(styles)(Home);