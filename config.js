/*
  contains and defines configurations and environments
*/
 //define a container for the environments
 const environments = {};
 //add environments
 environments.staging = {
    'httpPort': 3000,
    'httpsPort':3001,
    'env_name':'staging'
 };
 environments.production = {
    'httpPort': 5000,
    'httpsPort':5001,
    'env_name':'production'
 };
 //check whether the environment is set in NODE_ENV variable
 const currentEnv = typeof(process.env.NODE_ENV) == 'string'? process.env.NODE_ENV : '';
 //check if the set up environment, is one of those which we have defined
 //if not, default to staging
 const env_to_export = typeof(environments[currentEnv])=='object'? environments[currentEnv] : environments.staging;
 //export the chosen environment
 module.exports = env_to_export;
