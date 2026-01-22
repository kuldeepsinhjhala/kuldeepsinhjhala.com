/**
 * CertificationCard - Displays a certification
 */
function CertificationCard({ certification = {} }) {
  if (!certification || !certification.name) return null

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const getStatusBadge = (status) => {
    if (!status) return null
    const statusMap = {
      active: { label: 'Active', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      expired: { label: 'Expired', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
      pending: { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    }
    const statusInfo = statusMap[status.toLowerCase()] || { label: status, color: 'bg-card/80 text-body border-gold/10' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${statusInfo.color} backdrop-blur-sm shadow-sm`}>
        {statusInfo.label}
      </span>
    )
  }

  return (
    <div
      className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-5 md:p-6 shadow-lg h-full flex flex-col"
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Header */}
      <div className="mb-4 pb-4 border-b border-gold/20">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h5 className="text-head text-lg font-semibold flex-1">
            {certification.name}
          </h5>
          {getStatusBadge(certification.status)}
        </div>
        
        {/* Issuer */}
        {certification.issuer && (
          <p className="text-gold text-sm font-medium">
            {certification.issuer}
          </p>
        )}
      </div>

      {/* Description */}
      {certification.description && (
        <p className="text-body text-sm mb-4 leading-relaxed flex-1">
          {certification.description}
        </p>
      )}

      {/* Skills Covered */}
      {certification.skillsCovered && Array.isArray(certification.skillsCovered) && certification.skillsCovered.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5">
            {certification.skillsCovered.map((skill, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Dates and Credential Info */}
      <div className="mt-auto space-y-2 pt-4 border-t border-gold/10">
        {certification.issueDate && (
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-body">
              Issued: {formatDate(certification.issueDate)}
            </span>
          </div>
        )}
        {certification.expiryDate && (
          <div className="flex items-center gap-2 text-xs">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-body">
              Expires: {formatDate(certification.expiryDate)}
            </span>
          </div>
        )}
        {certification.credentialId && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-body">ID: </span>
            <span className="text-head font-mono">{certification.credentialId}</span>
          </div>
        )}
      </div>

      {/* Links */}
      <div className="mt-4 flex gap-2">
        {(certification.url || certification.verificationUrl) && (
          <a
            href={certification.url || certification.verificationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold/80 hover:underline text-sm font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            View Certificate
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      {/* Custom Fields */}
      {certification.custom && Object.keys(certification.custom).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gold/10 space-y-1">
          {Object.entries(certification.custom).map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="text-xs">
                  <span className="text-head font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                  </span>
                  <span className="text-body">
                    {value.join(', ')}
                  </span>
                </div>
              )
            }
            return (
              <div key={key} className="text-xs">
                <span className="text-head font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                </span>
                <span className="text-body">{String(value)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CertificationCard

