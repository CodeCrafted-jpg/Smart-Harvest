
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Leaf,
  Cloud,
  Sprout,
  Thermometer,
  Droplets,
  MessageCircle,
  MoreVertical,
  Plus,
  Trash,
  Play
} from 'lucide-react'
import { useUser } from '@clerk/nextjs'


const TOPICS = [
  {
    id: 'pest-control',
    title_en: 'Pest Control',
    title_hi: 'कीट नियंत्रण',
    desc_en: 'Identify pests and remedies for crops.',
    desc_hi: 'फसलों में कीट पहचान और उपाय।',
    icon: 'sprout',
    assistantId: 'assistant_pest'
  },
  {
    id: 'soil-health',
    title_en: 'About Soil',
    title_hi: 'मिट्टी के बारे में',
    desc_en: 'Soil testing basics, nutrients, and fixes.',
    desc_hi: 'मिट्टी परीक्षण, पोषक तत्व और सुधार।',
    icon: 'thermometer',
    assistantId: 'assistant_soil'
  },
  {
    id: 'weather',
    title_en: 'Weather',
    title_hi: 'मौसम',
    desc_en: 'Advice for weather-based actions and timing.',
    desc_hi: 'मौसम के अनुसार किए जाने वाले कदम।',
    icon: 'cloud',
    assistantId: 'assistant_weather'
  },
  {
    id: 'irrigation',
    title_en: 'Irrigation',
    title_hi: 'सिंचाई',
    desc_en: 'Water schedules and efficient irrigation.',
    desc_hi: 'जल तालिका और कुशल सिंचाई।',
    icon: 'droplets',
    assistantId: 'assistant_irrigation'
  },
  {
    id: 'fertilizers',
    title_en: 'Fertilizers',
    title_hi: 'उर्वरक',
    desc_en: 'Which fertilizer when and how much.',
    desc_hi: 'कौन सा उर्वरक, कब और कितना।',
    icon: 'leaf',
    assistantId: 'assistant_fertilizer'
  }
]

