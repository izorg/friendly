import path from "path";

import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { renderToStringWithData } from "@apollo/client/react/ssr";
import { ChunkExtractor, ChunkExtractorManager } from "@loadable/server";
import fetch from "cross-fetch";
import type { RequestHandler } from "express";
import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { Stats } from "webpack";

import App from "../../../components/App";
import { APOLLO_STATE_KEY } from "../../../components/ClientApolloProvider";

const development = process.env.NODE_ENV === "development";

let extractor: ChunkExtractor;

if (!development) {
  extractor = new ChunkExtractor({
    statsFile: path.join(__dirname, "../../client/loadable-stats.json"),
  });
}

const render: RequestHandler = async (req, res) => {
  if (development) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const stats = (res.locals.webpack.devMiddleware.stats as Stats).toJson();

    extractor = new ChunkExtractor({
      stats,
    });
  }

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({ fetch, uri: "http://localhost:3000/graphql" }),
    ssrMode: true,
  });

  const jsx = (
    <ApolloProvider client={client}>
      <ChunkExtractorManager extractor={extractor}>
        <StaticRouter location={req.url}>
          <App />
        </StaticRouter>
      </ChunkExtractorManager>
    </ApolloProvider>
  );

  const html = await renderToStringWithData(jsx);

  const initialState = client.extract();

  const scriptElements = extractor.getScriptElements((chunk) => {
    if (!chunk) {
      return;
    }

    return { type: "module" };
  });
  const styleElements = extractor.getStyleElements();

  const body = renderToStaticMarkup(
    <html>
      <head>
        <title>My App</title>
        <link
          href="https://www.shop-apotheke.com/pix/icons/favicon.ico"
          rel="shortcut icon"
          type="image/x-icon"
        />
        {styleElements}
      </head>
      <body>
        <div dangerouslySetInnerHTML={{ __html: html }} id="root" />
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(initialState) }}
          id={APOLLO_STATE_KEY}
          type="application/json"
        />
        {scriptElements}
      </body>
    </html>
  );

  res.send(body);
};

export default render;
