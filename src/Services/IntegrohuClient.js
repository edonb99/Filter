import axios from "axios";

class IntegrohuClient {
  static team_id = 5;

  static client;

  static token;

  static integrohu = "https://integra2.digitalflow.dev";

  // static integrohu = 'https://integra3.digitalflow.dev';

  static api_base = `${IntegrohuClient.integrohu}/api/`;

  static api() {
    if (!IntegrohuClient.client) {
      IntegrohuClient.client = axios.create({
        baseURL: IntegrohuClient.api_base,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
    }

    return IntegrohuClient.client;
  }

  static async getFilters() {
    return IntegrohuClient.api().get("filterable");
  }
}

export default IntegrohuClient;
