import React from "react";
import { useModal } from "@nypl/design-system-react-components";
import styles from "./Loader.module.css";

interface LoaderProps {
  isLoading: boolean;
}

const Loader = ({ isLoading }: LoaderProps) => {
  const { onOpen, Modal } = useModal();
  return (
    isLoading && (
      <Modal>
        <div className={styles.loader} />
      </Modal>
    )
  );
};

export default Loader;
