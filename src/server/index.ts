import path from "path";

import compression from "compression";
import express from "express";

import { getApiMiddleware } from "./middlewares/api";

const app = express();

const development = process.env.NODE_ENV === "development";

void (async () => {
  app.use(compression());

  app.use(await getApiMiddleware());

  if (development) {
    (await import("./middlewares/render/index.development")).default(app);
  } else {
    app.use(express.static(path.join(__dirname, "../client")));
    app.use((await import("./middlewares/render")).default);
  }

  app.listen(3000, () =>
    console.log("Example app listening on http://localhost:3000!")
  );
})();
