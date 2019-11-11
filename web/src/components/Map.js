import React, { Component } from "react";
import Config from "../lib/utils/Config";
import Auth from "../lib/utils/Auth";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

export class Friend extends Component {}

Friend.propTypes = {
  friendId: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
};

export class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: null
    };
  }

  componentDidMount() {
    this.fetchKey();
  }

  fetchKey() {
    if (Auth.isAuthenticated) {
      const apiUrl = `${Config.apiURL()}/config`;
      const headers = new Headers({
        Authorization: `Bearer ${Auth.getToken()}`
      });
      fetch(apiUrl, { headers })
        .then(result => {
          if (result.ok === true) return result.json();
          result.text().then(txt => console.log(txt));
          throw result;
        })
        .then(json => {
          this.setState({ key: json.maps_api_key });
        })
        .catch(e => {
          this.setState({ key: null });
        });
    }
  }

  render() {
    if (!Auth.isAuthenticated) {
      return <Typography>Not Authenticated</Typography>;
    }

    if (this.state.key === null) {
      return <Typography>No key available</Typography>;
    }

    const { longitude, latitude } = this.props;
    let pins = `&pins=default|coFF1493|la10 0|ls14||'${Auth.getLogin()}'${longitude} ${latitude}`;
    const dimensions = "&height=512&width=512";
    const zoom = "&zoom=13";

    React.Children.map(this.props.children, (child, i) => {
      pins += `|'${child.props.friendId}'${child.props.longitude} ${child.props.latitude}`;
    });
    return (
      <img
        alt=""
        src={`https://atlas.microsoft.com/map/static/png?subscription-key=${this.state.key}&api-version=1.0&layer=basic&style=main${zoom}${dimensions}&center=${this.props.longitude},${this.props.latitude}${pins}`}
      />
    );
  }
}

Map.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
};
