import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
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
import Map from "./Map";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
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

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

class Album extends Component {
  componentDidMount() {
    const options = {
      /*accessTokenFactory: () => {
        return "jwt token";
      },*/
      httpClient: {
        post: (url, httpOptions) => {
          httpOptions.headers = {
            ...httpOptions.headers,
            MyHeader: "NewHeader"
          };
          httpOptions.method = "POST";
          httpOptions.url = url;

          return fetch(url, httpOptions);
        }
      }
    };
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

    connection.on("newMessage", msg => console.log("message:", msg));

    connection
      .start()
      .then(() => {
        console.log("connected");
        fetch(`${Config.apiURL()}/messages`, {
          method: "POST",
          body: JSON.stringify({
            recipient: Auth.login,
            content: "hello world"
          }),
          headers: new Headers({
            Authorization: `Bearer ${Auth.token}`
          })
        });
      })
      .catch(e => console.log(e));
  }
  render() {
    const { classes } = this.props;
    let map;
    if (this.props.isGeolocationEnabled && this.props.coords) {
      map = (
        <Map
          latitude={this.props.coords.latitude}
          longitude={this.props.coords.longitude}
        ></Map>
      );
    } else {
      map = <Typography>No GPS data available</Typography>;
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
                Album layout
              </Typography>
              <Typography
                variant="h5"
                align="center"
                color="textSecondary"
                paragraph
              >
                Something short and leading about the collection below—its
                contents, the creator, etc. Make it short and sweet, but not too
                short so folks don&apos;t simply skip over it entirely.
              </Typography>
              {map}
              <div className={classes.heroButtons}>
                <Grid container spacing={2} justify="center">
                  <Grid item>
                    <Button variant="contained" color="primary">
                      Main call to action
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button variant="outlined" color="primary">
                      Secondary action
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Container>
          </div>
          <Container className={classes.cardGrid} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {cards.map(card => (
                <Grid item key={card} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image="https://source.unsplash.com/random"
                      title="Image title"
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        Heading
                      </Typography>
                      <Typography>
                        This is a media card. You can use this section to
                        describe the content.
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color="primary">
                        View
                      </Button>
                      <Button size="small" color="primary">
                        Edit
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </main>
        {/* Footer */}
        <footer className={classes.footer}>
          <Typography variant="h6" align="center" gutterBottom>
            Footer
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="textSecondary"
            component="p"
          >
            Something here to give the footer a purpose!
          </Typography>
          <Copyright />
        </footer>
        {/* End footer */}
      </React.Fragment>
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false
  },
  watchPosition: true,
  userDecisionTimeout: Infinity
})(withStyles(styles)(Album));
