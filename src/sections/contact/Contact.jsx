import { useState, useEffect, useMemo } from 'react'
import contactData from '../../data/contact.json'
import ContactInfoCard from '../../components/contact/ContactInfoCard'
import SocialLinksCard from '../../components/contact/SocialLinksCard'

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
  const contact = useMemo(() => data?.contact || {}, [data])
  const social = useMemo(() => data?.social || {}, [data])

  const hasContact =
    contact?.email?.primary ||
    contact?.phone?.primary ||
    (contact?.location &&
      [contact.location.city, contact.location.state, contact.location.country].some(Boolean))
  const hasSocial = social && Object.keys(social).length > 0

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted pb-2 pt-8 md:pb-2 md:pt-10 lg:pb-3 lg:pt-12">
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
      <div className="bg-dotted pb-2 pt-8 md:pb-2 md:pt-10 lg:pb-3 lg:pt-12">
        <div className="site-shell">
          <div className="text-center py-12">
            <p className="text-body">No contact data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted pb-12 pt-8 md:pb-16 md:pt-10 lg:pb-20 lg:pt-12">
      <div className="site-shell">
        <div className="space-y-14 md:space-y-16">
          {hasContact && (
            <section aria-labelledby="contact-details-heading">
              <h2
                id="contact-details-heading"
                className="section-heading-highlight text-head text-xl md:text-2xl font-bold mb-6 md:mb-8"
              >
                Contact details
              </h2>
              <div className="w-full">
                <ContactInfoCard contact={contact} />
              </div>
            </section>
          )}

          {hasSocial && (
            <section aria-labelledby="social-heading">
              <h2
                id="social-heading"
                className="section-heading-highlight text-head text-xl md:text-2xl font-bold mb-6 md:mb-8"
              >
                Social media
              </h2>
              <SocialLinksCard social={social} />
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default Contact
