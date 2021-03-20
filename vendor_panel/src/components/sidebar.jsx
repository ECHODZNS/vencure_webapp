import React, { PureComponent } from "react";
import { Link } from "react-router-dom";

export default class Sidebar extends PureComponent {
  state = {
    activeTab: window.location.href.split("/")[3],
  };

  setActiveTab = (activeTab) => {
    document.getElementById("products").classList.remove("active");
    this.setState({
      activeTab,
    });
  };

  render() {
    var { activeTab } = this.state;

    activeTab = activeTab === "" ? "/" : activeTab;

    return (
      <div
        className="nk-sidebar nk-sidebar-fixed is-light "
        data-content="sidebarMenu"
      >
        <div className="nk-sidebar-element nk-sidebar-head">
          <div className="nk-sidebar-brand mt-3">
            <a href="#" className="logo-link nk-sidebar-logo">
              <img
                className="logo-light logo-img"
                src="/images/logo.svg"
                alt="logo"
              />
              <img
                className="logo-dark logo-img"
                src="/images/logo.svg"
                alt="logo-dark"
              />
              <img
                className="logo-small logo-img logo-img-small"
                src="/images/logo.svg"
                alt="logo-small"
              />
            </a>
          </div>
          <div className="nk-menu-trigger mr-n2">
            <a
              href="#"
              className="nk-nav-toggle nk-quick-nav-icon d-xl-none"
              data-target="sidebarMenu"
            >
              <em className="icon ni ni-arrow-left"></em>
            </a>
            <a
              href="#"
              className="nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex"
              data-target="sidebarMenu"
            >
              <em className="icon ni ni-menu"></em>
            </a>
          </div>
        </div>
        <div className="nk-sidebar-element">
          <div className="nk-sidebar-content">
            <div className="nk-sidebar-menu" data-simplebar>
              <ul className="nk-menu">
                <li className="nk-menu-heading">
                  <h6 className="overline-title text-primary-alt">Dashboard</h6>
                </li>
                <li
                  className={
                    activeTab === "/"
                      ? "nk-menu-item active current-page"
                      : "nk-menu-item"
                  }
                  id="products"
                >
                  <Link
                    to="/"
                    className="nk-menu-link"
                    onClick={() => this.setActiveTab("/")}
                  >
                    <span className="nk-menu-icon">
                      <em className="icon ni ni-view-x2"></em>
                    </span>
                    <span className="nk-menu-text">Dashboard</span>
                  </Link>
                </li>
                <li
                  className={
                    activeTab === "/products"
                      ? "nk-menu-item active current-page"
                      : "nk-menu-item"
                  }
                >
                  <Link
                    to="/products"
                    className="nk-menu-link"
                    onClick={() => this.setActiveTab("/products")}
                  >
                    <span className="nk-menu-icon">
                      <em className="icon ni ni-package-fill"></em>
                    </span>
                    <span className="nk-menu-text">Products</span>
                  </Link>
                </li>

                <li
                  className={
                    activeTab === "/agreements"
                      ? "nk-menu-item active current-page"
                      : "nk-menu-item"
                  }
                >
                  <Link
                    to="/agreements"
                    className="nk-menu-link"
                    onClick={() => this.setActiveTab("/agreements")}
                  >
                    <span className="nk-menu-icon">
                      <em className="icon ni ni-notes-alt"></em>
                    </span>
                    <span className="nk-menu-text">Agreements</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