export default function VapiCropCoachingPage() {
  const router = useRouter()
  const { user, isSignedIn } = useUser && typeof useUser === 'function' ? useUser() : { user: null, isSignedIn: false }

  const [uiLang, setUiLang] = useState('en')
  const [activeTopic, setActiveTopic] = useState(null)
  const [callLang, setCallLang] = useState('en')

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({ title: '', description: '', lang: 'en' })
  const [userCards, setUserCards] = useState([])

  // Load user cards from localStorage (fallback) — later you can save to DB
  useEffect(() => {
    try {
      const raw = localStorage.getItem('vapi_user_cards')
      if (raw) setUserCards(JSON.parse(raw))
    } catch (e) {
      console.warn('LocalStorage read failed', e)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('vapi_user_cards', JSON.stringify(userCards))
    } catch (e) {
      console.warn('LocalStorage write failed', e)
    }
  }, [userCards])

  function openTopic(topic) {
    setActiveTopic(topic)
    setCallLang('en')
  }

  function closeTopic() {
    setActiveTopic(null)
  }

  function startCoaching({ topic, lang, assistantId }) {
    // Navigate to your AgriChat page or Vapi starter route.
    // We'll push query params: assistant, lang, topic
    const asId = assistantId || topic.assistantId || topic.id
    const url = `/agrichat?assistant=${encodeURIComponent(asId)}&lang=${lang}&topic=${encodeURIComponent(topic.id)}`
    router.push(url)
  }

  function handleCreateCard(e) {
    e.preventDefault()
    const newCard = {
      id: `user_${Date.now()}`,
      title: createForm.title || 'Untitled Problem',
      description: createForm.description || '',
      lang: createForm.lang || 'en',
      createdAt: new Date().toISOString()
    }
    setUserCards((s) => [newCard, ...s])
    setCreateForm({ title: '', description: '', lang: 'en' })
    setShowCreateModal(false)
  }

  function removeCard(id) {
    setUserCards((s) => s.filter((c) => c.id !== id))
  }

  // small helper to render icons
  const Icon = ({ name, className = 'h-5 w-5' }) => {
    switch (name) {
      case 'cloud': return <Cloud className={className} />
      case 'sprout': return <Sprout className={className} />
      case 'thermometer': return <Thermometer className={className} />
      case 'droplets': return <Droplets className={className} />
      default: return <Leaf className={className} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 mt-15">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Vapi Coaching — Crop Help</h1>
              <p className="text-sm text-green-600">Choose a topic, pick a language, and start a coaching call.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(31,41,55,0.06)' }}>
              <button onClick={() => setUiLang('en')} className={`px-3 py-1 text-sm ${uiLang === 'en' ? 'font-semibold' : 'opacity-80'}`}>English</button>
              <button onClick={() => setUiLang('hi')} className={`px-3 py-1 text-sm ${uiLang === 'hi' ? 'font-semibold' : 'opacity-80'}`}>हिन्दी</button>
            </div>

            <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm text-white" style={{ backgroundColor: '#10B981' }}>
              <Plus className="h-4 w-4" />
              <span className="text-sm">Create User Card</span>
            </button>
          </div>
        </div>

        {/* Cards grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOPICS.map((t) => (
            <article key={t.id} className="bg-white rounded-2xl p-5 shadow hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between" onClick={() => openTopic(t)}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#10B981', color: 'white' }}>
                  <Icon name={t.icon} className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{uiLang === 'en' ? t.title_en : t.title_hi}</h3>
                  <p className="text-sm mt-1 text-gray-600">{uiLang === 'en' ? t.desc_en : t.desc_hi}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-md border" style={{ borderColor: 'rgba(31,41,55,0.06)' }}>AI Coaching</span>
                <div className="text-xs text-gray-500">{t.id}</div>
              </div>
            </article>
          ))}

          {/* user-created cards */}
          {userCards.map((c) => (
            <article key={c.id} className="bg-white rounded-2xl p-5 shadow flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{c.title}</h3>
                <p className="text-sm mt-2 text-gray-600 line-clamp-3">{c.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">{c.lang === 'en' ? 'English' : 'हिन्दी'}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startCoaching({ topic: { id: c.id }, lang: c.lang, assistantId: 'assistant_user' })} className="px-3 py-1 rounded-md text-sm text-white" style={{ backgroundColor: '#059669' }}>Start</button>
                  <button onClick={() => removeCard(c.id)} className="px-2 py-1 rounded-md text-sm border" style={{ borderColor: 'rgba(31,41,55,0.06)' }}>
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Active topic modal */}
        {activeTopic && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={closeTopic}></div>
            <div className="relative max-w-md w-full rounded-2xl bg-white p-6 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                  <Icon name={activeTopic.icon} className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900">{uiLang === 'en' ? activeTopic.title_en : activeTopic.title_hi}</h2>
                  <p className="text-sm text-gray-600 mt-1">{uiLang === 'en' ? activeTopic.desc_en : activeTopic.desc_hi}</p>

                  <div className="mt-4 flex items-center gap-3">
                    <label className="text-sm">Language for call:</label>
                    <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'rgba(31,41,55,0.06)' }}>
                      <button className={`px-3 py-1 ${callLang === 'en' ? 'font-semibold' : 'opacity-80'}`} onClick={() => setCallLang('en')}>English</button>
                      <button className={`px-3 py-1 ${callLang === 'hi' ? 'font-semibold' : 'opacity-80'}`} onClick={() => setCallLang('hi')}>हिन्दी</button>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-3">
                    <button onClick={closeTopic} className="px-4 py-2 rounded-md border" style={{ borderColor: 'rgba(31,41,55,0.06)' }}>Cancel</button>
                    <button onClick={() => startCoaching({ topic: activeTopic, lang: callLang, assistantId: activeTopic.assistantId })} className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: '#10B981' }}>
                      <Play className="h-4 w-4 inline-block mr-2" />
                      Start Coaching
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create User Card Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowCreateModal(false)}></div>
            <form onSubmit={handleCreateCard} className="relative max-w-lg w-full rounded-2xl bg-white p-6 shadow-lg">
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 mb-4 text-white">
                <div className="flex items-center gap-3">
                  <Leaf className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold">Create User Card</h3>
                    <p className="text-xs opacity-90">Save a unique problem to consult the AI.</p>
                  </div>
                </div>
              </div>

              <label className="block text-sm">Title</label>
              <input value={createForm.title} onChange={(e) => setCreateForm((s) => ({ ...s, title: e.target.value }))} className="mt-2 w-full rounded-md border px-3 py-2" placeholder="e.g., Mango leaves turning yellow" />

              <label className="block text-sm mt-3">Description</label>
              <textarea value={createForm.description} onChange={(e) => setCreateForm((s) => ({ ...s, description: e.target.value }))} className="mt-2 w-full rounded-md border px-3 py-2 h-28" placeholder="Describe the issue in detail..." />

              <label className="block text-sm mt-3">Preferred language</label>
              <select value={createForm.lang} onChange={(e) => setCreateForm((s) => ({ ...s, lang: e.target.value }))} className="mt-2 rounded-md border px-3 py-2">
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-md border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-white" style={{ backgroundColor: '#059669' }}>Save Card</button>
              </div>
            </form>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-gray-600">Made with ♥ for Smart-Harvest — integrated Vapi coaching (UI only)</footer>
      </div>
    </div>
  )
}
