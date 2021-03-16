import styles from "./styles.module.css";

const ClientSideSection = (): JSX.Element => (
  <>
    <h2 className={styles.test}>Client Side Section</h2>
    <p>I am supposed to render only on client side!</p>
  </>
);

export default ClientSideSection;
