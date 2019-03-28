'use strict';

const expect = require('chai').expect;
const AwsCompileApigEvents = require('../index');
const Serverless = require('../../../../../../../Serverless');
const AwsProvider = require('../../../../../provider/awsProvider');

describe('#compileApiKeys()', () => {
  let serverless;
  let awsCompileApigEvents;

  beforeEach(() => {
    const options = {
      stage: 'dev',
      region: 'us-east-1',
    };
    serverless = new Serverless();
    serverless.setProvider('aws', new AwsProvider(serverless, options));
    serverless.service.service = 'first-service';
    serverless.service.provider.compiledCloudFormationTemplate = {
      Resources: {},
      Outputs: {},
    };
    awsCompileApigEvents = new AwsCompileApigEvents(serverless, options);
    awsCompileApigEvents.apiGatewayRestApiLogicalId = 'ApiGatewayRestApi';
    awsCompileApigEvents.apiGatewayDeploymentLogicalId = 'ApiGatewayDeploymentTest';
  });

  it('should support stringg notations', () => {
    awsCompileApigEvents.serverless.service.provider.apiKeys = ['1234567890', 'abcdefghij'];

    return awsCompileApigEvents.compileApiKeys().then(() => {
      // key 1
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
          ].Type
      ).to.equal('AWS::ApiGateway::ApiKey');
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
          ].Properties.Enabled
      ).to.equal(true);
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
          ].Properties.Name
      ).to.equal('1234567890');
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
          ].Properties.StageKeys[0].RestApiId.Ref
      ).to.equal('ApiGatewayRestApi');
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
          ].Properties.StageKeys[0].StageName
      ).to.equal('dev');
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
          ].DependsOn
      ).to.equal('ApiGatewayDeploymentTest');

      // key2
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
          ].Type
      ).to.equal('AWS::ApiGateway::ApiKey');
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
          ].Properties.Enabled
      ).to.equal(true);
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
          ].Properties.Name
      ).to.equal('abcdefghij');
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
          ].Properties.StageKeys[0].RestApiId.Ref
      ).to.equal('ApiGatewayRestApi');
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
          ].Properties.StageKeys[0].StageName
      ).to.equal('dev');
      expect(
        awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
          .Resources[
            awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
          ].DependsOn
      ).to.equal('ApiGatewayDeploymentTest');
    });
  });

  describe('when using object notation', () => {
    it('should support object notations', () => {
      awsCompileApigEvents.serverless.service.provider.apiKeys = [
        { free: ['1234567890', 'abcdefghij'] },
        { paid: ['0987654321', 'jihgfedcba'] },
      ];

      return awsCompileApigEvents.compileApiKeys().then(() => {
        // "free" plan resources
        // key 1
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
            ].Type
        ).to.equal('AWS::ApiGateway::ApiKey');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
            ].Properties.Enabled
        ).to.equal(true);
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
            ].Properties.Name
        ).to.equal('1234567890');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
            ].Properties.StageKeys[0].RestApiId.Ref
        ).to.equal('ApiGatewayRestApi');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
            ].Properties.StageKeys[0].StageName
        ).to.equal('dev');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(1)
            ].DependsOn
        ).to.equal('ApiGatewayDeploymentTest');
        // key2
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
            ].Type
        ).to.equal('AWS::ApiGateway::ApiKey');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
            ].Properties.Enabled
        ).to.equal(true);
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
            ].Properties.Name
        ).to.equal('abcdefghij');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
            ].Properties.StageKeys[0].RestApiId.Ref
        ).to.equal('ApiGatewayRestApi');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
            ].Properties.StageKeys[0].StageName
        ).to.equal('dev');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(2)
            ].DependsOn
        ).to.equal('ApiGatewayDeploymentTest');

        // "paid" plan resources
        // key 3
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(3)
            ].Type
        ).to.equal('AWS::ApiGateway::ApiKey');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(3)
            ].Properties.Enabled
        ).to.equal(true);
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(3)
            ].Properties.Name
        ).to.equal('0987654321');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(3)
            ].Properties.StageKeys[0].RestApiId.Ref
        ).to.equal('ApiGatewayRestApi');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(3)
            ].Properties.StageKeys[0].StageName
        ).to.equal('dev');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(3)
            ].DependsOn
        ).to.equal('ApiGatewayDeploymentTest');
        // key 4
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(4)
            ].Type
        ).to.equal('AWS::ApiGateway::ApiKey');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(4)
            ].Properties.Enabled
        ).to.equal(true);
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(4)
            ].Properties.Name
        ).to.equal('jihgfedcba');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(4)
            ].Properties.StageKeys[0].RestApiId.Ref
        ).to.equal('ApiGatewayRestApi');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(4)
            ].Properties.StageKeys[0].StageName
        ).to.equal('dev');
        expect(
          awsCompileApigEvents.serverless.service.provider.compiledCloudFormationTemplate
            .Resources[
              awsCompileApigEvents.provider.naming.getApiKeyLogicalId(4)
            ].DependsOn
        ).to.equal('ApiGatewayDeploymentTest');
      });
    });
  });
});
