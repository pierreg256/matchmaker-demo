data "azurerm_client_config" "current" {}

locals {
  resource_prefix     = "${var.environment}-${var.application}"
  resource_group_name = "${var.environment}-${var.application}"

  tags = {
    application = "${var.application}"
    environment = "${var.environment}"
    deployment  = "terraform"
  }
}

# Create a resource group
resource "azurerm_resource_group" "main" {
  name     = "${local.resource_group_name}"
  location = "${var.location}"
  tags     = "${local.tags}"
}

resource "azurerm_storage_account" "web" {
  name                      = "${var.environment}${var.application}web"
  resource_group_name       = "${azurerm_resource_group.main.name}"
  location                  = "${azurerm_resource_group.main.location}"
  account_kind              = "StorageV2"
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  enable_https_traffic_only = true
  tags                      = "${local.tags}"

}

resource "azurerm_storage_account" "main" {
  name                     = "${var.environment}${var.application}sa"
  resource_group_name      = "${azurerm_resource_group.main.name}"
  location                 = "${azurerm_resource_group.main.location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = "${local.tags}"
}

resource "azurerm_storage_container" "apps" {
  name                  = "${var.application}-functions"
  storage_account_name  = "${azurerm_storage_account.main.name}"
  container_access_type = "private"
}

resource "azurerm_app_service_plan" "main" {
  name                = "${local.resource_prefix}-functions-sp"
  location            = "${azurerm_resource_group.main.location}"
  resource_group_name = "${azurerm_resource_group.main.name}"
  kind                = "FunctionApp"

  sku {
    tier = "Standard"
    size = "S1"
  }

  tags = "${local.tags}"
}

resource "azurerm_application_insights" "main" {
  name                = "${local.resource_prefix}-appinsights"
  location            = "${azurerm_resource_group.main.location}"
  resource_group_name = "${azurerm_resource_group.main.name}"
  application_type    = "Node.JS"

  tags = "${local.tags}"
}

resource "azurerm_function_app" "main" {
  name                      = "${local.resource_prefix}-function-app"
  location                  = "${azurerm_resource_group.main.location}"
  resource_group_name       = "${azurerm_resource_group.main.name}"
  app_service_plan_id       = "${azurerm_app_service_plan.main.id}"
  storage_connection_string = "${azurerm_storage_account.main.primary_connection_string}"
  version                   = "~2"
  https_only                = true
  site_config {
    always_on = true
    cors {
      allowed_origins     = ["http://localhost:3000", replace("${azurerm_storage_account.web.primary_web_endpoint}", "/\\/$/", "")]
      support_credentials = true
    }
  }

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME       = "node"
    WEBSITE_NODE_DEFAULT_VERSION   = "10.14.1"
    APPINSIGHTS_INSTRUMENTATIONKEY = "${azurerm_application_insights.main.instrumentation_key}"
    COSMOSDB_CONNECTION            = "${azurerm_cosmosdb_account.main.connection_strings[0]}"
    AzureSignalRConnectionString   = "${azurerm_signalr_service.main.primary_connection_string}"
  }

  tags = "${local.tags}"
}

resource "azurerm_cosmosdb_account" "main" {
  name                = "${local.resource_prefix}-cosmosdb"
  location            = "${azurerm_resource_group.main.location}"
  resource_group_name = "${azurerm_resource_group.main.name}"
  offer_type          = "Standard"
  kind                = "GlobalDocumentDB"

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 10
    max_staleness_prefix    = 200
  }

  geo_location {
    prefix            = "${local.resource_prefix}-customid"
    location          = "${azurerm_resource_group.main.location}"
    failover_priority = 0
  }
  tags = "${local.tags}"
}

resource "azurerm_cosmosdb_sql_database" "maindb" {
  name                = "${var.application}-db"
  resource_group_name = "${azurerm_cosmosdb_account.main.resource_group_name}"
  account_name        = "${azurerm_cosmosdb_account.main.name}"
}

resource "azurerm_cosmosdb_sql_container" "maincontainer" {
  name                = "${var.application}-container"
  resource_group_name = "${azurerm_cosmosdb_account.main.resource_group_name}"
  account_name        = "${azurerm_cosmosdb_account.main.name}"
  database_name       = "${azurerm_cosmosdb_sql_database.maindb.name}"
}

resource "azurerm_maps_account" "main" {
  name                = "${local.resource_prefix}-maps-account"
  resource_group_name = "${azurerm_resource_group.main.name}"
  sku_name            = "s0"

  tags = "${local.tags}"
}

resource "azurerm_signalr_service" "main" {
  name                = "${local.resource_prefix}-signalr"
  location            = "${azurerm_resource_group.main.location}"
  resource_group_name = "${azurerm_resource_group.main.name}"

  sku {
    name     = "Free_F1"
    capacity = 1
  }
  tags = "${local.tags}"
}
