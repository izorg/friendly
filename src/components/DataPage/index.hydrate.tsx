import loadable, { loadableReady } from "@loadable/component";
import { hydrate } from "react-dom";

import ClientApolloProvider from "../ClientApolloProvider";

const DataPageHydrate = loadable(() => import("./index"));

export default DataPageHydrate;

export const container = "data";

if (typeof window !== "undefined") {
  const node = document.getElementById(container);

  if (node) {
    void loadableReady(() => {
      hydrate(
        <ClientApolloProvider>
          <DataPageHydrate />
        </ClientApolloProvider>,
        node
      );
    });
  }
}
