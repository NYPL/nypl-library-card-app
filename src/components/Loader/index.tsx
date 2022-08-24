import React from "react";
// import { Modal } from "@nypl/design-system-react-components";
// import styles from "./Loader.module.css";

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: LoaderProps) => isLoading && <p>LOADING!</p>;
// isLoading && (
//   <Modal className={styles.loaderContainer}>
//     <div className={styles.loader} />
//   </Modal>
// );

export default Loader;
