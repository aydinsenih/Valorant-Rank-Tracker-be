const axios = require("axios").default;
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");

axiosCookieJarSupport(axios);
let cookieJar = new tough.CookieJar();
axios.defaults.withCredentials = true;

module.exports = {
  findUserInfo,
};

function auth(username, password) {
  var data = JSON.stringify({
    client_id: "play-valorant-web-prod",
    nonce: 1,
    redirect_uri: "https://playvalorant.com/opt_in",
    response_type: "token id_token",
    scope: "account openid",
  });

  var config = {
    method: "post",
    url: "https://auth.riotgames.com/api/v1/authorization",
    headers: {
      Connection: "close",
      "Content-Type": "application/json",
    },
    data: data,
    jar: cookieJar,
    withCredentials: true,
  };

  return axios(config)
    .then(function (response) {
      return authWithCredentials(username, password);
    })
    .catch(function (error) {
      throw new Error(error);
    });
}

function authWithCredentials(username, password) {
  var data = JSON.stringify({
    type: "auth",
    username: username,
    password: password,
  });

  var config = {
    method: "put",
    url: "https://auth.riotgames.com/api/v1/authorization",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
    jar: cookieJar,
    withCredentials: true,
  };

  return axios(config)
    .then(function (response) {
      const user_token = response.data.response.parameters.uri.match(
        "access_token=(.*)&scope="
      );
      return entitlementsToken(user_token[1]);
    })
    .catch(function (error) {
      throw new Error("username or password incorrect.");
    });
}

function entitlementsToken(user_token) {
  var data = JSON.stringify({});

  var config = {
    method: "post",
    url: "https://entitlements.auth.riotgames.com/api/token/v1",
    headers: {
      Authorization: "Bearer " + user_token,
      "Content-Type": "application/json",
    },
    data: data,
    jar: cookieJar,
    withCredentials: true,
  };

  return axios(config)
    .then(function (response) {
      return userinfo(user_token, response.data.entitlements_token);
    })
    .catch(function (error) {
      throw new Error({
        error: { message: "entitlements token fetch error", err: error },
      });
    });
}

function userinfo(user_token, entitlements_token) {
  var data = JSON.stringify({});

  var config = {
    method: "post",
    url: "https://auth.riotgames.com/userinfo",
    headers: {
      Authorization: "Bearer " + user_token,
      "Content-Type": "application/json",
    },
    data: data,
    jar: cookieJar,
    withCredentials: true,
  };

  return axios(config)
    .then(function (response) {
      return {
        user_token: user_token,
        entitlements_token: entitlements_token,
        sub: response.data.sub,
        game_name: response.data.acct.game_name,
        tag_line: response.data.acct.tag_line,
      };
    })
    .catch(function (error) {
      throw new Error({
        error: { message: "user info fetch error", err: error },
      });
    });
}

function getMMR(user_token, entitlements_token, sub) {
  var config = {
    method: "get",
    url:
      "https://pd.NA.a.pvp.net/mmr/v1/players/" +
      sub +
      "/competitiveupdates?startIndex=0&endIndex=20",
    headers: {
      Authorization: "Bearer " + user_token,
      "X-Riot-Entitlements-JWT": entitlements_token,
    },
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      //console.log(error);
    });
}

function findUserInfo(username, password, next) {
  cookieJar = new tough.CookieJar();
  return auth(username, password)
    .then((response) => {
      return { response };
    })
    .catch((error) => {
      throw new Error(error);
    });
}
