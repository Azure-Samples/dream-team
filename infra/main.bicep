targetScope = 'subscription'

@minLength(1)
@maxLength(64)
@description('Name of the environment that can be used as part of naming resource convention')
param environmentName string

@minLength(1)
@description('Primary location for all resources')
@allowed([
  'northcentralusstage'
  'westus2'
  'northeurope'
  'eastus'
  'eastasia'
  'northcentralus'
  'germanywestcentral'
  'polandcentral'
  'italynorth'
  'switzerlandnorth'
  'swedencentral'
  'norwayeast'
  'japaneast'
  'australiaeast'
  'westcentralus'
  'westeurope'
]) // limit to regions where Dynamic sessions are available as of 2024-11-29
param location string

param srcExists bool
@secure()
param srcDefinition object = {
  repositoryUrl: 'https://example.com/repo.git'
  branch: 'main'
  frontendArtifactLocation: 'dist'
  settings: [
    {
      name: 'setting1'
      value: 'value1'
    }
  ]
}

@description('Id of the user or app to assign application roles')
param principalId string

// Tags that should be applied to all resources.
// 
// Note that 'azd-service-name' tags should be applied separately to service host resources.
// Example usage:
//   tags: union(tags, { 'azd-service-name': <service name in azure.yaml> })
var tags = {
  'azd-env-name': environmentName
}

var abbrs = loadJsonContent('./abbreviations.json')
var resourceToken = toLower(uniqueString(subscription().id, environmentName, location))
// New variable for prefix used in customSubDomainName
var prefix = 'dreamv2'

resource rg 'Microsoft.Resources/resourceGroups@2022-09-01' = {
  name: 'rg-${environmentName}'
  location: location
  tags: tags
}

module monitoring './shared/monitoring.bicep' = {
  name: 'monitoring'
  params: {
    location: location
    tags: tags
    logAnalyticsName: '${abbrs.operationalInsightsWorkspaces}${resourceToken}'
    applicationInsightsName: '${abbrs.insightsComponents}${resourceToken}'
  }
  scope: rg
}

module dashboard './shared/dashboard-web.bicep' = {
  name: 'dashboard'
  params: {
    name: '${abbrs.portalDashboards}${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    location: location
    tags: tags
  }
  scope: rg
}

module registry './shared/registry.bicep' = {
  name: 'registry'
  params: {
    location: location
    tags: tags
    name: '${abbrs.containerRegistryRegistries}${resourceToken}'
  }
  scope: rg
}

module keyVault './shared/keyvault.bicep' = {
  name: 'keyvault'
  params: {
    location: location
    tags: tags
    name: '${abbrs.keyVaultVaults}${resourceToken}'
    principalId: principalId
  }
  scope: rg
}

// Add network module before appsEnv
module network './shared/netwk.bicep' = {
  name: 'network'
  params: {
    name: '${abbrs.networkVirtualNetworks}${resourceToken}'
    location: location
    tags: tags
  }
  scope: rg
}

module appsEnv './shared/apps-env.bicep' = {
  name: 'apps-env'
  params: {
    name: '${abbrs.appManagedEnvironments}${resourceToken}'
    location: location
    tags: tags
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    logAnalyticsWorkspaceName: monitoring.outputs.logAnalyticsWorkspaceName
    // Pass the ACA subnet ID from the network module
    infrastructureSubnetId: network.outputs.acaSubnetId
    // managedResourceGroupName: '${rg.name}-apps-env-mng'
  }
  scope: rg
}

module backend './app/backend.bicep' = {
  name: 'backend'
  params: {
    name: 'backend'
    location: location
    tags: tags
    identityName: '${abbrs.managedIdentityUserAssignedIdentities}backend-${resourceToken}'
    applicationInsightsName: monitoring.outputs.applicationInsightsName
    containerAppsEnvironmentName: appsEnv.outputs.name
    containerRegistryName: registry.outputs.name
    exists: srcExists
    appDefinition: srcDefinition
    userPrincipalId: principalId
    customSubDomainName: '${prefix}-${resourceToken}'
    cosmosdbName: '${abbrs.documentDBDatabaseAccounts}${resourceToken}'
    aiSearchName: '${abbrs.searchSearchServices}${resourceToken}'
    // Pass subnet IDs from the network module to backend
    acaSubnetId: network.outputs.acaSubnetId
    defaultSubnetId: network.outputs.defaultSubnetId
    azureOpenaiResourceName: '${abbrs.cognitiveServicesAccounts}${resourceToken}'
    storageName: '${abbrs.storageStorageAccounts}${resourceToken}'
    vnetId: network.outputs.vnetId
    communicationServiceName: '${abbrs.communicationServiceAccounts}${resourceToken}'
    communicationServiceEmailName: '${abbrs.communicationServiceAccounts}-email-${resourceToken}'
    mcpKey: guid(resourceToken, 'mcpserver_api_key')
  }
  scope: rg
  dependsOn: [
    network
    appsEnv
  ]
}

// Add frontend deployment module
module frontend './app/frontend.bicep' = {
  name: 'frontend'
  params: {
    name: '${abbrs.webStaticSites}${resourceToken}'
    location: 'westeurope'
    tags: tags
    repositoryUrl: srcDefinition.repositoryUrl
    branch: srcDefinition.branch
    appArtifactLocation: srcDefinition.frontendArtifactLocation
  }
  scope: rg
}

output AZURE_CONTAINER_REGISTRY_ENDPOINT string = registry.outputs.loginServer
output AZURE_KEY_VAULT_NAME string = keyVault.outputs.name
output AZURE_KEY_VAULT_ENDPOINT string = keyVault.outputs.endpoint
output AZURE_OPENAI_ENDPOINT string = backend.outputs.azure_endpoint
output POOL_MANAGEMENT_ENDPOINT string = backend.outputs.pool_endpoint
output SERVICE_BACKEND_URI string = backend.outputs.uri
output STATIC_SITE_ENDPOINT string = frontend.outputs.staticSiteEndpoint
output COSMOS_DB_URI string = backend.outputs.cosmosdb_uri
output COSMOS_DB_DATABASE string = backend.outputs.cosmosdb_database
output CONTAINER_NAME string = backend.outputs.container_name
output CONTAINER_TEAMS_NAME string = backend.outputs.container_teams_name
output AZURE_SEARCH_SERVICE_ENDPOINT string = backend.outputs.ai_search_endpoint
output AZURE_RESOURCE_GROUP string = rg.name

output AZURE_OPENAI_EMBEDDING_MODEL string = backend.outputs.opemaiEmbeddingModel
output AZURE_STORAGE_ACCOUNT_ENDPOINT string = backend.outputs.storageAccountEndpoint
output AZURE_STORAGE_ACCOUNT_ID string = backend.outputs.storageAccountId
output UAMI_RESOURCE_ID string = backend.outputs.userAssignedIdentityId

output AZURE_COMMUNICATION_EMAIL_ENDPOINT string = backend.outputs.communicationServiceEndpoint
output AZURE_COMMUNICATION_EMAIL_SENDER string = 'DoNotReply@${backend.outputs.communicationServiceEmailDomainOut}'
output AZURE_COMMUNICATION_EMAIL_RECIPIENT_DEFAULT string = '<recipient@example.com>'
output AZURE_COMMUNICATION_EMAIL_SUBJECT_DEFAULT string = 'Message from AI Agent'

output MCP_SERVER_URI string = backend.outputs.mcpserver_fqdn
output MCP_SERVER_API_KEY string = guid(backend.outputs.mcpserver_fqdn, 'mcpserver_api_key')
