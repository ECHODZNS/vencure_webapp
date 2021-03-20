import React, { PureComponent } from "react";

export default class Maintenance extends PureComponent {
  componentDidMount = () => {
    document.body.classList.remove("enlarge");
  };
  render() {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "150px",
          font: "20px Helvetica, sans-serif",
          color: "#364a63",
        }}
      >
        <article
          style={{
            display: "block",
            textAlign: "left",
            maxWidth: "650px",
            margin: "0 auto",
          }}
        >
          <h1 style={{ "font-size": "50px" }}>We&rsquo;ll be back soon!</h1>
          <div>
            <p>
              Sorry for the inconvenience but we&rsquo;re performing some
              maintenance at the moment. we&rsquo;ll be back online shortly!
            </p>
            <p>&mdash; Keeh Maintenance Team</p>
          </div>
        </article>
      </div>
    );
  }
}
