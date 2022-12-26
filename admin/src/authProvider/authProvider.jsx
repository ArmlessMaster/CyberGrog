export const authProvider = {
  login: ({ email, password }) => {
    const request = new Request(
      `${process.env.REACT_APP_URL}api/player/login`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: new Headers({ "Content-Type": "application/json" }),
      }
    );

    return fetch(request)
      .then((response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(async ({ token }) => {
        const request1 = new Request(`${process.env.REACT_APP_URL}api/player`, {
          method: "GET",
          body: null,
          headers: new Headers({
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }),
        });
        const response = await fetch(request1);
        const json = await response.json();
        const role = json.data.role;
        if (role !== "Admin" && role !== "Moderator") {
          throw new Error("No access");
        } else {
          localStorage.setItem("permissions", role);
          localStorage.setItem("token", token);
        }
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    return Promise.resolve();
  },

  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  checkAuth: () => {
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },

  getPermissions: () => {
    const token = localStorage.getItem("token");
    const request = new Request(`${process.env.REACT_APP_URL}api/player`, {
      method: "GET",
      body: null,
      headers: new Headers({
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }),
    });
    return fetch(request)
      .then(async (response) => {
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.statusText);
        }
        const json = await response.json();
        const role = json.data.role;

        if (role !== "Admin" && role !== "Moderator") {
          localStorage.removeItem("token");
          localStorage.removeItem("permissions");
          throw new Error("No access");
        } else {
          localStorage.setItem("permissions", json.data.role);
          return role ? Promise.resolve(role) : Promise.reject();
        }
      })
      .catch(() => {
        throw new Error("Network error");
      });
  },
};