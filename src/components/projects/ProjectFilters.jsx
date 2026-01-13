/**
 * ProjectFilters - Filter component for projects
 */
function ProjectFilters({
  categories = [],
  types = [],
  statuses = [],
  selectedCategory = '',
  selectedType = '',
  selectedStatus = '',
  onCategoryChange = () => {},
  onTypeChange = () => {},
  onStatusChange = () => {},
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-head text-sm font-semibold mb-3">Filter Projects</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <label className="block text-body text-xs font-medium mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-3 py-2 bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-head text-sm focus:outline-none focus:border-gold shadow-md"
              style={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
              }}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id || category} value={category.id || category}>
                  {category.name || category}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Type Filter */}
        {types.length > 0 && (
          <div>
            <label className="block text-body text-xs font-medium mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="w-full px-3 py-2 bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-head text-sm focus:outline-none focus:border-gold shadow-md"
              style={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
              }}
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Status Filter */}
        {statuses.length > 0 && (
          <div>
            <label className="block text-body text-xs font-medium mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="w-full px-3 py-2 bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-head text-sm focus:outline-none focus:border-gold shadow-md"
              style={{
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
              }}
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectFilters

