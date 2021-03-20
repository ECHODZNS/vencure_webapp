import React, { PureComponent, Fragment } from "react";
import Axios from "axios";
import { server, config } from "../.env";
import Alert from "../components/alert";
import Modal from "../components/modal";
import Spinner from "../components/spinner";
import { format } from "date-fns";

export default class Products extends PureComponent {
  state = {
    products: [],
    total: 0,
    search: "",
    next: null,
    prev: null,
    curr_url: "/api/product/read",
    loader: "",

    // create agreement
    productId: "",
    createMessage: "",
  };

  //   Read products on load
  componentDidMount = () => {
    this.readProducts(this.state.curr_url);
  };

  //   Search handler
  search = () => {
    this.readProducts(this.state.url, this.state.search);
  };

  // Reading Product
  readProducts = (url, search = null) => {
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
          total: rsp.data.count,
          products: rsp.data.results,
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

  //   Create Agreement
  createAgreement = (event) => {
    event.preventDefault();

    this.setState({
      loader: <Spinner />,
    });

    var start_date = new Date(event.target.start_date.value);
    start_date = format(start_date, "yyyy-MM-dd");

    var end_date = new Date(event.target.end_date.value);
    end_date = format(end_date, "yyyy-MM-dd");

    const params = new FormData();
    params.append("price", event.target.price.value);
    params.append("start_date", start_date);
    params.append("end_date", end_date);
    params.append(
      "attachment",
      event.target.attachment.files[0] === undefined
        ? ""
        : event.target.attachment.files[0]
    );
    params.append("delivery", event.target.delivery.value);
    params.append("description", event.target.description.value);

    Axios.post(
      server + "/api/agreement/create/" + this.state.productId,
      params,
      config
    )
      .then((rsp) => {
        this.setState({
          loader: "",
          createMessage: (
            <Alert className="success" message={rsp.data.detail} />
          ),
        });
        this.readProducts(this.state.curr_url);
      })
      .catch((err) => {
        this.setState({
          loader: "",
          createMessage: (
            <Alert
              className="danger"
              message={String(err.response.data.detail)}
            />
          ),
        });
      });
  };

  //   on change state update
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      total,
      products,
      next,
      prev,
      loader,
      createMessage,
    } = this.state;

    return (
      <div className="nk-content-body">
        <div className="nk-block-head nk-block-head-sm">
          <div className="nk-block-between">
            <div className="nk-block-head-content">
              <h3 className="nk-block-title page-title">
                Products <small>({total})</small>
              </h3>
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

        <div className="nk-tb-list is-separate mb-3">
          <div className="nk-tb-item">
            <div className="nk-tb-col">
              <span className="sub-text">Product Name</span>
            </div>
            <div className="nk-tb-col">
              <span className="sub-text">Product Description</span>
            </div>
            <div className="nk-tb-col tb-col-lg">
              <span className="sub-text">Agreement Status</span>
            </div>
            <div className="nk-tb-col tb-col-lg">
              <span className="sub-text">Posted At</span>
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
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {products.map((data, idx) => (
            <div className="nk-tb-item">
              <div className="nk-tb-col">
                <span className="tb-product">
                  <img src={data.banner} alt="" className="thumb" />
                  <span>{data.name}</span>
                </span>
              </div>
              <div className="nk-tb-col">
                <span className="tb-sub">{data.description}</span>
              </div>
              <div className="nk-tb-col">
                <span className="tb-sub">
                  {data.vendor_status ? (
                    <span className="badge badge-success">Posted</span>
                  ) : (
                    <span className="badge badge-danger">Not Posted</span>
                  )}
                </span>
              </div>
              <div className="nk-tb-col">
                <span className="tb-sub">
                  {new Date(data.created).toDateString()}
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
                                  productId: data.id,
                                })
                              }
                              data-toggle="modal"
                              data-target="#postAgreement"
                            >
                              <em className="icon ni ni-edit"></em>
                              <span>Post Agreement</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>

        <nav aria-label="Page navigation example" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={prev === null ? "page-item disabled" : "page-item"}>
              <button
                className="page-link"
                onClick={() => this.readProducts(prev)}
                disabled={prev === null ? true : false}
              >
                Previous
              </button>
            </li>
            <li className={next === null ? "page-item disabled" : "page-item"}>
              <button
                className="page-link"
                href="#"
                onClick={() => this.readProducts(next)}
                disabled={next === null ? true : false}
              >
                {" "}
                Next
              </button>
            </li>
          </ul>
        </nav>

        {/* agreement post modal */}
        <Modal
          id="postAgreement"
          title="Post New Agreement"
          className="modal-lg"
        >
          <div className="modal-body">
            <form onSubmit={this.createAgreement}>
              {createMessage}
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="name" className="mb-1">
                      Price (INR)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="price"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="name" className="mb-1">
                      Delivery Type
                    </label>
                    <select
                      name="delivery"
                      id="delivery"
                      className="form-control"
                      required
                    >
                      <option value="1">Pickup By Manufecturer</option>
                      <option value="2">Delivered By Vendor</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="name" className="mb-1">
                      Agreement Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="name" className="mb-1">
                      Agreement End Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="end_date"
                      required
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-control-wrap">
                    <label htmlFor="name" className="mb-1">
                      Attachment (optional)
                    </label>
                    <div className="custom-file">
                      <input
                        type="file"
                        name="attachment"
                        multiple=""
                        className="custom-file-input"
                        id="customFile"
                      />
                      <label className="custom-file-label" For="customFile">
                        Choose attachment file
                      </label>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group">
                    <label htmlFor="name" className="mb-1">
                      Product Descrition
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      cols="30"
                      rows="5"
                      className="form-control"
                      required
                    ></textarea>
                  </div>
                </div>
                <div className="col-12">
                  <div className="form-group float-right">
                    <button type="submit" className="btn btn-primary">
                      Add Product {loader}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}
