import React, { Component } from "react";
import Config from "../lib/utils/Config";
import Auth from "../lib/utils/Auth";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

export default class Map extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: null
    };
  }

  componentDidMount() {}

  render() {
    if (!Auth.isAuthenticated) {
      return <Typography>Not Authenticated</Typography>;
    }
    return (
      <img
        src={`https://atlas.microsoft.com/map/static/png?subscription-key=0NwqCNtU7nafdZvWWrHMjrCRhbprAN6ZNwKwlUVzeD0&api-version=1.0&layer=basic&style=main&zoom=15&center=${this.props.longitude},${this.props.latitude}`}
      />
    );
  }
}

Map.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
};
