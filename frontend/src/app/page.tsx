'use client'

import { useState } from 'react'
import Image from 'next/image'

// Ratios de calcul
const RATIOS = {
  POSTE_TRAVAIL: 5.5,
  SALLE_REUNION: 25,
  ESPACES_COMMUNS: 2.5,
}

const BUREAUX_PRIVATIFS: Record<number, number> = {
  0: 0, 1: 10, 2: 15, 3: 20, 4: 25,
}

// Prix par quartier (€/m²/mois)
const QUARTIERS = [
  { id: 'premium', name: 'Triangle d\'or (8e, 16e, 17e ouest)', prixMin: 600, prixMax: 850 },
  { id: 'centre', name: 'Centre (1er, 2e, 9e, 10e)', prixMin: 500, prixMax: 700 },
  { id: 'est', name: 'Est parisien (3e, 4e, 11e, 12e)', prixMin: 450, prixMax: 600 },
  { id: 'sud', name: 'Sud (5e, 6e, 13e, 14e, 15e)', prixMin: 400, prixMax: 550 },
  { id: 'nord', name: 'Nord (17e est, 18e, 19e, 20e)', prixMin: 350, prixMax: 500 },
  { id: 'indifferent', name: 'Pas de préférence', prixMin: 350, prixMax: 850 },
]

const DELAIS = [
  { id: 'urgent', name: 'Dès que possible' },
  { id: '1-3mois', name: 'Dans 1 à 3 mois' },
  { id: '3-6mois', name: 'Dans 3 à 6 mois' },
  { id: '6mois+', name: 'Dans plus de 6 mois' },
  { id: 'indetermine', name: 'Je ne sais pas encore' },
]

