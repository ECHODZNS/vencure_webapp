import React, { PureComponent } from "react";
import Axios from "axios";
import Spinner from "../components/spinner";
import Alert from "../components/alert";
import { server, config } from "../.env";

export default class Settings extends PureComponent {
  state = {
    message: "",
    loader: "",
  };

  updatePassword = (event) => {
    event.preventDefault();
    var old_password = event.target.old_password.value;
    var new_password = event.target.new_password.value;
    var cnf_password = event.target.cnf_password.value;

    if (new_password !== cnf_password) {
      this.setState({
        message: <Alert className="danger" message="Passwords not matched" />,
      });
      return;
    }

    this.setState({
      loader: <Spinner />,
    });

    const params = {
      old_password,
      new_password,
    };

    Axios.post(server + "/api/auth/updatePassword", params, config)
      .then((rsp) => {
        this.setState({
          message: <Alert className="success" message={rsp.data.detail} />,
          loader: "",
        });
      })
      .catch((err) => {
        this.setState({
          message: (
            <Alert className="danger" message={err.response.data.detail} />
          ),
          loader: "",
        });
      });
  };

  render() {
    const { loader, message } = this.state;
    return (
      <div className="nk-content-wrap">
        <div className="nk-block-head nk-block-head-lg">
          <div className="nk-block-between-md g-4">
            <div className="nk-block-head-content">
              <h3>Account Settings</h3>
            </div>
          </div>
        </div>
        <div className="nk-block">
          <div className="card card-bordered">
            <ul className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
              <li className="nav-item active current-page">
                <a href="#" className="nav-link active">
                  <em className="icon ni ni-lock-alt-fill"></em>
                  <span>Security Settings</span>
                </a>
              </li>
            </ul>
            <div className="card-inner card-inner-lg">
              <div className="nk-block-head">
                <div className="nk-block-between">
                  <div className="nk-block-head-content">
                    <h4 className="nk-block-title">Change Password</h4>
                    <div className="nk-block-des">
                      <p>
                        These settings are helps you keep your account secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="nk-block">
                <div className="card">
                  <div className="card-inner-group">
                    <div className="nk-block-actions flex-shrink-sm-0">
                      <form onSubmit={this.updatePassword}>
                        {message}
                        <div className="form-group">
                          <label htmlFor="old_password" className="mb-1">
                            Old Password
                          </label>
                          <input
                            type="password"
                            name="old_password"
                            id="old_password"
                            className="form-control"
                            placeholder="Enter your last password"
                            requred
                            autoFocus={true}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="old_password" className="mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            name="new_password"
                            id="new_password"
                            className="form-control"
                            placeholder="Enter new password"
                            requred
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="cnf_password" className="mb-1">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            name="cnf_password"
                            id="cnf_password"
                            className="form-control"
                            placeholder="Confirm your new password"
                            requred
                          />
                        </div>
                        <div className="form-group float-right">
                          <button type="submit" className="btn btn-primary">
                            Update Password {loader}
                          </button>
                        </div>
                      </form>
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
