export default function Switch({ label, checked, disabled = false, onChange }) {
  return (
    <label className={`switch-row${disabled ? ' disabled' : ''}`}>
      <span>{label}</span>
      <input
        type="checkbox"
        className="switch-input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch" aria-hidden="true"></span>
    </label>
  )
}
