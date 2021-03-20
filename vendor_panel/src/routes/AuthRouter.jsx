import { BrowserRouter, Switch, Route } from "react-router-dom";
import Login from "../auth/login";

export default function AuthRouter() {
  document.body.classList.add("npc-default");
  document.body.classList.add("pg-auth");
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}
