import React, { PureComponent } from "react";
import Axios from "axios";
import { server, config } from "../.env";
import Alert from "../components/alert";
import Modal from "../components/modal";
import Spinner from "../components/spinner";

export default class Vendors extends PureComponent {
  state = {
    vendors: [],
    search: "",
    next: null,
    prev: null,
    curr_url: "/api/vendor/read",
    loader: "",
    message: "",

    // update User
    UserId: "",
    UserStatus: true,
    updateMessage: "",
    passwordType: "password",

    // Block/Unblock User
    statusMessage: "",
  };

  componentDidMount = () => {
    this.readVendors(this.state.curr_url);
  };

  search = () => {
    this.readVendors(this.state.url, this.state.search);
  };

  readVendors = (url, search = null) => {
    this.setState({
      loader: <Spinner />,
      curr_url: url,
    });

    this.setState({ url });
    url = search == null ? server + url : server + url + "?search=" + search;

    Axios.get(url, config)
      .then((rsp) => {
        this.setState({
          loader: null,
          vendors: rsp.data.results,
          total_Vendors: rsp.data.count,
          next:
            rsp.data.next == null
              ? null
              : rsp.data.next.replace(/^.*\/\/[^\/]+/, ""),
          prev:
            rsp.data.previous == null
              ? null
              : rsp.data.previous.replace(/^.*\/\/[^\/]+/, ""),
        });
      })
      .catch((error) => {
        this.setState({
          loader: null,
        });
      });
  };

  updatePassword = (event) => {
    event.preventDefault();
    this.setState({
      loader: <Spinner />,
    });

    const params = {
      password: event.target.password.value,
    };

    Axios.post(
      server + "/api/vendor/update_password/" + this.state.UserId,
      params,
      config
    )
      .then((rsp) => {
        this.setState({
          loader: "",
          updateMessage: (
            <Alert className="success" message={rsp.data.detail} />
          ),
        });
        this.readVendors(this.state.curr_url);
      })
      .catch((err) => {
        this.setState({
          loader: "",
          updateMessage: (
            <Alert
              className="danger"
              message={String(err.response.data.detail)}
            />
          ),
        });
      });
  };

  UpdateUserStatus = () => {
    const params = {
      status: this.state.UserStatus,
    };
    this.setState({
      loader: <Spinner />,
    });

    Axios.post(
      server + "/api/vendor/update_vendor/" + this.state.UserId,
      params,
      config
    )
      .then((rsp) => {
        this.setState({
          loader: "",
          statusMessage: (
            <Alert className="success" message={rsp.data.detail} />
          ),
        });
        this.readVendors(this.state.curr_url);
      })
      .catch((err) => {
        this.setState({
          loader: "",
          statusMessage: (
            <Alert
              className="danger"
              message={String(err.response.data.detail)}
            />
          ),
        });
      });
  };

