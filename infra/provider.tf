# Configure the Azure Provider
provider "azurerm" {
  # whilst the `version` attribute is optional, we recommend pinning to a given version of the Provider
  version = "=1.35.0"
}

terraform {
  backend "azurerm" {
    resource_group_name  = "__resourcegroup__"
    storage_account_name = "__storageaccount__"
    container_name       = "__application__"
    key                  = "__environment__.__application__.terraform.tfstate"
  }
}
