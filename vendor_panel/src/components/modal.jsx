import React from "react";

export default function modal(props) {
  return (
    <div className="modal fade" id={props.id} style={props.style}>
      <div className={props.className + " modal-dialog modal-dialog-centered"}>
        <div className="modal-content shadow-sm">
          <div className="modal-header p-4 border-0">
            <h5 className="pb-0 mb-0">{props.title}</h5>
            <span
              type="button"
              className="close text-danger"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </span>
          </div>
          {props.children}
        </div>
      </div>
    </div>
  );
}