  render() {
    const {
      vendors,
      next,
      prev,
      loader,
      updateMessage,
      statusMessage,
      passwordType,
    } = this.state;

    return (
      <div className="nk-content-body">
        <div className="nk-block-head nk-block-head-sm">
          <div className="nk-block-between">
            <div className="nk-block-head-content">
              <h3 className="nk-block-title page-title">Vendors</h3>
            </div>
            <div className="nk-block-head-content">
              <div className="toggle-wrap nk-block-tools-toggle">
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-row justify-content-end">
                      <div className="col-8">
                        <input
                          type="text"
                          className="form-control pl-1 w-100"
                          onChange={(event) =>
                            this.setState({
                              search: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-4">
                        <button
                          className="btn btn-primary"
                          onClick={this.search}
                        >
                          Search {loader}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="nk-block">
          <div className="nk-tb-list is-separate mb-3">
            <div className="nk-tb-item">
              <div className="nk-tb-col tb-col-md">
                <span className="sub-text">Vendor Email</span>
              </div>
              <div className="nk-tb-col tb-col-md">
                <span className="sub-text">Vendor Name</span>
              </div>
              <div className="nk-tb-col tb-col-md">
                <span className="sub-text">Status</span>
              </div>
              <div className="nk-tb-col nk-tb-col-tools">
                <ul className="nk-tb-actions gx-1 my-n1">
                  <li>
                    <div className="drodown">
                      <a
                        href="#"
                        className="dropdown-toggle btn btn-icon btn-trigger mr-n1"
                        data-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <em className="icon ni ni-more-h"></em>
                      </a>
                      {/* <div className="dropdown-menu dropdown-menu-right">
                      <ul className="link-list-opt no-bdr">
                        <li>
                          <a href="#">
                            <em className="icon ni ni-mail"></em>
                            <span>Send Email to All</span>
                          </a>
                        </li>
                      </ul>
                    </div> */}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {vendors.map((data, idx) => (
              <div className="nk-tb-item">
                <div className="nk-tb-col">
                  <span className="tb-sub">{data.email}</span>
                </div>
                <div className="nk-tb-col">
                  <span className="tb-sub">{data.name}</span>
                </div>
                <div className="nk-tb-col">
                  <span className="tb-sub">
                    {data.is_verified ? (
                      <span className="badge badge-success">Active</span>
                    ) : (
                      <span className="badge badge-danger">Blocked</span>
                    )}
                  </span>
                </div>
                <div className="nk-tb-col nk-tb-col-tools">
                  <ul className="nk-tb-actions gx-1 my-n1">
                    <li className="mr-n1">
                      <div className="dropdown">
                        <a
                          href="#"
                          className="dropdown-toggle btn btn-icon btn-trigger"
                          data-toggle="dropdown"
                        >
                          <em className="icon ni ni-more-h"></em>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <a
                                href="#"
                                onClick={() =>
                                  this.setState({
                                    UserId: data.id,
                                  })
                                }
                                data-toggle="modal"
                                data-target="#updateModal"
                              >
                                <span>Update Password</span>
                              </a>
                            </li>
                            {data.is_verified ? (
                              <li>
                                <a
                                  href="#"
                                  onClick={() =>
                                    this.setState({
                                      UserId: data.id,
                                      UserStatus: data.is_verified
                                        ? false
                                        : true,
                                      statusMessage: "",
                                    })
                                  }
                                  data-toggle="modal"
                                  data-target="#updateStatusModal"
                                >
                                  <span>Block Vendor</span>
                                </a>
                              </li>
                            ) : (
                              <li>
                                <a
                                  href="#"
                                  onClick={() =>
                                    this.setState({
                                      UserId: data.id,
                                      UserStatus: data.is_verified
                                        ? false
                                        : true,
                                      statusMessage: "",
                                    })
                                  }
                                  data-toggle="modal"
                                  data-target="#updateStatusModal"
                                >
                                  <span>Unblock Vendor</span>
                                </a>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        <nav aria-label="Page navigation example" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={prev === null ? "page-item disabled" : "page-item"}>
              <button
                className="page-link"
                onClick={() => this.readVendors(prev)}
                disabled={prev === null ? true : false}
              >
                Previous
              </button>
            </li>
            <li className={next === null ? "page-item disabled" : "page-item"}>
              <button
                className="page-link"
                href="#"
                onClick={() => this.readVendors(next)}
                disabled={next === null ? true : false}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        <Modal id="updateModal" title="Reset Password">
          <div className="modal-body">
            <form onSubmit={this.updatePassword}>
              {updateMessage}
              <div className="form-group">
                <div className="form-control-wrap">
                  <a
                    href="#"
                    className="form-icon form-icon-right passcode-switch"
                    onClick={() =>
                      this.setState({
                        passwordType:
                          passwordType === "password" ? "text" : "password",
                      })
                    }
                  >
                    {passwordType === "password" ? (
                      <em className="icon-show icon ni ni-eye"></em>
                    ) : (
                      <em className="icon-show icon ni ni-eye-off"></em>
                    )}
                  </a>
                  <input
                    type={passwordType}
                    className="form-control form-control-lg"
                    placeholder="Enter your password"
                    name="password"
                    required
                  />
                </div>
              </div>
              <div className="form-group float-right">
                <button className="btn btn-primary">
                  Reset Password {loader}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        <Modal
          id="updateStatusModal"
          title={this.state.UserStatus ? "Unblock User" : "Block User"}
        >
          <div className="modal-body">
            <form onSubmit={this.UpdateUserStatus} className="text-center">
              {statusMessage}
              <h5>
                Are you sure you want to{" "}
                {this.state.UserStatus ? "Unblock" : "Block"}?
              </h5>
              <div className="form-group mt-4">
                <button className="btn btn-dark mr-2" data-dismiss="modal">
                  Go back
                </button>
                <button
                  className="btn btn-danger"
                  onClick={this.UpdateUserStatus}
                  data-dismiss="modal"
                >
                  Continue {loader}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}
