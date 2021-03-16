import { findAndParseConfig } from "@graphql-mesh/config";
import { getMesh } from "@graphql-mesh/runtime";
import { ApolloServer } from "apollo-server-express";
import { Router } from "express";

export const getApiMiddleware = async (): Promise<Router> => {
  const meshConfig = await findAndParseConfig();
  const { contextBuilder: context, schema } = await getMesh(meshConfig);

  const server = new ApolloServer({
    context,
    schema,
  });

  return server.getMiddleware();
};
