import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { SITE_ORIGIN } from '../config/site'
import landingData from '../data/landing.json'
import contactData from '../data/contact.json'

const DEFAULT_TITLE = landingData?.meta?.title || 'Kuldeepsinh Jhala | Portfolio'
const DEFAULT_DESC =
  landingData?.hero?.description ||
  'Full-stack developer building scalable web applications with React, Node.js, and AWS.'

const ROUTE_SEO = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESC,
    keywords:
      'Kuldeepsinh Jhala, Full Stack Developer, React, Node.js, AWS, AI, LLM, Portfolio',
  },
  '/skills': {
    title: 'Skills | Kuldeepsinh Jhala',
    description:
      'Technical skills: frontend with React, backend with Node.js, AI and LLM integration, databases, and AWS cloud deployment.',
    keywords: 'Skills, React, Node.js, TypeScript, AWS, PostgreSQL, AI, LLM',
  },
  '/experience': {
    title: 'Experience | Kuldeepsinh Jhala',
    description:
      'Professional work experience, roles, and impact building production software systems.',
    keywords: 'Work experience, Software Engineer, Backend, Full Stack',
  },
  '/resume': {
    title: 'Resume | Kuldeepsinh Jhala',
    description:
      'Download or open my resume on Google Drive — PDF full-stack and AI engineering background.',
    keywords: 'Resume, CV, PDF, Software Engineer',
  },
  '/projects': {
    title: 'Projects | Kuldeepsinh Jhala',
    description:
      'Selected projects: architecture, stack, problems solved, and links to demos and repositories.',
    keywords: 'Projects, Portfolio, Web Apps, Open Source',
  },
  '/achievements': {
    title: 'Achievements | Kuldeepsinh Jhala',
    description:
      'Certifications, awards, and milestones across engineering and continuous learning.',
    keywords: 'Achievements, Certifications, Awards',
  },
  '/journey': {
    title: 'Journey | Kuldeepsinh Jhala',
    description:
      'Career journey, education path, and milestones in software engineering.',
    keywords: 'Career journey, Timeline, Software Engineer',
  },
  '/education': {
    title: 'Education | Kuldeepsinh Jhala',
    description:
      'Degrees, coursework, and certifications supporting full-stack and AI-focused engineering.',
    keywords: 'Education, Degree, Computer Science, Certifications',
  },
  '/contact': {
    title: 'Contact | Kuldeepsinh Jhala',
    description:
      'Get in touch via email, phone, or social links. Based in Vadodara, Gujarat, India.',
    keywords: 'Contact, Email, LinkedIn, GitHub, Hire',
  },
}

function normalizePath(pathname) {
  if (!pathname || pathname === '/') return '/'
  const trimmed = pathname.replace(/\/+$/, '') || '/'
  return trimmed === '' ? '/' : trimmed
}

function buildPersonJsonLd() {
  const social = contactData?.social || {}
  const sameAs = [
    social.github?.url,
    social.linkedin?.url,
    social.twitter?.url,
    social.instagram?.url,
    social.medium?.url,
  ].filter(Boolean)

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: landingData?.hero?.name || 'Kuldeepsinh Jhala',
    url: SITE_ORIGIN,
    jobTitle: landingData?.hero?.designation || 'Software Engineer',
    sameAs,
  }
}

export default function Seo() {
  const { pathname } = useLocation()
  const path = normalizePath(pathname)
  const meta = ROUTE_SEO[path] || ROUTE_SEO['/']
  const canonicalUrl = `${SITE_ORIGIN}${path === '/' ? '/' : path}`
  const ogImageUrl = `${SITE_ORIGIN}/og-image.png`
  const personLd = buildPersonJsonLd()

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImageUrl} />

      <script type="application/ld+json">{JSON.stringify(personLd)}</script>
    </Helmet>
  )
}
