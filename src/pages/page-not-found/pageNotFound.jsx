import React from "react";
import { Link } from "react-router-dom";

export default function PageNotFound() {
  return (
    <div
      className="page-wrapper"
      id="main-wrapper"
      data-layout="vertical"
      data-sidebartype="full"
      data-sidebar-position="fixed"
      data-header-position="fixed"
    >
      <div className="position-relative min-vh-100 d-flex align-items-center justify-content-center">
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="row justify-content-center w-100">
            <div className="col-lg-4">
              <div className="text-center">
                <img
                  src="assets/images/404.webp"
                  alt=""
                  className="img-fluid"
                />
                <h1 className="fw-semibold mb-7 fs-9">Opps!!!</h1>
                <h4 className="fw-semibold  fs-4 mb-7">
                  This page you are looking for could not be found.
                </h4>
                <Link className="btn btn-primary" to="/">
                  Go Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
