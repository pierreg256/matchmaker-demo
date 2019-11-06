export class Config {
  constructor() {
    this.config = {
      protocol: process.env.protocol || "https",
      port: process.env.port || "",
      application: process.env.REACT_APP_APPLICATION || "##@#application##@#",
      environment: process.env.environment || "##@#environment##@#"
    };
  }

  describe() {
    console.log(JSON.stringify(this.config, null, 2));
    console.log(this.apiURL());
  }

  apiURL() {
    let { application, environment, protocol, port } = this.config;
    let portConfig = port === "" ? "" : `:${port}`;
    return `${protocol}://${environment}-${application}-function-app${portConfig}/api`;
  }
}
