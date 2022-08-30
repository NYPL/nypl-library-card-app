import React from "react";
import styles from "./Loader.module.css";

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: LoaderProps): React.ReactNode | null =>
  isLoading && (
    <div className={styles.loaderContainer}>
      <div className={styles.loader} />
    </div>
  );

export default Loader;
