import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import * as signalR from "@microsoft/signalr";
import Config from "../lib/utils/Config";
import Auth from "../lib/utils/Auth";
import { geolocated } from "react-geolocated";
import { Map, Friend } from "./Map";
import API from "../lib/utils/API";
import { withRouter } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Brought to you with &hearts; by
      <Link color="inherit" href="https://github.com/pierreg256">
        pierreg256
      </Link>{" "}
      {"."}
    </Typography>
  );
}

const styles = theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%" // 16:9
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  }
});

class Album extends Component {
  constructor(props) {
    super(props);
    this.state = {
      friends: {}
    };
  }
  handleMessage(msg) {
    const { friends } = this.state;
    if (msg.action === "new_friend") {
      const { latitude, longitude } = msg.coords;
      friends[msg.friendId] = { latitude, longitude };
      this.setState({ friends });
    }
  }
  componentDidMount() {
    class myHttpClient extends signalR.DefaultHttpClient {
      post(url, httpOptions) {
        httpOptions.headers = {
          ...httpOptions.headers,
          "x-user-Id": Auth.login
        };
        return super.post(url, httpOptions);
      }
    }
    let httpClient = new myHttpClient();
    let connection = new signalR.HubConnectionBuilder()
      .withUrl(Config.apiURL(), { httpClient })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.on("newMessage", msg => this.handleMessage(msg));

    connection
      .start()
      .then(() => {
        console.log("connected");
      })
      .catch(e => console.log(e));
  }

  reportLocation(coords) {
    API.reportLocation(coords);
  }

  logOut() {
    let { history } = this.props;
    Auth.signout();
    history.push("/");
  }

  render() {
    const { classes } = this.props;
    const { friends } = this.state;
    let map, button;
    if (this.props.isGeolocationEnabled && this.props.coords) {
      map = (
        <Map
          latitude={this.props.coords.latitude}
          longitude={this.props.coords.longitude}
        >
          {Object.keys(friends).map((friend, key) => {
            return (
              <Friend
                key={key}
                friendId={friend}
                longitude={friends[friend].longitude}
                latitude={friends[friend].latitude}
              />
            );
          })}
        </Map>
      );
      button = (
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.reportLocation(this.props.coords)}
        >
          Report Location
        </Button>
      );
    } else {
      map = <Typography>No GPS data available</Typography>;
      button = <Typography>Unable to report location</Typography>;
    }

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar position="relative">
          <Toolbar>
            <CameraIcon className={classes.icon} />
            <Typography variant="h6" color="inherit" noWrap>
              Welcome, {Auth.login}
            </Typography>
          </Toolbar>
        </AppBar>
        <main>
          {/* Hero unit */}
          <div className={classes.heroContent}>
            <Container maxWidth="sm">
              <Typography
                component="h1"
                variant="h2"
                align="center"
                color="textPrimary"
                gutterBottom
              >
                Friends Nearby
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Check your friends in the nearby location{" "}
              </Typography>
              {map}
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>{button}</Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => this.logOut()}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>{" "}
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Copyright />
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

export default withRouter(
  geolocated({
    positionOptions: {
      enableHighAccuracy: false
    },
    watchPosition: true,
    userDecisionTimeout: Infinity
  })(withStyles(styles)(Album))
);
