import { Switch, Route, BrowserRouter } from "react-router-dom";
import AuthRouter from "./routes/AuthRouter";
import DashboardRouter from "./routes/DashboardRouter";

// Maintenance Mode
import Maintenance from "./components/maintenance";

export default function App() {
  if (
    Date.parse(new Date()) - Date.parse(localStorage.tokenDate) >
    23 * 60 * 60 * 1000
  ) {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("tokenDate");
  }
  let login = localStorage.getItem("adminToken") === null ? false : true;
  let url = window.location.href.split("/")[3];

  // login = true;

  // let maintenanceMode = true;
  let maintenanceMode = false;
  return (
    <BrowserRouter>
      {maintenanceMode ? (
        url !== 4 ? (
          <Switch>
            <Route path="/" component={Maintenance} />
          </Switch>
        ) : (
          <Switch>
            {!login ? (
              <Route path="/" component={AuthRouter} />
            ) : (
              <Route path="/" component={DashboardRouter} />
            )}
          </Switch>
        )
      ) : (
        <Switch>
          {!login ? (
            <Route path="/" component={AuthRouter} />
          ) : (
            <Route path="/" component={DashboardRouter} />
          )}
        </Switch>
      )}
    </BrowserRouter>
  );
}
