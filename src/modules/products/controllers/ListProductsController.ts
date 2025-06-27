import { ListProductsService } from '../services/ListProductsService'

export async function ListProductsController() {
  const listProducts = new ListProductsService()

  const products = await listProducts.execute()

  return {
    products,
  }
}
