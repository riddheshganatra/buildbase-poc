import Loader from "@/components/loader";
import axios from "axios";
import cx from "classnames";
import Link from "next/link";
import { useState } from "react";
import styles from "../../styles/login.module.css";
// const bootstrap = require("bootstrap");
// import bootstrap from "bootstrap";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormessage, setErrormessage] = useState("");

  // const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onButtonClick = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/signup", {
        email,
        password,
        type: "signup",
      });
      console.log("response.data", response.data);

      if (response.data.port) {
        window.location.href = `http://146.190.162.194:${response.data.port}/builder/auth/login`;
      }
    } catch (error: any) {
      setErrormessage(error?.response.data?.message || error.message);

      // import is done here to avoid error of "document is not defined"
      const bootstrap = require("bootstrap");
      const toast = new bootstrap.Toast("#liveToast");
      toast.show();
      console.log("error :>> ", error?.response.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className={cx(styles["form-signin"], "text-center", "mt-5")}>
        <form>
          <h1 className="h3 mb-3 fw-normal">Please Register</h1>

          <div className="form-floating">
            <input
              type="email"
              className="form-control mb-2"
              id="floatingInput"
              placeholder="name@example.com"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <label htmlFor="floatingInput">Email address</label>
          </div>
          <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <label htmlFor="floatingPassword">Password</label>
          </div>
          {/* <div className="form-floating">
            <input
              type="password"
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
            <label htmlFor="floatingPassword">Confirm Password</label>
          </div> */}

          {/* <div className={cx(styles.checkbox, "mb-3")}>
            <label>
              <input type="checkbox" value="remember-me" /> Remember me
            </label>
          </div> */}
          <button
            className="w-100 btn btn-lg btn-primary"
            type="button"
            onClick={onButtonClick}
          >
            Register
          </button>
        </form>
        <Link href="/auth/login" className="btn btn-link">
          Login
        </Link>
        {loading && <Loader />}

        <div className="toast-container position-fixed p-3 top-0">
          <div
            id="liveToast"
            className="toast"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="toast-header">
              {/* <img src="..." className="rounded" alt="..." /> */}
              <strong className="me-auto">Error</strong>
              {/* <small>2 secs ago</small> */}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="toast"
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">{errormessage}</div>
          </div>
        </div>
      </main>
    </>
  );
}
