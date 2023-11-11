import React from "react";
import styles from "../styles/loader.module.css";
import cx from "classnames";

const Loader = () => {
  return (
    <div className={cx(styles["loader"])}>
      <div className={styles["lds-roller"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
