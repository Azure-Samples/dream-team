param name string
param location string = resourceGroup().location
param tags object = {}

param identityName string
param containerRegistryName string
param containerAppsEnvironmentName string
param applicationInsightsName string
param exists bool

param azureOpenaiResourceName string = 'dreamv2' 
param azureOpenaiDeploymentName string = 'gpt-4o'
param azureOpenaiDeploymentNameMini string = 'gpt-4o-mini'
param azureOpenaiDeploymentNameEmbedding string = 'text-embedding-3-large'

@description('Custom subdomain name for the OpenAI resource (must be unique in the region)')
param customSubDomainName string

@description('Name of the Cosmos DB account')
param cosmosdbName string

@description('Name of the Azure Search resource')
param aiSearchName string

@description('Name of the storage account')
param storageName string

@secure()
param appDefinition object

@description('Principal ID of the user executing the deployment')
param userPrincipalId string

// Add parameter to receive the ACA subnet ID from main.bicep
param acaSubnetId string
param defaultSubnetId string

@description('The ID of the target virtual network for private DNS association')
param vnetId string

var appSettingsArray = filter(array(appDefinition.settings), i => i.name != '')
var secrets = map(filter(appSettingsArray, i => i.?secret != null), i => {
  name: i.name
  value: i.value
  secretRef: i.?secretRef ?? take(replace(replace(toLower(i.name), '_', '-'), '.', '-'), 32)
})
var env = map(filter(appSettingsArray, i => i.?secret == null), i => {
  name: i.name
  value: i.value
})

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: identityName
  location: location
}

resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-01-01-preview' existing = {
  name: containerRegistryName
}

resource containerAppsEnvironment 'Microsoft.App/managedEnvironments@2023-05-01' existing = {
  name: containerAppsEnvironmentName
}

resource applicationInsights 'Microsoft.Insights/components@2020-02-02' existing = {
  name: applicationInsightsName
}

resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: containerRegistry
  name: guid(subscription().id, resourceGroup().id, identity.id, 'acrPullRole')
  properties: {
    roleDefinitionId:  subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalType: 'ServicePrincipal'
    principalId: identity.properties.principalId
  }
}

module fetchLatestImage '../modules/fetch-container-image.bicep' = {
  name: '${name}-fetch-image'
  params: {
    exists: exists
    name: name
  }
}

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2021-04-15' = {
  name: cosmosdbName
  location: 'northeurope' //location
  kind: 'GlobalDocumentDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: 'northeurope'
        failoverPriority: 0
      }
    ]
  }
  tags: union(tags, {'azd-service-name': 'backend-cosmosdb'})
}

resource cosmosDBDatabase 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases@2022-05-15' = {
  parent: cosmosDb
  name: 'ag_demo'
  properties: {
    resource: {
      id: 'ag_demo'
    }
  }
}

resource cosmosDbContainer 'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers@2021-04-15' = {
  name: 'ag_demo'
  parent: cosmosDBDatabase
  properties: {
    resource: {
      id: 'ag_demo'
      partitionKey: {
        paths: [
          '/user_id'
        ]
        kind: 'Hash'
      }
      // Optionally add indexing policy, uniqueKeyPolicy, etc.
    }
  }
}

// Create Storage Account with private endpoint in the default subnet
resource storageAcct 'Microsoft.Storage/storageAccounts@2021-09-01' = {
  name: storageName
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

resource peStorage 'Microsoft.Network/privateEndpoints@2021-05-01' = {
  name: 'pe-storage-${uniqueString(name, location)}'
  location: location
  properties: {
    subnet: {
      id: defaultSubnetId // Use the defaultSubnetId parameter instead of network module output
    }
    privateLinkServiceConnections: [
      {
        name: 'storageLink'
        properties: {
          privateLinkServiceId: storageAcct.id
          groupIds: [
            'blob'
          ]
        }
      }
    ]
  }
}

// Create Private Endpoint for CosmosDB in the default subnet
resource peCosmos 'Microsoft.Network/privateEndpoints@2021-05-01' = {
  name: 'pe-cosmos-${uniqueString(name, location)}'
  location: location
  properties: {
    subnet: {
      id: defaultSubnetId // Use the defaultSubnetId parameter instead of network module output
    }
    privateLinkServiceConnections: [
      {
        name: 'cosmosLink'
        properties: {
          privateLinkServiceId: cosmosDb.id
          groupIds: [
            'Sql'
          ]
        }
      }
    ]
  }
}

resource cosmosdbPrivateDnsZone 'Microsoft.Network/privateDnsZones@2024-06-01' = {
  name: 'privatelink.documents.azure.com'
  location: 'global'
}

resource cosmosdbDnsLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2024-06-01' = {
  name: 'cosmosdb-dnslink'
  parent: cosmosdbPrivateDnsZone
  location: 'global'
  properties: {
    virtualNetwork: {
      id: vnetId
    }
    registrationEnabled: false
  }
}

