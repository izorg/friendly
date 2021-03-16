const config = {
  additionalResolvers: ["build/server/middlewares/api/resolvers.js"],
  additionalTypeDefs: "build/server/middlewares/api/extend.graphql",
  sources: [
    {
      handler: {
        openapi: {
          baseUrl: "http://localhost:3001",
          source: "src/server/middlewares/api/contracts/leaflet.yaml",
        },
      },
      name: "Leaflet",
    },
    {
      handler: {
        openapi: {
          baseUrl: "http://localhost:3002",
          source: "src/server/middlewares/api/contracts/pim.yaml",
        },
      },
      name: "Pim",
    },
  ],
};

if (process.env.NODE_ENV === "development") {
  config.additionalResolvers = ["src/server/middlewares/api/resolvers.ts"];
  config.additionalTypeDefs = "src/server/middlewares/api/extend.graphql";
}

module.exports = config;
