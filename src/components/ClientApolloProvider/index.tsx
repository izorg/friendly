import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { NormalizedCacheObject } from "@apollo/client/cache/inmemory/types";
import { ReactNode } from "react";

export const APOLLO_STATE_KEY = "__APOLLO_STATE__";

let client: ApolloClient<unknown>;

const getClient = (): ApolloClient<unknown> => {
  if (client) {
    return client;
  }

  const node = document.getElementById(APOLLO_STATE_KEY);

  if (!node) {
    throw new Error(`No script with id ${APOLLO_STATE_KEY}`);
  }

  if (!node.textContent) {
    throw new Error(`No initial state`);
  }

  const cache = new InMemoryCache();

  if (node && node.textContent) {
    try {
      cache.restore(JSON.parse(node.textContent) as NormalizedCacheObject);
    } catch (e) {
      throw new Error("Unable to restore initial state");
    }
  }

  return new ApolloClient({
    cache,
    uri: "http://localhost:3000/graphql",
  });
};

type ClientApolloProviderProps = {
  children: ReactNode;
};

const ClientApolloProvider = ({
  children,
}: ClientApolloProviderProps): JSX.Element => (
  <ApolloProvider client={getClient()}>{children}</ApolloProvider>
);

export default ClientApolloProvider;
