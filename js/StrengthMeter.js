import { html } from "htm/preact";
import { useEffect, useMemo, useState } from "preact/hooks";

const strengthLabels = {
  0: "Too weak!",
  1: "Weak!",
  2: "Medium!",
  3: "Strong!",
};

const strengthClass = {
  0: "tooweak",
  1: "weak",
  2: "medium",
  3: "strong",
};

/**
 * @typedef {Object} Props
 * @property {string} password
 */

/**
 * @param {Props} propss
 */
export function StrengthMeter({ password }) {
  const strength = useMemo(() => {
    let score = 0;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score <= 2 ? 0 : score <= 3 ? 1 : score <= 4 ? 2 : 3;
  }, [password]);

  const [announcementKey, setAnnouncementKey] = useState(0);
  useEffect(() => {
    setAnnouncementKey((key) => key + 1);
  }, [password]);

  return html`
    <div class="strength-meter" aria-label="Password strength">
      <span class="label" id="strength-meter-label">Strength</span>
      <div
        class="status"
        role="status"
        aria-labelledby="strength-meter-label"
        aria-live="assertive"
        aria-atomic="true"
      >
        <span key=${announcementKey} class="subheading text">
          ${strengthLabels[strength]}
        </span>
        <div class="bars ${strengthClass[strength]}">
          ${Array.from(
            { length: 4 },
            (_, i) => html`
              <div key=${i} class="bar ${i <= strength ? "filled" : ""}" />
            `,
          )}
        </div>
      </div>
    </div>
  `;
}
