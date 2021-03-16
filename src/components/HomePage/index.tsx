import { Link, Route, Switch } from "react-router-dom";

import styles from "./styles.module.css";

const HomePage = (): JSX.Element => {
  return (
    <>
      <h2 className={styles.test}>Home Page</h2>
      <p>I am a hydrated page</p>
      <ul>
        <li>
          <Link to="/section1">Route Section 1</Link>
        </li>
        <li>
          <Link to="/section2">Route Section 2</Link>
        </li>
      </ul>
      <Switch>
        <Route path="/section1">
          <p>Section 1</p>
        </Route>
        <Route path="/section2">
          <p>Section 2</p>
        </Route>
      </Switch>
    </>
  );
};

export default HomePage;
