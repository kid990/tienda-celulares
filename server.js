import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

// Middleware
app.use(cors())
app.use(express.json())

const CELULARES_FILE = path.join(__dirname, 'public', 'celulares.json')

// GET - Obtener todos los celulares
app.get('/api/celulares', async (req, res) => {
  try {
    const data = await fs.readFile(CELULARES_FILE, 'utf-8')
    const celulares = JSON.parse(data)
    res.json(celulares)
  } catch (error) {
    console.error('Error al leer celulares:', error)
    res.status(500).json({ error: 'Error al leer los datos' })
  }
})

// POST - Crear un nuevo celular
app.post('/api/celulares', async (req, res) => {
  try {
    const data = await fs.readFile(CELULARES_FILE, 'utf-8')
    const celulares = JSON.parse(data)
    
    const nuevoCelular = {
      id: Date.now(),
      ...req.body
    }
    
    celulares.push(nuevoCelular)
    
    await fs.writeFile(CELULARES_FILE, JSON.stringify(celulares, null, 2))
    res.status(201).json(nuevoCelular)
  } catch (error) {
    console.error('Error al crear celular:', error)
    res.status(500).json({ error: 'Error al crear el celular' })
  }
})

// PUT - Actualizar un celular
app.put('/api/celulares/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const data = await fs.readFile(CELULARES_FILE, 'utf-8')
    let celulares = JSON.parse(data)
    
    const index = celulares.findIndex(cel => cel.id === id)
    
    if (index === -1) {
      return res.status(404).json({ error: 'Celular no encontrado' })
    }
    
    celulares[index] = { ...celulares[index], ...req.body, id }
    
    await fs.writeFile(CELULARES_FILE, JSON.stringify(celulares, null, 2))
    res.json(celulares[index])
  } catch (error) {
    console.error('Error al actualizar celular:', error)
    res.status(500).json({ error: 'Error al actualizar el celular' })
  }
})

// DELETE - Eliminar un celular
app.delete('/api/celulares/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const data = await fs.readFile(CELULARES_FILE, 'utf-8')
    let celulares = JSON.parse(data)
    
    const celularesActualizados = celulares.filter(cel => cel.id !== id)
    
    if (celulares.length === celularesActualizados.length) {
      return res.status(404).json({ error: 'Celular no encontrado' })
    }
    
    await fs.writeFile(CELULARES_FILE, JSON.stringify(celularesActualizados, null, 2))
    res.json({ message: 'Celular eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar celular:', error)
    res.status(500).json({ error: 'Error al eliminar el celular' })
  }
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
