'use client'

import { useState } from 'react'

interface CalculResult {
  details: {
    postesTravail: { nombre: number; surface: number }
    sallesReunion: { nombre: number; surface: number }
    bureauxFermes: { nombre: number; surface: number }
    espacesCommuns: { coefficient: number; surface: number }
  }
  surfaceUtile: number
  surfaceTotale: number
}

export default function Home() {
  const [postesTravail, setPostesTravail] = useState<number>(0)
  const [sallesReunion, setSallesReunion] = useState<number>(0)
  const [bureauxFermes, setBureauxFermes] = useState<number>(0)
  const [result, setResult] = useState<CalculResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://localhost:3001/api/surfaces/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postesTravail,
          sallesReunion,
          bureauxFermes,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error)
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Calculateur de Surface
          </h1>
          <p className="text-gray-600">
            Estimez la surface de bureaux dont vous avez besoin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Vos besoins
          </h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="postes" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de postes de travail
              </label>
              <input
                type="number"
                id="postes"
                min="0"
                value={postesTravail}
                onChange={(e) => setPostesTravail(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Ex: 10"
              />
              <p className="mt-1 text-sm text-gray-500">
                Postes en open space (8 m² par poste)
              </p>
            </div>

            <div>
              <label htmlFor="salles" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de salles de réunion
              </label>
              <input
                type="number"
                id="salles"
                min="0"
                value={sallesReunion}
                onChange={(e) => setSallesReunion(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Ex: 2"
              />
              <p className="mt-1 text-sm text-gray-500">
                Salles de 6-8 personnes (15 m² par salle)
              </p>
            </div>

            <div>
              <label htmlFor="bureaux" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de bureaux fermés
              </label>
              <input
                type="number"
                id="bureaux"
                min="0"
                value={bureauxFermes}
                onChange={(e) => setBureauxFermes(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                placeholder="Ex: 1"
              />
              <p className="mt-1 text-sm text-gray-500">
                Pour dirigeants ou managers (12 m² par bureau)
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Calcul en cours...' : 'Calculer ma surface'}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Résultat de votre estimation
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Postes de travail ({result.details.postesTravail.nombre})</span>
                <span className="font-medium text-gray-900">{result.details.postesTravail.surface} m²</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Salles de réunion ({result.details.sallesReunion.nombre})</span>
                <span className="font-medium text-gray-900">{result.details.sallesReunion.surface} m²</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Bureaux fermés ({result.details.bureauxFermes.nombre})</span>
                <span className="font-medium text-gray-900">{result.details.bureauxFermes.surface} m²</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Espaces communs (+30%)</span>
                <span className="font-medium text-gray-900">{Math.round(result.details.espacesCommuns.surface)} m²</span>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-800">Surface totale estimée</span>
                <span className="text-2xl font-bold text-blue-600">{result.surfaceTotale} m²</span>
              </div>
            </div>

            <p className="mt-4 text-sm text-gray-500 text-center">
              Cette estimation inclut les espaces de circulation, accueil et sanitaires.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
