import React, { PureComponent, Fragment } from "react";
import Axios from "axios";
import { server, config } from "../.env";
import Alert from "../components/alert";
import Modal from "../components/modal";
import Spinner from "../components/spinner";

export default class Products extends PureComponent {
  state = {
    products: [],
    total: 0,
    search: "",
    next: null,
    prev: null,
    curr_url: "/api/product/read",
    // CREATE PRODUCT
    createProductMessage: "",
    loader: "",
    is_visible: false,

    // update product
    productId: "",
    productName: "",
    productIsVisible: false,
    productDescription: "",
    updateStockMessage: "",

    // DElete Product
    deleteMessage: "",
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

  //   Create Product
  createProduct = (event) => {
    event.preventDefault();

    this.setState({
      loader: <Spinner />,
    });

    const params = new FormData();
    params.append("name", event.target.name.value);
    params.append("banner", event.target.banner.files[0]);
    params.append("is_visible", this.state.is_visible);
    params.append("description", event.target.description.value);

    Axios.post(server + "/api/product/create", params, config)
      .then((rsp) => {
        this.setState({
          loader: "",
          createProductMessage: (
            <Alert className="success" message={rsp.data.detail} />
          ),
        });
        this.readProducts(this.state.curr_url);
      })
      .catch((err) => {
        this.setState({
          loader: "",
          createProductMessage: (
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

  //   update Product

  updateProduct = (event) => {
    event.preventDefault();

    this.setState({
      loader: <Spinner />,
    });

    const params = new FormData();
    params.append("name", this.state.productName);
    params.append(
      "banner",
      event.target.banner.files[0] === undefined
        ? ""
        : event.target.banner.files[0]
    );
    params.append("is_visible", this.state.productIsVisible);
    params.append("description", this.state.productDescription);

    Axios.put(
      server + "/api/product/update/" + this.state.productId,
      params,
      config
    )
      .then((rsp) => {
        this.setState({
          loader: "",
          updateProductMessage: (
            <Alert className="success" message={rsp.data.detail} />
          ),
        });
        this.readProducts(this.state.curr_url);
      })
      .catch((err) => {
        this.setState({
          loader: "",
          updateProductMessage: (
            <Alert
              className="danger"
              message={String(err.response.data.detail)}
            />
          ),
        });
      });
  };

  //   Deleting products
  deleteProduct = () => {
    this.setState({
      loader: <Spinner />,
    });
    Axios.delete(server + "/api/product/delete/" + this.state.productId, config)
      .then((rsp) => {
        this.setState({
          deleteMessage: (
            <Alert className="success" message={rsp.data.detail} />
          ),
          products: this.state.products.filter(
            (data) => data.id !== this.state.productId
          ),
          loader: "",
        });
      })
      .catch((err) => {
        this.setState({
          loader: "",
          deleteMessage: (
            <Alert className="danger" message={err.response.data.detail} />
          ),
        });
      });
  };

  render() {
    const {
      total,
      products,
      next,
      prev,
      is_visible,
      loader,
      createProductMessage,
      updateProductMessage,
      productName,
      productIsVisible,
      productDescription,
      deleteMessage,
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
                  <div className="col-md-8">
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
                  <div className="col-md-4">
                    <button
                      className="btn btn-primary d-inline"
                      data-toggle="modal"
                      data-target="#createProduct"
                    >
                      <span className="pt-0">New Product</span>
                    </button>
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
              <span className="sub-text">Created At</span>
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
          {products.map((data, idx) => (
            <div className="nk-tb-item">
              <div className="nk-tb-col">
                <span className="tb-product">
                  <img src={server + data.banner} alt="" className="thumb" />
                  <span>{data.name}</span>
                </span>
              </div>
              <div className="nk-tb-col">
                <span className="tb-sub">{data.description}</span>
              </div>
              <div className="nk-tb-col">
                <span className="tb-sub">
                  {new Date(data.created).toDateString()}
                </span>
              </div>
              <div className="nk-tb-col">
                <span className="tb-sub">
                  {data.is_visible ? (
                    <span className="badge badge-success">Visible</span>
                  ) : (
                    <span className="badge badge-danger">Invisible</span>
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
                                  productId: data.id,
                                  productName: data.name,
                                  productIsVisible: data.is_visible,
                                  productDescription: data.description,
                                })
                              }
                              data-toggle="modal"
                              data-target="#updateModal"
                            >
                              <em className="icon ni ni-edit"></em>
                              <span>Edit Product</span>
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              onClick={() =>
                                this.setState({
                                  productId: data.id,
                                })
                              }
                              data-toggle="modal"
                              data-target="#deleteModal"
                            >
                              <em className="icon ni ni-trash"></em>
                              <span>Delete Product</span>
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
        {/* create product modal */}
        <Modal id="createProduct" title="Create New Product">
          <div className="modal-body">
            <form onSubmit={this.createProduct}>
              {createProductMessage}
              <div className="form-group">
                <label htmlFor="name" className="mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  required
                />
              </div>
              <div className="form-control-wrap">
                <label htmlFor="name" className="mb-1">
                  Product Banner
                </label>
                <div className="custom-file">
                  <input
                    type="file"
                    name="banner"
                    multiple=""
                    className="custom-file-input"
                    id="customFile"
                    required
                  />
                  <label className="custom-file-label" For="customFile">
                    Choose Banner file
                  </label>
                </div>
              </div>
              <div className="form-group mt-4">
                <label htmlFor="in_stock" className="mb-1">
                  Product Visibiity
                </label>
                <br />
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitch1"
                    checked={is_visible}
                    onChange={() =>
                      this.setState({
                        is_visible: is_visible ? false : true,
                      })
                    }
                  />
                  <label className="custom-control-label" For="customSwitch1">
                    {is_visible
                      ? "Product Is Visible"
                      : "Product is not visible"}
                  </label>
                </div>
              </div>
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
              <div className="form-group float-right">
                <button type="submit" className="btn btn-primary">
                  Add Product {loader}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* upate product modal */}
        <Modal id="updateModal" title="Update Product">
          <div className="modal-body">
            <form onSubmit={this.updateProduct}>
              {updateProductMessage}
              <div className="form-group">
                <label htmlFor="name" className="mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="productName"
                  value={productName}
                  onChange={this.onChange}
                  required
                />
              </div>
              <div className="form-control-wrap">
                <label htmlFor="name" className="mb-1">
                  Product Banner
                </label>
                <div className="custom-file">
                  <input
                    type="file"
                    name="banner"
                    multiple=""
                    className="custom-file-input"
                    id="customFile"
                  />
                  <label className="custom-file-label" For="customFile">
                    Choose Banner file
                  </label>
                </div>
              </div>
              <div className="form-group mt-4">
                <label htmlFor="in_stock" className="mb-1">
                  Product Visibiity
                </label>
                <br />
                <div className="custom-control custom-switch">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="customSwitch2"
                    checked={productIsVisible}
                    onChange={() =>
                      this.setState({
                        productIsVisible: productIsVisible ? false : true,
                      })
                    }
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customSwitch2"
                  >
                    {productIsVisible
                      ? "Product Is Visible"
                      : "Product is not visible"}
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="name" className="mb-1">
                  Product Descrition
                </label>
                <textarea
                  name="productDescription"
                  id="productDescription"
                  cols="30"
                  rows="5"
                  className="form-control"
                  value={productDescription}
                  onChange={this.onChange}
                  required
                ></textarea>
              </div>
              <div className="form-group float-right">
                <button type="submitr" className="btn btn-primary">
                  Update Product {loader}
                </button>
              </div>
            </form>
          </div>
        </Modal>

        {/* delete product */}
        {/* DELETE COUPON */}
        <Modal id="deleteModal" title="Delete Coupon" style={{ zIndex: 1200 }}>
          <div className="modal-body  text-center">
            {deleteMessage}
            <h5>Are you sure you want to delete?</h5>
            <div className="form-group mt-4">
              <button className="btn btn-primary mr-2" data-dismiss="modal">
                Go back
              </button>
              <button
                className="btn btn-danger"
                onClick={this.deleteProduct}
                data-dismiss="modal"
              >
                Continue {loader}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
