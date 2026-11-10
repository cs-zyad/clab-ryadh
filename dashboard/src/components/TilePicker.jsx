// A row of icon tiles that behaves like radio buttons (post type, event category,
// registration status). Styles live in styles/panel.css.
// options: [{ value, label, Icon }]
export default function TilePicker({ name, options, value, onChange }) {
  return (
    <div className="tile-selector" role="radiogroup">
      {options.map(({ value: optionValue, label, Icon }) => {
        const id = `${name}-${optionValue}`
        return (
          <span key={optionValue} style={{ display: 'contents' }}>
            <input
              type="radio"
              name={name}
              id={id}
              value={optionValue}
              className="tile-option"
              checked={value === optionValue}
              onChange={() => onChange(optionValue)}
            />
            <label htmlFor={id} className="tile-label">
              <Icon size={22} /> {label}
            </label>
          </span>
        )
      })}
    </div>
  )
}
