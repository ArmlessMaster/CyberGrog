import { authProvider } from "../authProvider/authProvider";

const apiUrl = process.env.REACT_APP_URL;

export const dataProvider = {
  getList: (resource, params) => {
    const token = localStorage.getItem("token");
    authProvider.getPermissions();
    let query = `/users`;
    if (resource === "player") {
      query = `/users`;
    } else if (resource === "game") {
      query = `/get`;
    }

    const key = resource;
    const request = new Request(apiUrl + `api/` + resource + query, {
      method: "GET",
      body: null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return fetch(request)
      .then(async (response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        const json = await response.json();
        const data = json[key];
        for (let i = 0; i < data.length; i++) {
          data[i].id = data[i]._id;
          delete data[i]._id;
        }
        return { data: data, total: data.length };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  getOne: async (resource, params) => {
    const token = localStorage.getItem("token");
    let query = `/get?_id=${params.id}`;
    const key = resource;

    const request = new Request(apiUrl + `api/` + resource + query, {
      method: "GET",
      body: null,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return fetch(request)
      .then(async (response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        const json = await response.json();
        console.log(json[key]);
        const data = json[key];
        data.id = data._id;
        delete data._id;
        return { data: data };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  update: async (resource, params) => {
    const token = localStorage.getItem("token");
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    let query = "";
    let body = {};
    const key = resource;
    if (resource === "player") {
      query = "/admin/update";
      body = { _id: params.id, role: params.data.role };
    }
    body = JSON.stringify(body);

    const request = new Request(apiUrl + `api/` + resource + query, {
      method: "PUT",
      body: body,
      headers: headers,
    });
    return fetch(request)
      .then(async (response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }

        const json = await response.json();
        const data = json[key];
        data.id = data._id;
        delete data._id;
        return { data: data };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  delete: async (resource, params) => {
    const token = localStorage.getItem("token");
    let query = ``;
    if (resource === "player") {
      query = `/admin/delete`;
    } else if (resource === "game") {
      query = `/delete`;
    }
    const key = resource;
    console.log(params.previousData.gameId);
    let body = { _id: params.id, gameId: params.previousData.gameId };
    body = JSON.stringify(body);
    const request = new Request(apiUrl + `api/` + resource + query, {
      method: "DELETE",
      body: body,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return fetch(request)
      .then(async (response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        const json = await response.json();
        console.log(json);
        const data = json[key];
        data.id = data._id;
        delete data._id;
        return { data: data };
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },
};