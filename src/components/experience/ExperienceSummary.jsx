/**
 * ExperienceSummary - Displays summary information about work experience
 */
function ExperienceSummary({ summary = {}, totalExperience = {}, skillsSummary = {} }) {
  if (!summary || Object.keys(summary).length === 0) return null

  return (
    <div
      className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8 shadow-lg"
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Headline */}
      {summary.headline && (
        <h2 className="text-head text-2xl md:text-3xl font-bold mb-4">
          {summary.headline}
        </h2>
      )}

      {/* Overview */}
      {summary.overview && (
        <p className="text-body text-base md:text-lg mb-6 leading-relaxed">
          {summary.overview}
        </p>
      )}

      {/* Current Role & Company */}
      {(summary.currentRole || summary.currentCompany) && (
        <div className="mb-6 pb-6 border-b border-gold/20">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            {summary.currentRole && (
              <span className="text-gold text-lg md:text-xl font-semibold">
                {summary.currentRole}
              </span>
            )}
            {summary.currentCompany && (
              <>
                {summary.currentRole && <span className="text-body hidden md:inline">at</span>}
                {summary.companyUrl ? (
                  <a
                    href={summary.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-head text-lg md:text-xl font-medium hover:text-gold transition-colors"
                  >
                    {summary.currentCompany}
                  </a>
                ) : (
                  <span className="text-head text-lg md:text-xl font-medium">
                    {summary.currentCompany}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Total Experience */}
      {(totalExperience.years || totalExperience.months) && (
        <div className="mb-6">
          <h3 className="text-head text-sm font-semibold mb-3 uppercase tracking-wide">
            Total Experience
          </h3>
          <div className="flex items-center gap-4">
            {totalExperience.years && (
              <div className="flex items-baseline gap-1">
                <span className="text-gold text-2xl md:text-3xl font-bold">
                  {totalExperience.years}
                </span>
                <span className="text-body text-sm md:text-base">
                  {parseInt(totalExperience.years) === 1 ? 'Year' : 'Years'}
                </span>
              </div>
            )}
            {totalExperience.months && (
              <div className="flex items-baseline gap-1">
                <span className="text-gold text-2xl md:text-3xl font-bold">
                  {totalExperience.months}
                </span>
                <span className="text-body text-sm md:text-base">
                  {parseInt(totalExperience.months) === 1 ? 'Month' : 'Months'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills Summary */}
      {(skillsSummary.primary?.length > 0 || skillsSummary.secondary?.length > 0 || skillsSummary.tools?.length > 0) && (
        <div>
          <h3 className="text-head text-sm font-semibold mb-3 uppercase tracking-wide">
            Key Skills
          </h3>
          <div className="space-y-3">
            {skillsSummary.primary && skillsSummary.primary.length > 0 && (
              <div>
                <span className="text-body text-xs font-medium mb-2 block">Primary:</span>
                <div className="flex flex-wrap gap-2">
                  {skillsSummary.primary.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gold/20 backdrop-blur-sm text-gold text-sm rounded border border-gold/30 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skillsSummary.secondary && skillsSummary.secondary.length > 0 && (
              <div>
                <span className="text-body text-xs font-medium mb-2 block">Secondary:</span>
                <div className="flex flex-wrap gap-2">
                  {skillsSummary.secondary.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-card/80 backdrop-blur-sm text-body text-sm rounded border border-gold/10 shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {skillsSummary.tools && skillsSummary.tools.length > 0 && (
              <div>
                <span className="text-body text-xs font-medium mb-2 block">Tools:</span>
                <div className="flex flex-wrap gap-2">
                  {skillsSummary.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-card/80 backdrop-blur-sm text-body text-sm rounded border border-gold/10 shadow-sm"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Custom Availability */}
      {summary.custom?.availability && (
        <div className="mt-6 pt-6 border-t border-gold/20">
          <p className="text-body text-sm">
            <span className="font-semibold text-head">Availability:</span>{' '}
            <span className="text-gold">{summary.custom.availability}</span>
          </p>
        </div>
      )}
    </div>
  )
}

export default ExperienceSummary

