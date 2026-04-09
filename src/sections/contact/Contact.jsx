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
  const meta = useMemo(() => data?.meta || {}, [data])
  const contact = useMemo(() => data?.contact || {}, [data])
  const social = useMemo(() => data?.social || {}, [data])
  const footerSlogan = useMemo(() => data?.footerSlogan || {}, [data])

  const hasContact =
    contact?.email?.primary ||
    contact?.phone?.primary ||
    (contact?.location &&
      [contact.location.city, contact.location.state, contact.location.country].some(Boolean))
  const hasSocial = social && Object.keys(social).length > 0

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-2 md:pt-0 lg:px-12 lg:pb-3 lg:pt-0">
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
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-2 md:pt-0 lg:px-12 lg:pb-3 lg:pt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="section-heading-highlight text-head text-3xl font-bold mb-4">Contact</h2>
            <p className="text-body">No contact data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted px-4 pt-0 pb-[min(28vh,10rem)] md:pb-[min(26vh,9rem)] lg:pb-24 xl:pb-28 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 md:mb-14 text-center">
          {meta.title && (
            <h2 className="section-heading-highlight text-head text-4xl md:text-5xl font-bold mb-2">{meta.title}</h2>
          )}
        </header>

        <div className="space-y-14 md:space-y-16">
          {hasContact && (
            <section aria-labelledby="contact-details-heading">
              <h2
                id="contact-details-heading"
                className="section-heading-highlight text-head text-xl md:text-2xl font-bold mb-6 md:mb-8"
              >
                Contact details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ContactInfoCard contact={contact} />
              </div>
            </section>
          )}

          {hasSocial && (
            <section aria-labelledby="social-heading">
              <h2
                id="social-heading"
                className="section-heading-highlight text-head text-xl md:text-2xl font-bold mb-3 md:mb-4"
              >
                Social media
              </h2>
              <SocialLinksCard social={social} />
            </section>
          )}
        </div>

        {(footerSlogan.line1 || footerSlogan.line2 || footerSlogan.om) && (
          <footer
            className="mt-14 md:mt-16 pt-10 md:pt-12 text-center max-w-2xl mx-auto px-1"
            aria-label="Closing note"
          >
            {(footerSlogan.line1 || footerSlogan.line2) && (
              <div className="space-y-2.5 md:space-y-3">
                {footerSlogan.line1 && (
                  <p
                    className="text-gold text-base md:text-lg font-medium leading-snug"
                    lang="hi"
                  >
                    {footerSlogan.line1}
                  </p>
                )}
                {footerSlogan.line2 && (
                  <p className="text-body text-sm md:text-base leading-relaxed">
                    {footerSlogan.line2}
                  </p>
                )}
              </div>
            )}
            {footerSlogan.om && (
              <p
                className={`om-symbol-glow text-2xl md:text-3xl lg:text-4xl font-medium leading-none mb-5 md:mb-7 ${
                  footerSlogan.line1 || footerSlogan.line2 ? 'mt-6 md:mt-8' : 'mt-0'
                }`}
                lang="sa"
              >
                {footerSlogan.om}
              </p>
            )}
          </footer>
        )}
      </div>
    </div>
  )
}

export default Contact