export default function Home() {
  const [postesTravail, setPostesTravail] = useState(0)
  const [sallesReunion, setSallesReunion] = useState(0)
  const [bureauxPrivatifs, setBureauxPrivatifs] = useState(0)
  const [quartier, setQuartier] = useState('')
  const [delai, setDelai] = useState('')

  // État du formulaire de contact
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    entreprise: '',
    nom: '',
    email: '',
    telephone: '',
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculs en temps réel
  const surfaceOpenSpace = postesTravail * RATIOS.POSTE_TRAVAIL
  const surfaceSallesReunion = sallesReunion * RATIOS.SALLE_REUNION
  const surfaceBureauxPrivatifs = BUREAUX_PRIVATIFS[bureauxPrivatifs] ?? 0
  const nombrePersonnes = postesTravail + bureauxPrivatifs
  const surfaceEspacesCommuns = nombrePersonnes * RATIOS.ESPACES_COMMUNS
  const surfaceTotale = Math.round(surfaceOpenSpace + surfaceSallesReunion + surfaceBureauxPrivatifs + surfaceEspacesCommuns)

  // Calcul du prix estimé
  const quartierSelectionne = QUARTIERS.find(q => q.id === quartier)
  const prixMin = quartierSelectionne ? Math.round(surfaceTotale * quartierSelectionne.prixMin / 12) : 0
  const prixMax = quartierSelectionne ? Math.round(surfaceTotale * quartierSelectionne.prixMax / 12) : 0

  const handleInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<number>>,
    max?: number
  ) => {
    const num = parseInt(value) || 0
    const validNum = Math.max(0, max !== undefined ? Math.min(num, max) : num)
    setter(validNum)
  }

  const increment = (setter: React.Dispatch<React.SetStateAction<number>>, max?: number) => {
    setter(prev => (max !== undefined ? Math.min(prev + 1, max) : prev + 1))
  }

  const decrement = (setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => Math.max(prev - 1, 0))
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simuler l'envoi (à remplacer par un vrai endpoint)
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Lead capturé:', {
      ...contactForm,
      surface: surfaceTotale,
      quartier: quartierSelectionne?.name,
      delai: DELAIS.find(d => d.id === delai)?.name,
      details: {
        bureauxPrivatifs,
        postesTravail,
        sallesReunion,
      }
    })

    setIsSubmitting(false)
    setFormSubmitted(true)
  }

  const isCalculComplete = surfaceTotale > 0

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Image
            src="/logo-snapdesk.png"
            alt="Snapdesk"
            width={160}
            height={40}
            priority
          />
          <span className="text-sm text-gray-500 hidden sm:block">Venez pour la flexibilité, restez pour l'expérience</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Calculateur de surface</h2>
          <p className="text-gray-500">Estimez la surface et le budget pour vos futurs bureaux à Paris</p>
        </div>

        {/* Section Bureaux privatifs */}
        <section className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-snapdesk-secondary">Bureaux privatifs</h3>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
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
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => decrement(setBureauxPrivatifs)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={bureauxPrivatifs}
                    onChange={(e) => handleInputChange(e.target.value, setBureauxPrivatifs, 4)}
                    className="w-16 px-2 py-2 text-center text-gray-800 font-medium border-0 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                    max="4"
                  />
                  <button
                    onClick={() => increment(setBureauxPrivatifs, 4)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  Surface : <span className="font-medium">{surfaceBureauxPrivatifs} m²</span>
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
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-snapdesk-secondary font-medium">Nombre de postes</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => decrement(setPostesTravail)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={postesTravail}
                    onChange={(e) => handleInputChange(e.target.value, setPostesTravail)}
                    className="w-16 px-2 py-2 text-center text-gray-800 font-medium border-0 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                  />
                  <button
                    onClick={() => increment(setPostesTravail)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  Surface : <span className="font-medium">{surfaceOpenSpace} m²</span>
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
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-snapdesk-secondary font-medium">Nombre de salles</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => decrement(setSallesReunion)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={sallesReunion}
                    onChange={(e) => handleInputChange(e.target.value, setSallesReunion)}
                    className="w-16 px-2 py-2 text-center text-gray-800 font-medium border-0 focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    min="0"
                  />
                  <button
                    onClick={() => increment(setSallesReunion)}
                    className="px-3 py-2 bg-snapdesk-primary text-white hover:bg-snapdesk-primary-dark transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-600">
                  Surface : <span className="font-medium">{surfaceSallesReunion} m²</span>
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
                Circulation, accueil, sanitaires, espace détente, cuisine...
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

        {/* Section Localisation */}
        <section className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-snapdesk-secondary">Localisation souhaitée</h3>
            <p className="text-sm text-gray-500 mt-1">Pour estimer votre budget mensuel</p>
          </div>

          <div className="p-6">
            <select
              value={quartier}
              onChange={(e) => setQuartier(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snapdesk-primary focus:border-snapdesk-primary text-gray-800"
            >
              <option value="">Sélectionnez un quartier</option>
              {QUARTIERS.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.name} ({q.prixMin}€ - {q.prixMax}€/m²/an)
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Section Délai */}
        <section className="bg-white rounded-lg border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-snapdesk-secondary">Date d&apos;emménagement</h3>
            <p className="text-sm text-gray-500 mt-1">Quand souhaitez-vous emménager ?</p>
          </div>

          <div className="p-6">
            <select
              value={delai}
              onChange={(e) => setDelai(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snapdesk-primary focus:border-snapdesk-primary text-gray-800"
            >
              <option value="">Sélectionnez un délai</option>
              {DELAIS.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </section>

        {/* Total */}
        <div className="bg-snapdesk-secondary rounded-lg p-6 text-white mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div>
              <h3 className="text-xl font-semibold">Surface totale estimée</h3>
              <p className="text-white/80 text-sm mt-1">
                {bureauxPrivatifs} bureau(x) privatif(s) + {postesTravail} poste(s) open space + {sallesReunion} salle(s) de réunion
              </p>
            </div>
            <span className="text-4xl font-bold">{surfaceTotale} m²</span>
          </div>

          {quartierSelectionne && surfaceTotale > 0 && (
            <div className="border-t border-white/20 pt-4 mt-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="font-semibold">Budget mensuel estimé</h4>
                  <p className="text-white/80 text-sm">{quartierSelectionne.name}</p>
                </div>
                <span className="text-2xl font-bold">
                  {prixMin.toLocaleString()}€ - {prixMax.toLocaleString()}€ / mois
                </span>
              </div>
            </div>
          )}
        </div>

        {/* CTA - Formulaire de contact */}
        {isCalculComplete && !showContactForm && !formSubmitted && (
          <div className="bg-white rounded-lg border-2 border-snapdesk-secondary p-6 mb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Recevez des propositions personnalisées
            </h3>
            <p className="text-gray-600 mb-4">
              Nos experts vous envoient une sélection de bureaux correspondant à vos critères
            </p>
            <button
              onClick={() => setShowContactForm(true)}
              className="bg-snapdesk-secondary text-white px-8 py-3 rounded-lg font-semibold hover:bg-snapdesk-secondary-dark transition-colors"
            >
              Recevoir ma sélection gratuite
            </button>
          </div>
        )}

        {/* Formulaire de contact */}
        {showContactForm && !formSubmitted && (
          <form onSubmit={handleContactSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Vos coordonnées</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;entreprise *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.entreprise}
                  onChange={(e) => setContactForm({...contactForm, entreprise: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snapdesk-primary focus:border-snapdesk-primary text-gray-800"
                  placeholder="Votre entreprise"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre nom *
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.nom}
                  onChange={(e) => setContactForm({...contactForm, nom: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snapdesk-primary focus:border-snapdesk-primary text-gray-800"
                  placeholder="Prénom Nom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email professionnel *
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snapdesk-primary focus:border-snapdesk-primary text-gray-800"
                  placeholder="vous@entreprise.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={contactForm.telephone}
                  onChange={(e) => setContactForm({...contactForm, telephone: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-snapdesk-primary focus:border-snapdesk-primary text-gray-800"
                  placeholder="06 XX XX XX XX"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-snapdesk-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-snapdesk-secondary-dark transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Recevoir ma sélection'}
              </button>
              <button
                type="button"
                onClick={() => setShowContactForm(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              En soumettant ce formulaire, vous acceptez d&apos;être contacté par Snapdesk concernant votre recherche de bureaux.
            </p>
          </form>
        )}

        {/* Message de confirmation */}
        {formSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6 text-center">
            <div className="text-green-600 text-4xl mb-2">✓</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              Demande envoyée avec succès !
            </h3>
            <p className="text-green-700">
              Un expert Snapdesk vous contactera dans les 24h avec une sélection personnalisée de bureaux.
            </p>
          </div>
        )}

        {/* Réassurance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-2">🏢</div>
            <h4 className="font-semibold text-gray-800">+50 espaces</h4>
            <p className="text-sm text-gray-500">à Paris intramuros</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold text-gray-800">Flexibilité</h4>
            <p className="text-sm text-gray-500">Baux de 1 à 10 ans</p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
            <div className="text-2xl mb-2">🤝</div>
            <h4 className="font-semibold text-gray-800">Accompagnement</h4>
            <p className="text-sm text-gray-500">Un expert dédié</p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-gray-500 text-sm">
          Cette estimation est indicative et peut varier selon la configuration des locaux.
        </p>
      </div>
    </main>
  )
}
