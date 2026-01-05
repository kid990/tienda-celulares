import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors())
app.use(express.json())

// Cargar datos iniciales desde JSON
const celularesPath = path.join(__dirname, '../public/celulares.json')
let celulares = []

try {
  const data = fs.readFileSync(celularesPath, 'utf-8')
  celulares = JSON.parse(data)
} catch (error) {
  console.error('Error cargando celulares.json, usando datos por defecto')
  celulares = [
    {
      "id": 1,
      "marca": "Samsung",
      "modelo": "Galaxy S23 Ultra",
      "almacenamiento": "256GB",
      "ram": "12GB",
      "precioVenta": "1299.99",
      "cantidad": "15",
      "color": "Negro Fantasma"
    },
    {
      "id": 2,
      "marca": "Apple",
      "modelo": "iPhone 15 Pro Max",
      "almacenamiento": "512GB",
      "ram": "8GB",
      "precioVenta": "1499.99",
      "cantidad": "10",
      "color": "Titanio Natural"
    },
    {
      "id": 3,
      "marca": "Xiaomi",
      "modelo": "Redmi Note 13 Pro",
      "almacenamiento": "128GB",
      "ram": "8GB",
      "precioVenta": "349.99",
      "cantidad": "25",
      "color": "Azul Océano"
    },
    {
      "id": 4,
      "marca": "Motorola",
      "modelo": "Edge 40 Pro",
      "almacenamiento": "256GB",
      "ram": "12GB",
      "precioVenta": "799.99",
      "cantidad": "8",
      "color": "Blanco Lunar"
    },
    {
      "id": 5,
      "marca": "Google",
      "modelo": "Pixel 8 Pro",
      "almacenamiento": "256GB",
      "ram": "12GB",
      "precioVenta": "999.99",
      "cantidad": "12",
      "color": "Obsidiana"
    },
    {
      "id": 6,
      "marca": "OnePlus",
      "modelo": "12 Pro",
      "almacenamiento": "512GB",
      "ram": "16GB",
      "precioVenta": "899.99",
      "cantidad": "7",
      "color": "Verde Glaciar"
    },
    {
      "id": 7,
      "marca": "Oppo",
      "modelo": "Find X6 Pro",
      "almacenamiento": "256GB",
      "ram": "12GB",
      "precioVenta": "849.99",
      "cantidad": "9",
      "color": "Marrón Desierto"
    },
    {
      "id": 8,
      "marca": "Realme",
      "modelo": "GT 3 Neo",
      "almacenamiento": "256GB",
      "ram": "8GB",
      "precioVenta": "449.99",
      "cantidad": "20",
      "color": "Blanco Nitro"
    },
    {
      "id": 9,
      "marca": "Huawei",
      "modelo": "P60 Pro",
      "almacenamiento": "512GB",
      "ram": "12GB",
      "precioVenta": "1099.99",
      "cantidad": "6",
      "color": "Negro Rocío"
    },
    {
      "id": 10,
      "marca": "Nothing",
      "modelo": "Phone 2",
      "almacenamiento": "256GB",
      "ram": "12GB",
      "precioVenta": "699.99",
      "cantidad": "14",
      "color": "Blanco"
    }
  ]
}

// NOTA: En Vercel, los cambios se guardan solo en memoria durante la sesión.
// Los datos se reinician cada vez que la función serverless se reactiva.

// GET - Obtener todos los celulares
app.get('/api/celulares', (req, res) => {
  res.json(celulares)
})

// POST - Crear un nuevo celular
app.post('/api/celulares', (req, res) => {
  const nuevoCelular = {
    id: Date.now(),
    ...req.body
  }
  celulares.push(nuevoCelular)
  res.status(201).json(nuevoCelular)
})

// PUT - Actualizar un celular
app.put('/api/celulares/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const index = celulares.findIndex(cel => cel.id === id)
  
  if (index === -1) {
    return res.status(404).json({ error: 'Celular no encontrado' })
  }
  
  celulares[index] = { ...celulares[index], ...req.body, id }
  res.json(celulares[index])
})

// DELETE - Eliminar un celular
app.delete('/api/celulares/:id', (req, res) => {
  const id = parseInt(req.params.id)
  const celularesActualizados = celulares.filter(cel => cel.id !== id)
  
  if (celulares.length === celularesActualizados.length) {
    return res.status(404).json({ error: 'Celular no encontrado' })
  }
  
  celulares = celularesActualizados
  res.json({ message: 'Celular eliminado correctamente' })
})

export default app
