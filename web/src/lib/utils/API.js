import Config from "../utils/Config";
import Auth from "./Auth";

class ApiHelper {
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
