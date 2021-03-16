import type { Express } from "express";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";

import { clientCompiler, serverCompiler } from "./compilers";
import webpackHotServerMiddleware from "./webpackHotServerMiddleware";

export default (app: Express): void => {
  app.use(
    webpackDevMiddleware(clientCompiler, {
      serverSideRender: true,
    })
  );
  app.use(webpackDevMiddleware(serverCompiler));

  app.use(webpackHotMiddleware(clientCompiler));
  app.use(webpackHotServerMiddleware(serverCompiler));
};