resource cosmosdbZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2021-02-01' = {
  name: 'cosmosdbZoneGroup'
  parent: peCosmos
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'default'
        properties: {
          privateDnsZoneId: cosmosdbPrivateDnsZone.id
        }
      }
    ]
  }
  dependsOn: [
    cosmosdbDnsLink
    peCosmos
  ]
}

// Add AI Search resource creation
resource aiSearch 'Microsoft.Search/searchServices@2024-06-01-preview' = {
  name: aiSearchName
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  location: location
  sku: {
    name: 'basic'
  }
  properties: {
    hostingMode: 'default'
    replicaCount: 1
    partitionCount: 1
    authOptions: {
        aadOrApiKey: {aadAuthFailureMode: 'http403'} 
      
    }
  }
}

resource aiSearchContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(aiSearch.id, identity.id, 'SearchServiceContributor')
  scope: aiSearch
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7ca78c08-252a-4471-8644-bb5ff32d4ba0')
  }
}
resource aiSearchDataContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(aiSearch.id, identity.id, 'SearchServiceDataContributor')
  scope: aiSearch
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '8ebe5a00-799e-43f5-93ac-243d3dce84a7')
  }
}

// Add a private endpoint to aiSearch and associate a private DNS zone for search
resource searchPrivateDnsZone 'Microsoft.Network/privateDnsZones@2024-06-01' = {
  name: 'privatelink.search.windows.net'
  location: 'global'
}

resource searchDnsLink 'Microsoft.Network/privateDnsZones/virtualNetworkLinks@2024-06-01' = {
  name: 'search-dnslink'
  parent: searchPrivateDnsZone
  location: 'global'
  properties: {
    virtualNetwork: {
      id: vnetId
    }
    registrationEnabled: false
  }
}

resource peSearch 'Microsoft.Network/privateEndpoints@2021-05-01' = {
  name: 'pe-search-${uniqueString(name, location)}'
  location: location
  properties: {
    subnet: {
      id: defaultSubnetId
    }
    privateLinkServiceConnections: [
      {
        name: 'searchLink'
        properties: {
          privateLinkServiceId: aiSearch.id
          groupIds: [
            'searchService'
          ]
        }
      }
    ]
  }
}

resource searchZoneGroup 'Microsoft.Network/privateEndpoints/privateDnsZoneGroups@2021-02-01' = {
  name: 'searchZoneGroup'
  parent: peSearch
  properties: {
    privateDnsZoneConfigs: [
      {
        name: 'default'
        properties: {
          privateDnsZoneId: searchPrivateDnsZone.id
        }
      }
    ]
  }
  dependsOn: [
    searchDnsLink
    peSearch
  ]
}

resource app 'Microsoft.App/containerApps@2023-05-02-preview' = {
  name: name
  location: location
  tags: union(tags, {'azd-service-name':  'backend' })
  dependsOn: [ acrPullRole ]
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  properties: {
    managedEnvironmentId: containerAppsEnvironment.id
    configuration: {
      ingress:  {
        external: true
        targetPort: 3100
        transport: 'auto'
      }
      registries: [
        {
          server: '${containerRegistryName}.azurecr.io'
          identity: identity.id
        }
      ]
      secrets: union([
      ],
      map(secrets, secret => {
        name: secret.secretRef
        value: secret.value
      }))
    }
    template: {
      containers: [
        {
          image: fetchLatestImage.outputs.?containers[?0].?image ?? 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
          name: 'main'
          env: union([
            {
              name: 'APPLICATIONINSIGHTS_CONNECTION_STRING'
              value: applicationInsights.properties.ConnectionString
            }
            {
              name: 'AZURE_OPENAI_ENDPOINT'
              value: openai.properties.endpoint
            }
            {
              name: 'POOL_MANAGEMENT_ENDPOINT'
              value: dynamicsession.properties.poolManagementEndpoint
            }
            {
              name: 'AZURE_CLIENT_ID'
              value: identity.properties.clientId
            }
            {
              name: 'PORT'
              value: '80'
            }
            {
              name: 'COSMOS_DB_URI'
              value: cosmosDb.properties.documentEndpoint
            }
            {
              name: 'COSMOS_DB_DATABASE'
              value: 'ag_demo'
            }
            {
              name: 'CONTAINER_NAME'
              value: 'ag_demo'
            }
            {
              name: 'AZURE_SEARCH_SERVICE_ENDPOINT'
              value: 'https://${aiSearch.name}.search.windows.net'
            }
            {
              name: 'AZURE_OPENAI_EMBEDDING_MODEL'
              value: openaideploymentembedding.name
            }
            {
              name: 'AZURE_STORAGE_ACCOUNT_ENDPOINT'
              value: storageAcct.properties.primaryEndpoints.blob
            }
            {
              name: 'AZURE_STORAGE_ACCOUNT_ID'
              value: storageAcct.id
            }
            {
              name: 'UAMI_RESOURCE_ID'
              value: identity.id
            }
          ],
          env,
          map(secrets, secret => {
            name: secret.name
            secretRef: secret.secretRef
          }))
          resources: {
            cpu: json('2.0')
            memory: '4.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 10
      }
    }
  }
}

resource openai 'Microsoft.CognitiveServices/accounts@2024-10-01' = {
  name: azureOpenaiResourceName
  location: location
  sku: {
    name: 'S0'
  }
  kind: 'OpenAI'
  properties: {
    customSubDomainName: customSubDomainName
  }
}

// Define the OpenAI deployment
resource openaideployment 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  name: azureOpenaiDeploymentName
  parent: openai
  sku: {
    name: 'GlobalStandard'
    capacity: 30
  }
  properties: {
    model: {
      name: 'gpt-4o'
      format: 'OpenAI'
      version: '2024-11-20'
      
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
  }
}

resource openaideploymentmini 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  name: azureOpenaiDeploymentNameMini
  parent: openai
  sku: {
    name: 'GlobalStandard'
    capacity: 30
  }
  properties: {
    model: {
      name: 'gpt-4o-mini'
      format: 'OpenAI'
      version: '2024-07-18'
      
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
  }
  dependsOn: [openaideployment]
}

resource openaideploymentembedding 'Microsoft.CognitiveServices/accounts/deployments@2024-10-01' = {
  name: azureOpenaiDeploymentNameEmbedding
  parent: openai
  sku: {
    name: 'Standard'
    capacity: 15
  }
  properties: {
    model: {
      name: 'text-embedding-3-large'
      format: 'OpenAI'
      version: '1'
      
    }
    versionUpgradeOption: 'OnceCurrentVersionExpired'
  }
  dependsOn: [openaideploymentmini]
}

resource dynamicsession 'Microsoft.App/sessionPools@2024-02-02-preview' = {
  name: 'sessionPool'
  location: location
  tags: {
    tagName1: 'tagValue1'
  }
  
  properties: {
    containerType: 'PythonLTS'
    
    dynamicPoolConfiguration: {
      cooldownPeriodInSeconds: 300
      executionType: 'Timed'
    }
    poolManagementType: 'Dynamic'
    scaleConfiguration: {
      maxConcurrentSessions: 20
      readySessionInstances: 2
    }
    
  }
}

resource userSessionPoolRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(dynamicsession.id, userPrincipalId, 'Azure Container Apps Session Executor')
  scope: dynamicsession
  properties: {
    principalId: userPrincipalId
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '0fb8eba5-a2bb-4abe-b1c1-49dfad359bb0')
  }
} 

