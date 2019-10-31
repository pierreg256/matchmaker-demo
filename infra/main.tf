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
  name     = "100-MATCHMAKING-DEMO"
  location = "North Europe"
}

resource "random_string" "random" {
  length  = 6
  special = false
  upper   = false
  number  = false
}

resource "azurerm_storage_account" "main" {
  name                     = "safunc${random_string.random.result}"
  resource_group_name      = "${azurerm_resource_group.main.name}"
  location                 = "${azurerm_resource_group.main.location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_app_service_plan" "main" {
  name                = "azure-functions-service-plan"
  location            = "${azurerm_resource_group.main.location}"
  resource_group_name = "${azurerm_resource_group.main.name}"
  kind                = "FunctionApp"

  sku {
    tier = "Standard"
    size = "S1"
  }
}

resource "azurerm_application_insights" "main" {
  name                = "matchmaker-appinsights"
  location            = "${azurerm_resource_group.main.location}"
  resource_group_name = "${azurerm_resource_group.main.name}"
  application_type    = "Node.JS"
}

resource "azurerm_function_app" "main" {
  name                      = "matchmaker-${random_string.random.result}"
  location                  = "${azurerm_resource_group.main.location}"
  resource_group_name       = "${azurerm_resource_group.main.name}"
  app_service_plan_id       = "${azurerm_app_service_plan.main.id}"
  storage_connection_string = "${azurerm_storage_account.main.primary_connection_string}"
  version                   = "2"
  site_config {
    always_on = true
    cors {
      allowed_origins = ["*"]
    }
  }

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME       = "node"
    WEBSITE_NODE_DEFAULT_VERSION   = "~10"
    APPINSIGHTS_INSTRUMENTATIONKEY = "${azurerm_application_insights.main.instrumentation_key}"
  }
}
