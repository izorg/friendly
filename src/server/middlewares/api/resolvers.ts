import type { Resolvers } from "./types.generated";

const resolvers: Resolvers = {
  PimProduct: {
    leaflets: {
      resolve: async (root, _args, { Leaflet }) => {
        if (!root.pzn) {
          return null;
        }

        return (await Leaflet.api.getLeafletsPzn({ pzn: root.pzn })) ?? null;
      },
      selectionSet: `{ pzn }`,
    },
  },

  Query: {
    testClient: async () =>
      new Promise((resolve) => setTimeout(() => resolve(true), 1000)),

    testServer: async () =>
      new Promise((resolve) => setTimeout(() => resolve(false), 1)),
  },
};

export default resolvers;
