import { Route, Switch } from "react-router-dom";

import ClientSideSectionHydrate, {
  container as clientContainer,
} from "../ClientSideSection/index.hydrate";
import DataPageHydrate, {
  container as dataContainer,
} from "../DataPage/index.hydrate";
import HomePageHydrate, {
  container as homeContainer,
} from "../HomePage/index.hydrate";
import StaticPage from "../StaticPage";

import styles from "./styles.module.css";

const App = (): JSX.Element => {
  return (
    <>
      <h1 className={styles.test}>App</h1>
      <ul>
        <li>
          <a href="/">Home</a>
        </li>
        <li>
          <a href="/data">Data</a>
        </li>
        <li>
          <a href="/static">Static</a>
        </li>
      </ul>
      <Switch>
        <Route exact path="/(section1|section2)?">
          <div id={homeContainer}>
            <HomePageHydrate />
          </div>
        </Route>
        <Route path="/data">
          <div id={dataContainer}>
            <DataPageHydrate />
          </div>
        </Route>
        <Route path="/static">
          <StaticPage />
        </Route>
        <Route>
          <h2>404</h2>
        </Route>
      </Switch>
      <div id={clientContainer}>
        <ClientSideSectionHydrate />
      </div>
    </>
  );
};

export default App;
