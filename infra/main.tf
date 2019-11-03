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

resource "azurerm_storage_account" "main" {
  name                     = "${var.environment}${var.application}"
  resource_group_name      = "${azurerm_resource_group.main.name}"
  location                 = "${azurerm_resource_group.main.location}"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = "${local.tags}"
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
  site_config {
    always_on = true
    cors {
      allowed_origins = ["*"]
    }
  }

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME       = "node"
    WEBSITE_NODE_DEFAULT_VERSION   = "10.14.1"
    APPINSIGHTS_INSTRUMENTATIONKEY = "${azurerm_application_insights.main.instrumentation_key}"
  }

  tags = "${local.tags}"
}
