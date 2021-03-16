// Original idea https://github.com/60frames/webpack-hot-server-middleware
/* eslint-disable  */
import path from "path";

import { NextFunction, Request, RequestHandler, Response } from "express";
import sourceMapSupport from "source-map-support";
import { Compiler, Stats, WebpackError } from "webpack";

// https://stackoverflow.com/a/17585470
const requireFromString = (src: string, filename: string) => {
  const Module = module.constructor;

  // @ts-ignore
  const m = new Module();

  m._compile(src, filename);

  return m.exports;
};

const getFilename = (serverStats: Stats, outputPath: string) => {
  const assetsByChunkName = serverStats.toJson().assetsByChunkName;

  const filename = assetsByChunkName?.main.find((asset) =>
    asset.endsWith(".js")
  );

  if (!filename) {
    throw new Error("No server file");
  }

  return path.join(outputPath, filename);
};

const getServerRenderer = (filename: string, buffer: Buffer) => {
  const serverRenderer = requireFromString(buffer.toString(), filename).default;

  if (typeof serverRenderer !== "function") {
    throw new Error(
      "The 'server' compiler must export a function in the form of `(options) => (req, res, next) => void`"
    );
  }

  return serverRenderer;
};

const installSourceMapSupport = (outputFs: Compiler["outputFileSystem"]) => {
  sourceMapSupport.install({
    // NOTE: If https://github.com/evanw/node-source-map-support/pull/149
    // lands we can be less aggressive and explicitly invalidate the source
    // map cache when Webpack recompiles.
    emptyCacheBetweenOperations: true,
    retrieveFile(source) {
      try {
        // @ts-ignore
        return outputFs.readFileSync(source, "utf8");
      } catch (ex) {
        // Doesn't exist
      }
    },
  });
};

const webpackHotServerMiddleware = (serverCompiler: Compiler) => {
  const outputFs = serverCompiler.outputFileSystem;
  const outputPath = serverCompiler.outputPath;

  installSourceMapSupport(outputFs);

  let serverRenderer: RequestHandler;
  let error: WebpackError | false = false;

  const doneHandler = (serverStats: Stats) => {
    error = false;

    // Server compilation errors need to be propagated to the client.
    if (serverStats.compilation.errors.length) {
      error = serverStats.compilation.errors[0];

      return;
    }

    const filename = getFilename(serverStats, outputPath);

    // @ts-ignore
    const buffer: Buffer = outputFs.readFileSync(filename);

    try {
      serverRenderer = getServerRenderer(filename, buffer);
    } catch (ex) {
      error = ex;
    }
  };

  serverCompiler.hooks.done.tap("WebpackHotServerMiddleware", doneHandler);

  return (req: Request, res: Response, next: NextFunction) => {
    if (error) {
      return next(error);
    }

    serverRenderer(req, res, next);
  };
};

export default webpackHotServerMiddleware;
