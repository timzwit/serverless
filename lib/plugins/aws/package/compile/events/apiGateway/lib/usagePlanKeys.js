'use strict';

const _ = require('lodash');
const BbPromise = require('bluebird');

function createUsagePlanKeyResource(that, usagePlanLogicalId, keyNumber) {
  const apiKeyLogicalId = that.provider.naming.getApiKeyLogicalId(keyNumber);

  const resourceTemplate = {
    Type: 'AWS::ApiGateway::UsagePlanKey',
    Properties: {
      KeyId: {
        Ref: apiKeyLogicalId,
      },
      KeyType: 'API_KEY',
      UsagePlanId: {
        Ref: usagePlanLogicalId,
      },
    },
  };

  return _.cloneDeep(resourceTemplate);
}

module.exports = {
  compileUsagePlanKeys() {
    if (this.serverless.service.provider.apiKeys) {
      if (!Array.isArray(this.serverless.service.provider.apiKeys)) {
        throw new this.serverless.classes.Error('apiKeys property must be an array');
      }

      const resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources;
      let keyNumber = 0;

      _.forEach(this.serverless.service.provider.apiKeys, (apiKeyDefinition) => {
        if (_.isObject(apiKeyDefinition)) {
          const name = Object.keys(apiKeyDefinition)[0];

          if (!_.includes(this.apiGatewayUsagePlanNames, name)) {
            throw new this.serverless.classes.Error(`API key "${name}" has no usage plan defined`);
          }

          _.forEach(apiKeyDefinition[name], (key) => {
            if (!_.isString(key)) {
              throw new this.serverless.classes.Error('API keys must be strings');
            }
            keyNumber += 1;
            const usagePlanKeyLogicalId = this.provider.naming.getUsagePlanKeyLogicalId(keyNumber);
            const usagePlanLogicalId = this.provider.naming.getUsagePlanLogicalId(name);
            const resourceTemplate =
              createUsagePlanKeyResource(this, usagePlanLogicalId, keyNumber);
            _.merge(resources, {
              [usagePlanKeyLogicalId]: resourceTemplate,
            });
          });
        } else {
          keyNumber += 1;
          const usagePlanKeyLogicalId = this.provider.naming.getUsagePlanKeyLogicalId(keyNumber);
          const usagePlanLogicalId = this.provider.naming.getUsagePlanLogicalId();
          const resourceTemplate = createUsagePlanKeyResource(this, usagePlanLogicalId, keyNumber);
          _.merge(resources, {
            [usagePlanKeyLogicalId]: resourceTemplate,
          });
        }
      });
    }
    return BbPromise.resolve();
  },
};
