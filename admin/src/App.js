import { React } from "react";
import { Admin, defaultTheme } from "react-admin";
import LoginAdmin from "./components/login/Login";
import { authProvider } from "./authProvider/authProvider";
import { Resource } from "react-admin";
import accounts from "./components/accounts";
import { dataProvider } from "./dataProvider/dataProvider";
import "./App.css";
import game from "./components/game";
import GroupIcon from "@mui/icons-material/Group";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const theme = {
  ...defaultTheme,
  palette: {
    mode: "dark",
  },
};
const App = () => {
  return (
    <Admin
      theme={theme}
      dataProvider={dataProvider}
      authProvider={authProvider}
      loginPage={LoginAdmin}
    >
      {(permissions) => (
        <>
          {permissions === "Admin" || permissions === "Moderator" ? (
            <>
              <Resource icon={GroupIcon} name="player" {...accounts} />
              <Resource icon={SportsEsportsIcon} name="game" {...game} />
            </>
          ) : null}
        </>
      )}
    </Admin>
  );
};

export default App;