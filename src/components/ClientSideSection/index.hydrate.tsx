import loadable, { loadableReady } from "@loadable/component";
import { hydrate } from "react-dom";

const ClientSideSectionHydrate = loadable(
  () => import(/* webpackChunkName: 'client-side-section' */ "./index"),
  {
    ssr: false,
  }
);

export default ClientSideSectionHydrate;

export const container = "client";

if (typeof window !== "undefined") {
  const node = document.getElementById(container);

  if (node) {
    void loadableReady(() => {
      hydrate(<ClientSideSectionHydrate />, node);
    });
  }
}