resource appSessionPoolRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(dynamicsession.id, identity.id, 'Azure Container Apps Session Executor')
  scope: dynamicsession
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '0fb8eba5-a2bb-4abe-b1c1-49dfad359bb0')
  }
}

resource userOpenaiRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openai.id, userPrincipalId, 'Cognitive Services OpenAI User')
  scope: openai
  properties: {
    principalId: userPrincipalId
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd')
  }
} 

resource appOpenaiRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(openai.id, identity.id, 'Cognitive Services OpenAI User')
  scope: openai
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '5e0bd9bd-7b93-4f28-af87-19fc36ad61bd')
  }
}

@description('Name of the role definition.')
param roleDefinitionName string = 'Azure Cosmos DB for NoSQL Data Plane Owner'

resource definition 'Microsoft.DocumentDB/databaseAccounts/sqlRoleDefinitions@2024-05-15' = {
  name: guid(cosmosDb.id, roleDefinitionName)
  parent: cosmosDb
  properties: {
    roleName: roleDefinitionName
    type: 'CustomRole'
    assignableScopes: [
      cosmosDb.id
    ]
    permissions: [
      {
        dataActions: [
          'Microsoft.DocumentDB/databaseAccounts/readMetadata'
          'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*'
          'Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*'
        ]
      }
    ]
  }
}
resource assignment 'Microsoft.DocumentDB/databaseAccounts/sqlRoleAssignments@2024-05-15' = {
  name: guid(definition.id, cosmosDb.id)
  parent: cosmosDb
  properties: {
    principalId: identity.properties.principalId
    roleDefinitionId: definition.id
    scope: cosmosDb.id
  }
}

resource blobContributorRoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(storageAcct.id, identity.id, 'Storage Blob Data Contributor')
  scope: storageAcct
  properties: {
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')
  }
}

output defaultDomain string = containerAppsEnvironment.properties.defaultDomain
output name string = app.name
output uri string = 'https://${app.properties.configuration.ingress.fqdn}'
output id string = app.id
output azure_endpoint string = openai.properties.endpoint
output pool_endpoint string = dynamicsession.properties.poolManagementEndpoint
output cosmosdb_uri string = cosmosDb.properties.documentEndpoint
output cosmosdb_database string = 'ag_demo'
output container_name string = 'ag_demo'
output cosmosDbId string = cosmosDb.id
output storageAccountId string = storageAcct.id
output storageAccountEndpoint string = storageAcct.properties.primaryEndpoints.blob
output userAssignedIdentityId string = identity.id
output opemaiEmbeddingModel string = openaideploymentembedding.name
output opemaiEmbeddingModelId string = openaideploymentembedding.id
output ai_search_endpoint string = 'https://${aiSearch.name}.search.windows.net'
