import React from "react";
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import "../../../_metronic/_assets/sass/pages/error/error-5.scss";

export function ErrorPage5() {
  return (
    <div className="d-flex flex-column flex-root">
      <div
        className="error error-5 d-flex flex-row-fluid bgi-size-cover bgi-position-center"
        style={{
          backgroundImage: `url(${toAbsoluteUrl("/media/error/bg5.jpg")})`,
        }}
      >
        <div className="container d-flex flex-row-fluid flex-column justify-content-md-center p-12">
          <h1 className="error-title font-weight-boldest text-info mt-10 mt-md-0 mb-12">
            Oops!
          </h1>
          <p className="font-weight-boldest display-4">
            You don't have permission to access this page
          </p>
          <p className="font-size-h3">
            Please log in through{" "}
            <a
              href="http://sshr.smilaxglobal.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "underline" }}
            >
              here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
