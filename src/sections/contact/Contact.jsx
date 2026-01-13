import { useState, useEffect, useMemo } from 'react'
import contactData from '../../data/contact.json'
import ContactInfoCard from '../../components/contact/ContactInfoCard'
import SocialLinksCard from '../../components/contact/SocialLinksCard'
import PreferredContactCard from '../../components/contact/PreferredContactCard'

function Contact() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    try {
      setTimeout(() => {
        setData(contactData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading contact data:', error)
      setLoading(false)
    }
  }, [])

  // Get data with fallbacks
  const meta = useMemo(() => data?.meta || {}, [data])
  const contact = useMemo(() => data?.contact || {}, [data])
  const social = useMemo(() => data?.social || {}, [data])
  const preferredContact = useMemo(() => {
    if (!data?.preferredContact || !Array.isArray(data.preferredContact)) return []
    // Sort by priority if available
    return [...data.preferredContact].sort((a, b) => {
      const priorityA = a.priority || 999
      const priorityB = b.priority || 999
      return priorityA - priorityB
    })
  }, [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading contact information...</p>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-head text-3xl font-bold mb-4">Contact</h1>
            <p className="text-body">No contact data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          {meta.title && (
            <h1 className="text-head text-4xl md:text-5xl font-bold mb-2">
              {meta.title}
            </h1>
          )}
          {meta.subtitle && (
            <p className="text-body text-lg md:text-xl max-w-3xl mx-auto">
              {meta.subtitle}
            </p>
          )}
        </header>

        {/* Preferred Contact Methods */}
        {preferredContact && preferredContact.length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
              Preferred Ways to Reach Me
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preferredContact.map((method, index) => (
                <PreferredContactCard
                  key={method.method || index}
                  method={method}
                  contact={contact}
                  social={social}
                />
              ))}
            </div>
          </section>
        )}

        {/* Contact Information */}
        {(contact.email || contact.phone || contact.location) && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ContactInfoCard contact={contact} />
            </div>
          </section>
        )}

        {/* Social Media Links */}
        {social && Object.keys(social).length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
              Connect on Social Media
            </h2>
            <SocialLinksCard social={social} />
          </section>
        )}
      </div>
    </div>
  )
}

export default Contact
