import React, { PureComponent } from "react";
import Axios from "axios";
import { server, config } from "../.env";
import Alert from "../components/alert";
import Modal from "../components/modal";
import Spinner from "../components/spinner";
import axios from "axios";

export default class Dashboard extends PureComponent {
  state = {
    live_products: 0,
    offline_products: 0,
    products: 0,
    running_agreements: 0,
    expiring_agreements: 0,
    counter_agreements: 0,
    agreements: 0,
    vendors: 0,
    loader: "",
    isLoaded: false,
    Agreements: [],
  };

  componentDidMount = async () => {
    this.setState({
      loader: <Spinner />,
    });
    await axios
      .get(server + "/api/vendor/adminDashboard", config)
      .then((rsp) => {
        this.setState({
          live_products: rsp.data.payload.live_products,
          offline_products: rsp.data.payload.offline_products,
          products: rsp.data.payload.products,
          running_agreements: rsp.data.payload.running_agreements,
          expiring_agreements: rsp.data.payload.expiring_agreements,
          counter_agreements: rsp.data.payload.counter_agreements,
          agreements: rsp.data.payload.agreements,
          vendors: rsp.data.payload.vendors,
          isLoaded: true,
        });
      });
    await Axios.get(server + "/api/agreement/read", config)
      .then((rsp) => {
        this.setState({
          Agreements: rsp.data.results,
        });
      })
      .catch((error) => {
        this.setState({
          loader: null,
        });
      });
  };

  render() {
    const {
      loader,
      isLoaded,
      products,
      live_products,
      offline_products,
      running_agreements,
      expiring_agreements,
      counter_agreements,
      agreements,
      Agreements,
      vendors,
    } = this.state;
    return (
      <div className="nk-content-body">
        <div className="nk-block-head nk-block-head-sm">
          <div className="nk-block-between">
            <div className="nk-block-head-content">
              <h3 className="nk-block-title page-title">Dashboard</h3>
            </div>
            <div className="nk-block-head-content"></div>
          </div>
        </div>
        <div className="nk-block">
          <div className="row g-gs">
            <div className="col-lg-8">
              {/* Products */}
              <div className="row">
                <div className="col-md-6 my-3">
                  <div className="nk-download">
                    <div className="data">
                      <div className="thumb">
                        <img src="./images/icons/product-pp.svg" alt="" />
                      </div>
                      <div className="info">
                        <h6 className="title">
                          <span className="name">Products</span>
                        </h6>
                        <div className="meta">
                          <span className="version">
                            <span className="text-soft">Total Products: </span>{" "}
                            <span>{isLoaded ? products : loader}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Agreements */}
                <div className="col-md-6 my-3">
                  <div className="nk-download">
                    <div className="data">
                      <div className="thumb">
                        <img src="/images/icons/profile.svg" alt="" />
                      </div>
                      <div className="info">
                        <h6 className="title">
                          <span className="name">Vendors</span>
                        </h6>
                        <div className="meta">
                          <span className="version">
                            <span className="text-soft">Total Vendors: </span>{" "}
                            <span>{isLoaded ? vendors : loader}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 my-3">
                  <div className="card h-100">
                    <div className="card-inner">
                      <div className="card-title-group mb-2">
                        <div className="card-title">
                          <h6 className="title">Agreements Statistics</h6>
                        </div>
                      </div>
                      <ul className="nk-store-statistics">
                        <li className="item">
                          <div className="primary">
                            <div className="title">Running Agreements</div>
                            <span>
                              {isLoaded ? running_agreements : loader}
                            </span>
                          </div>
                          <em className="icon bg-primary-dim ni ni-file-text"></em>
                        </li>
                        <li className="item">
                          <div className="primary">
                            <div className="title">Counter Agreements</div>
                            <span>
                              {isLoaded ? counter_agreements : loader}
                            </span>
                          </div>
                          <em className="icon bg-primary-dim ni ni-file-text"></em>
                        </li>
                        <li className="item">
                          <div className="primary">
                            <div className="title">Expiring Soon</div>
                            <span>
                              {isLoaded ? expiring_agreements : loader}
                            </span>
                          </div>
                          <em className="icon bg-primary-dim ni ni-file-text"></em>
                        </li>
                        <li className="item">
                          <div className="primary">
                            <div className="title">Total Agreements</div>
                            <span>{isLoaded ? agreements : loader}</span>
                          </div>
                          <em className="icon bg-primary-dim ni ni-file-text"></em>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Vendors */}
            <div className="col-lg-4 my-3">
              <div className="card h-100">
                <div className="card-inner">
                  <div className="card-title-group mb-2">
                    <div className="card-title">
                      <h6 className="title">Recent Agreements</h6>
                    </div>
                  </div>
                  <div className="nk-tb-list is-separate mb-3 mt-4">
                    <div className="nk-tb-item">
                      <div className="nk-tb-col shadow-sm">
                        <b className="sub-text">Product Name</b>
                      </div>
                      <div className="nk-tb-col shadow-sm">
                        <b className="sub-text">Vendor Name</b>
                      </div>
                      <div className="nk-tb-col shadow-sm">
                        <b className="sub-text">Price</b>
                      </div>
                    </div>
                    {Agreements.map((data, idx) =>
                      idx < 5 ? (
                        <div className="nk-tb-item" key={idx}>
                          <div className="nk-tb-col shadow-sm">
                            <span className="sub-text">
                              {data.product_name}
                            </span>
                          </div>
                          <div className="nk-tb-col shadow-sm">
                            <span className="sub-text">{data.vendor_name}</span>
                          </div>
                          <div className="nk-tb-col shadow-sm">
                            <span className="sub-text">₹ {data.price}</span>
                          </div>
                        </div>
                      ) : (
                        ""
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
