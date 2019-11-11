import Config from "../utils/Config";
import Auth from "./Auth";

class ApiHelper {
  fetchSpeechToken(callback) {
    if (Auth.isAuthenticated) {
      const url = `${Config.apiURL()}/authorizeSpeech`;
      const options = {
        method: "GET",
        headers: new Headers({ Authorization: `Bearer ${Auth.getToken()}` })
      };
      fetch(url, options)
        .then(result => result.text())
        .then(token => callback(null, token))
        .catch(e => callback(e));
    }
  }
  reportLocation(coords) {
    if (Auth.isAuthenticated) {
      const url = `${Config.apiURL()}/reportLocation`;
      const { latitude, longitude } = coords;
      const body = JSON.stringify({ latitude, longitude });
      const headers = new Headers({
        Authorization: `Bearer ${Auth.getToken()}`
      });
      fetch(url, { method: "POST", body, headers })
        .then(result => console.log(result.statusText))
        .catch(e => console.log(e));
    }
  }
}

const API = new ApiHelper();
export default API;
