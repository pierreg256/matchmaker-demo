output "ResourceGroupName" {
  value = "${azurerm_resource_group.main.name}"
}
output "InstrumentationKey" {
  value = "${azurerm_application_insights.main.instrumentation_key}"
}

output "WebApp" {
  value = "${azurerm_function_app.main.default_hostname}"
}

output "CosmosDBConnections" {
  value = "${azurerm_cosmosdb_account.main.connection_strings[0]}"
}

output "WebSite" {
  value = "${azurerm_storage_account.web.primary_web_endpoint}"
}


