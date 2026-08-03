import path from 'path'
import fs from 'fs/promises'

export interface ProductosContent {
  titulo: string
  descripcion: string
  categorias: unknown[]
}

export async function getProductosContent(): Promise<ProductosContent> {
  const raw = await fs.readFile(
    path.join(process.cwd(), 'src/content/productos.json'),
    'utf8'
  )
  return JSON.parse(raw) as ProductosContent
}
