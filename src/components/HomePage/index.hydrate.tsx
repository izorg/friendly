import loadable, { loadableReady } from "@loadable/component";
import { hydrate } from "react-dom";
import { BrowserRouter } from "react-router-dom";

import ClientApolloProvider from "../ClientApolloProvider";

const HomePageHydrate = loadable(() => import("./index"));

export default HomePageHydrate;

export const container = "home";

if (typeof window !== "undefined") {
  const node = document.getElementById(container);

  if (node) {
    void loadableReady(() => {
      hydrate(
        <BrowserRouter>
          <ClientApolloProvider>
            <HomePageHydrate />
          </ClientApolloProvider>
        </BrowserRouter>,
        node
      );
    });
  }
}
