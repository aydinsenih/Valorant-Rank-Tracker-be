const axios = require("axios").default;
const axiosCookieJarSupport = require("axios-cookiejar-support").default;
const tough = require("tough-cookie");

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();
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
      console.log(error);
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
      return {
        error: { message: "username or password incorrect" },
      };
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
      console.log(error);
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
      return getMMR(user_token, entitlements_token, response.data.sub);
    })
    .catch(function (error) {
      console.log(error);
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
      console.log(error);
    });
}

function findUserInfo(username, password) {
  return auth(username, password).then((response) => {
    return { data: response };
  });
}
