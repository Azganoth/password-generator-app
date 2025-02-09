import { html } from "htm/preact";

/**
 * @typedef {Object} Props
 * @property {string} label
 * @property {boolean} checked
 * @property {(checked: boolean) => void} onChange
 */

/**
 * @param {Props} props
 */
export const Checkbox = ({ label, checked, onChange }) => {
  return html`
    <label className="password-include">
      <input
        class="checkbox"
        type="checkbox"
        checked=${checked}
        onChange=${(e) => {
          onChange(e.target.checked);
        }}
      />
      <span>${label}</span>
    </label>
  `;
};
