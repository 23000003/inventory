// type InventoryRequest =  

export enum InventorySortByRequest {
  NAME_ASC = "name-a-z",
  NAME_DESC = "name-z-a",
  STOCK_ASC = "lowest-stock",
  STOCK_DESC = "highest-stock",
  PRICE_ASC = "price-low-to-high",
  PRICE_DESC = "price-high-to-low",
  CREATED_AT_ASC = "recently-added",
  CREATED_AT_DESC = "oldest-added",
}

export enum InventoryProductActions {
  EDIT = "edit",
  VIEW = "view"
}
