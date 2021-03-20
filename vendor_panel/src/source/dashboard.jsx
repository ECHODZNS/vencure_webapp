import React, { PureComponent } from "react";
import Axios from "axios";
import { server, config } from "../.env";
import Alert from "../components/alert";
import Modal from "../components/modal";
import Spinner from "../components/spinner";
import axios from "axios";

export default class Dashboard extends PureComponent {
  state = {
    running_agreements: 0,
    expiring_agreements: 0,
    counter_agreements: 0,
    agreements: 0,
    loader: "",
    isLoaded: false,
  };

  componentDidMount = async () => {
    this.setState({
      loader: <Spinner />,
    });
    await axios
      .get(server + "/api/vendor/vendorDashboard", config)
      .then((rsp) => {
        this.setState({
          running_agreements: rsp.data.payload.running_agreements,
          expiring_agreements: rsp.data.payload.expiring_agreements,
          counter_agreements: rsp.data.payload.counter_agreements,
          agreements: rsp.data.payload.agreements,
          isLoaded: true,
        });
      });
  };

  render() {
    const {
      loader,
      isLoaded,
      running_agreements,
      expiring_agreements,
      counter_agreements,
      agreements,
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
          <div className="row">
            {/* Running Agreements */}
            <div className="col-md-4 my-3">
              <div className="nk-download">
                <div className="data">
                  <div className="thumb">
                    <img src="/images/icons/file-type-doc.svg" alt="" />
                  </div>
                  <div className="info">
                    <h6 className="title">
                      <span className="name">Running Agreements</span>
                    </h6>
                    <div className="meta">
                      <span className="version">
                        <span className="text-soft">Agreements: </span>{" "}
                        <span>{isLoaded ? running_agreements : loader}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Counter Soon */}
            <div className="col-md-4 my-3">
              <div className="nk-download">
                <div className="data">
                  <div className="thumb">
                    <img src="/images/icons/file-type-doc.svg" alt="" />
                  </div>
                  <div className="info">
                    <h6 className="title">
                      <span className="name">Counter Agreement</span>
                    </h6>
                    <div className="meta">
                      <span className="version">
                        <span className="text-soft">Agreements: </span>
                        <span>{isLoaded ? counter_agreements : loader}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Expiring Soon */}
            <div className="col-md-4 my-3">
              <div className="nk-download">
                <div className="data">
                  <div className="thumb">
                    <img src="/images/icons/file-type-doc.svg" alt="" />
                  </div>
                  <div className="info">
                    <h6 className="title">
                      <span className="name">Expiring Soon</span>
                    </h6>
                    <div className="meta">
                      <span className="version">
                        <span className="text-soft">Agreements: </span>{" "}
                        <span>{isLoaded ? expiring_agreements : loader}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Expiring Soon */}
            <div className="col-md-4 my-3">
              <div className="nk-download">
                <div className="data">
                  <div className="thumb">
                    <img src="/images/icons/file-type-doc.svg" alt="" />
                  </div>
                  <div className="info">
                    <h6 className="title">
                      <span className="name">Total Agreement</span>
                    </h6>
                    <div className="meta">
                      <span className="version">
                        <span className="text-soft">Agreements: </span>{" "}
                        <span>{isLoaded ? agreements : loader}</span>
                      </span>
                    </div>
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
