import webpack, { Compiler } from "webpack";

import config from "../../../../webpack.config";

import CompilerName from "./CompilerName";

export const multiCompiler = webpack(config);

const getCompiler = (name: CompilerName): Compiler => {
  const compiler = multiCompiler.compilers.find((item) => item.name === name);

  if (!compiler) {
    throw new Error(`No "${name}" compiler`);
  }

  return compiler;
};

export const clientCompiler = getCompiler(CompilerName.client);

export const serverCompiler = getCompiler(CompilerName.server);
