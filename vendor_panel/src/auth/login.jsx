import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Spinner from "../components/spinner";
import Alert from "../components/alert";
import { server, recaptcha_SITE_KEY } from "../.env";
import ReCAPTCHA from "react-google-recaptcha";

export default class Login extends PureComponent {
  state = {
    reCaptcha: null,
    config: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    loader: "",
    message: "",
    passwordType: "password",
  };
  onSubmit = async (event) => {
    event.preventDefault();

    await this.setState({
      loader: <Spinner />,
    });

    const params = {
      email: event.target.email.value,
      password: event.target.password.value,
      "g-recaptcha-response": this.state.reCaptcha,
    };

    Axios.post(server + "/api/auth/vendorLogin", params, this.state.config)
      .then((rsp) => {
        this.setState({
          loader: "",
          message: <Alert className="success" message={rsp.data.detail} />,
        });
        localStorage.setItem("token", rsp.data.payload.token);
        localStorage.setItem("username", rsp.data.payload.user);
        localStorage.setItem("tokenDate", new Date());
        window.location.href = "/";
      })
      .catch((err) => {
        this.setState({
          loader: "",
          message: (
            <Alert className="danger" message={err.response.data.detail} />
          ),
        });
      });
  };
  render() {
    const { loader, message, passwordType } = this.state;
    return (
      <div className="nk-wrap nk-wrap-nosidebar">
        <div className="nk-content ">
          <div className="nk-block nk-block-middle nk-auth-body  wide-xs">
            <div className="brand-logo pb-4 text-center">
              <Link to="/" className="logo-link">
                <img
                  className="logo-dark logo-img logo-img-lg"
                  src="/images/logo.svg"
                  alt="logo"
                />
              </Link>
            </div>
            <div className="card card-bordered">
              <div className="card-inner card-inner-lg">
                <div className="nk-block-head">
                  <div className="nk-block-head-content">
                    <h4 className="nk-block-title">Sign-In</h4>
                    <div className="nk-block-des">
                      <p>
                        Access the VenCure panel using your email and password.
                      </p>
                    </div>
                  </div>
                </div>
                <form onSubmit={this.onSubmit}>
                  {message}
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="default-01">
                        Email
                      </label>
                    </div>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter your email"
                      name="email"
                      autoFocus
                      required
                    />
                  </div>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">
                        Password
                      </label>
                    </div>
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
                  <div className="form-group">
                    <ReCAPTCHA
                      sitekey={recaptcha_SITE_KEY}
                      onChange={(reCaptcha) => this.setState({ reCaptcha })}
                    />
                  </div>
                  <div className="form-group">
                    <button className="btn btn-lg btn-primary btn-block">
                      Log In {loader}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="nk-footer text-center nk-auth-footer-full">
            <div className="container wide-lg">
              <div className="row">
                <div className="col-12">
                  <p className="text-soft">
                    &copy; {new Date().getFullYear()} VenCure. All Rights
                    Reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
