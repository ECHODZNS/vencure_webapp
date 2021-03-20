import { BrowserRouter, Switch, Route } from "react-router-dom";
import SideBar from "../components/sidebar";
import TopBar from "../components/topbar";

import Dashboard from "../source/dashboard";
import Products from "../source/products";
import Agreements from "../source/agreements";
import Vendors from "../source/vendors";
import Settings from "../source/settings";

export default function DashboardRouter() {
  document.body.classList.add("npc-default");
  document.body.classList.add("has-sidebar");
  return (
    <BrowserRouter>
      <div className="nk-app-root">
        <div className="nk-main">
          <SideBar />
          <div className="nk-wrap ">
            <TopBar />
            <div className="nk-content ">
              <div className="container-fluid">
                <div className="nk-content-inner">
                  <Switch>
                    <Route path="/settings" component={Settings} />
                    <Route path="/vendors" component={Vendors} />
                    <Route path="/agreements" component={Agreements} />
                    <Route path="/products" component={Products} />
                    <Route path="/" component={Dashboard} />
                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}
