'use client'

import { useState, useEffect } from 'react'

// Ratios de calcul
const RATIOS = {
  POSTE_TRAVAIL: 5.5,
  SALLE_REUNION: 25,
  ESPACES_COMMUNS: 2.5,
}

const BUREAUX_PRIVATIFS: Record<number, number> = {
  0: 0, 1: 10, 2: 15, 3: 20, 4: 25,
}

export default function Home() {
  const [postesTravail, setPostesTravail] = useState(0)
  const [sallesReunion, setSallesReunion] = useState(0)
  const [bureauxPrivatifs, setBureauxPrivatifs] = useState(0)

  // Calculs en temps réel
  const surfaceOpenSpace = postesTravail * RATIOS.POSTE_TRAVAIL
  const surfaceSallesReunion = sallesReunion * RATIOS.SALLE_REUNION
  const surfaceBureauxPrivatifs = BUREAUX_PRIVATIFS[bureauxPrivatifs] ?? 0
  const nombrePersonnes = postesTravail + bureauxPrivatifs
  const surfaceEspacesCommuns = nombrePersonnes * RATIOS.ESPACES_COMMUNS
  const surfaceTotale = Math.round(surfaceOpenSpace + surfaceSallesReunion + surfaceBureauxPrivatifs + surfaceEspacesCommuns)

  const increment = (setter: React.Dispatch<React.SetStateAction<number>>, max?: number) => {
    setter(prev => (max !== undefined ? Math.min(prev + 1, max) : prev + 1))
  }

  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => Math.max(prev - 1, 0))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-snapdesk-secondary">Snap</span>desk
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Calculateur de surface</h2>
          <p className="text-gray-500">Estimez la surface de bureaux dont vous avez besoin</p>
        </div>

        {/* Section Bureaux privatifs */}
        <section className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-snapdesk-secondary">Bureaux privatifs</h3>
                <p className="text-sm text-gray-500 mt-1">Maximum 4 bureaux</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-snapdesk-secondary font-medium">Nombre de bureaux</p>
                <p className="text-sm text-gray-500 mt-1">
                  {bureauxPrivatifs === 0 && '0 m²'}
                  {bureauxPrivatifs === 1 && '1 bureau = 10 m²'}
                  {bureauxPrivatifs === 2 && '2 bureaux = 15 m²'}
                  {bureauxPrivatifs === 3 && '3 bureaux = 20 m²'}
                  {bureauxPrivatifs === 4 && '4 bureaux = 25 m²'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <span className="px-4 py-2 bg-white text-gray-800 font-medium min-w-[3rem] text-center">
                    {bureauxPrivatifs}
                  </span>
                  <button
                    onClick={() => decrement(setBureauxPrivatifs)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => increment(setBureauxPrivatifs, 4)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600 ml-4">
                  Surface estimée : <span className="font-medium">{surfaceBureauxPrivatifs} m²</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 text-right">
            <span className="font-semibold text-gray-800">Sous-total : {surfaceBureauxPrivatifs} m²</span>
          </div>
        </section>

        {/* Section Open Space */}
        <section className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-snapdesk-secondary">Open space</h3>
                <p className="text-sm text-gray-500 mt-1">5,5 m² par poste de travail</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-snapdesk-secondary font-medium">Nombre de postes</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <span className="px-4 py-2 bg-white text-gray-800 font-medium min-w-[3rem] text-center">
                    {postesTravail}
                  </span>
                  <button
                    onClick={() => decrement(setPostesTravail)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => increment(setPostesTravail)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600 ml-4">
                  Surface estimée : <span className="font-medium">{surfaceOpenSpace} m²</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 text-right">
            <span className="font-semibold text-gray-800">Sous-total : {surfaceOpenSpace} m²</span>
          </div>
        </section>

        {/* Section Salles de réunion */}
        <section className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-snapdesk-secondary">Salles de réunion</h3>
                <p className="text-sm text-gray-500 mt-1">25 m² par salle</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-snapdesk-secondary font-medium">Nombre de salles</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <span className="px-4 py-2 bg-white text-gray-800 font-medium min-w-[3rem] text-center">
                    {sallesReunion}
                  </span>
                  <button
                    onClick={() => decrement(setSallesReunion)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    -
                  </button>
                  <button
                    onClick={() => increment(setSallesReunion)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600 ml-4">
                  Surface estimée : <span className="font-medium">{surfaceSallesReunion} m²</span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 text-right">
            <span className="font-semibold text-gray-800">Sous-total : {surfaceSallesReunion} m²</span>
          </div>
        </section>

        {/* Section Espaces communs */}
        <section className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div>
              <h3 className="text-xl font-semibold text-snapdesk-secondary">Espaces communs</h3>
              <p className="text-sm text-gray-500 mt-1">
                Circulation, accueil, sanitaires, espace détente, cuisine (2,5 m² par personne)
              </p>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Calculé automatiquement pour <span className="font-medium">{nombrePersonnes} personnes</span>
              </p>
              <span className="font-medium text-gray-800">{surfaceEspacesCommuns} m²</span>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-3 text-right">
            <span className="font-semibold text-gray-800">Sous-total : {surfaceEspacesCommuns} m²</span>
          </div>
        </section>

        {/* Total */}
        <div className="bg-snapdesk-secondary rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">Surface totale estimée</h3>
              <p className="text-white/80 text-sm mt-1">
                {bureauxPrivatifs} bureau(x) privatif(s) + {postesTravail} poste(s) open space + {sallesReunion} salle(s) de réunion
              </p>
            </div>
            <span className="text-4xl font-bold">{surfaceTotale} m²</span>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Cette estimation est indicative et peut varier selon la configuration des locaux.
        </p>
      </div>
    </main>
  )
}
