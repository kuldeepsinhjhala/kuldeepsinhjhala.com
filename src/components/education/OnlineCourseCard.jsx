/**
 * OnlineCourseCard - Displays an online course
 */
function OnlineCourseCard({ course = {} }) {
  if (!course || !course.name) return null

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
      completed: { label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'in-progress': { label: 'In Progress', color: 'bg-gold/20 text-gold border-gold/30' },
      enrolled: { label: 'Enrolled', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      paused: { label: 'Paused', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
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
            {course.name}
          </h5>
          {getStatusBadge(course.status)}
        </div>
        
        {/* Platform and Instructor */}
        <div className="space-y-1">
          {course.platform && (
            <p className="text-gold text-sm font-medium">
              {course.platform}
            </p>
          )}
          {course.instructor && (
            <p className="text-body text-xs">
              by {course.instructor}
            </p>
          )}
        </div>
      </div>

      {/* Skills Learned */}
      {course.skillsLearned && Array.isArray(course.skillsLearned) && course.skillsLearned.length > 0 && (
        <div className="mb-4 flex-1">
          <h6 className="text-head text-xs font-semibold mb-2 uppercase tracking-wide">
            Skills Learned
          </h6>
          <div className="flex flex-wrap gap-1.5">
            {course.skillsLearned.map((skill, idx) => (
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

      {/* Dates */}
      {course.dates && (
        <div className="mt-auto space-y-2 pt-4 border-t border-gold/10">
          {course.dates.startDate && (
            <div className="flex items-center gap-2 text-xs">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-body">
                Started: {formatDate(course.dates.startDate)}
              </span>
            </div>
          )}
          {course.dates.completionDate && (
            <div className="flex items-center gap-2 text-xs">
              <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-body">
                Completed: {formatDate(course.dates.completionDate)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Certificate Link */}
      {course.certificateUrl && (
        <div className="mt-4">
          <a
            href={course.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold/80 text-sm font-medium transition-colors inline-flex items-center gap-1"
          >
            View Certificate
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      {/* Custom Fields */}
      {course.custom && Object.keys(course.custom).length > 0 && (
        <div className="mt-4 pt-4 border-t border-gold/10 space-y-1">
          {Object.entries(course.custom).map(([key, value]) => {
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

export default OnlineCourseCard

