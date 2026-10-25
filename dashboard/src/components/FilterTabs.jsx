import { useMemo } from 'react'

// Filter pills with counts, e.g. الكل 5 · تغريدات 3. Styles live in styles/panel.css.
// filters: [[value, label]] where 'all' shows everything; `field` is the item key to match.
export default function FilterTabs({ filters, items, field, value, onChange }) {
  const counts = useMemo(() => {
    const c = { all: items.length }
    for (const item of items) c[item[field]] = (c[item[field]] || 0) + 1
    return c
  }, [items, field])

  return (
    <div className="filter-tabs">
      {filters.map(([key, label]) => (
        <button
          key={key}
          type="button"
          className={`filter-tab${value === key ? ' active' : ''}`}
          onClick={() => onChange(key)}
        >
          {label}
          <span className="tab-count">{counts[key] || 0}</span>
        </button>
      ))}
    </div>
  )
}
