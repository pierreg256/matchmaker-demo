import Config from "../utils/Config";

class Authentication {
  constructor() {
    this.token = localStorage.getItem("token");
    this.isAuthenticated = this.token !== null;
  }

  signup(login, password, cb) {
    const url = `${Config.apiURL()}/signup`;
    let headers = new Headers();
    headers.append("content-type", "application/json");

    let init = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ login, password })
    };

    fetch(url, init)
      .then(result => result.json())
      .then(json => console.log(json))
      .catch(e => console.log(e));
  }
  signin(login, password, cb) {
    const url = `${Config.apiURL()}/signin/${login}`;
    let headers = new Headers();
    headers.append("content-type", "application/json");

    let init = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ login, password })
    };

    fetch(url, init)
      .then(result => result.json())
      .then(json => {
        localStorage.setItem("token", json.token);
        this.isAuthenticated = true;
        cb(null, json);
      })
      .catch(e => cb(e));
  }
}

const Auth = new Authentication();
export default Auth;
