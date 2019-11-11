import Config from "../utils/Config";

class Authentication {
  constructor() {
    this.token = localStorage.getItem("token");
    this.isAuthenticated = this.token !== null;
    this.login = localStorage.getItem("login");
  }

  refreshStatus(login, token) {
    localStorage.setItem("token", token);
    this.token = token;
    localStorage.setItem("login", login);
    this.login = login;
    this.isAuthenticated = this.token !== null;
  }

  getToken() {
    return this.token;
  }

  getLogin() {
    return this.login;
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

    localStorage.removeItem("token");
    localStorage.removeItem("login");
    this.isAuthenticated = false;
    fetch(url, init)
      .then(result => result.json())
      .then(json => {
        this.refreshStatus(login, json.token);
        cb(null, json);
      })
      .catch(e => cb(e));
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
        this.refreshStatus(login, json.token);
        cb(null, json);
      })
      .catch(e => cb(e));
  }

  signout() {
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    this.isAuthenticated = false;
  }
}

const Auth = new Authentication();
export default Auth;
