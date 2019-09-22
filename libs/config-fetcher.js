module.exports = (dynamicConfig, constantConfig) => {
  if(typeof process.appConfig === "undefined"){
    process.appConfig = new Map();
  }
  dynamicConfig.map(config => {
      process.appConfig.set(config.key, config.value);
  });

  process.constantVar = constantConfig;
}