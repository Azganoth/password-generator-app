import { html } from "htm/preact";
import { useEffect, useRef, useState } from "preact/hooks";

/**
 * @typedef {Object} Props
 * @property {string} password
 */

/**
 * @param {Props} props
 */
export function PasswordDisplay({ password }) {
  const [copied, setCopied] = useState(false);
  const copiedRef = useRef();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    clearTimeout(copiedRef.current);
    copiedRef.current = setTimeout(() => {
      setCopied(false);
    }, 4000);
  };

  // Auto focus on copy when a new password is generated
  // or when copy is out of cooldown
  const copyButtonRef = useRef();
  useEffect(() => {
    if (password || !copied) {
      copyButtonRef.current.focus();
    }
  }, [password, copied]);

  return html`
    <section
      class="password-display"
      aria-label="Generated password"
      aria-live="assertive"
      aria-atomic="true"
    >
      <span class="heading password ${!password ? "placeholder" : ""}">
        ${password || "P4$5W0rD!"}
      </span>
      <span class="status"> ${copied ? "Copied" : ""} </span>
      <button
        ref=${copyButtonRef}
        type="button"
        onClick=${() => {
          copyToClipboard();
        }}
        aria-label="Copy password"
        disabled=${!password}
      >
        <svg viewBox="0 0 21 24" fill="currentColor" aria-hidden="true">
          <path
            d="M20.341 3.091 17.909.659A2.25 2.25 0 0 0 16.319 0H8.25A2.25 2.25 0 0 0 6 2.25V4.5H2.25A2.25 2.25 0 0 0 0 6.75v15A2.25 2.25 0 0 0 2.25 24h10.5A2.25 2.25 0 0 0 15 21.75V19.5h3.75A2.25 2.25 0 0 0 21 17.25V4.682a2.25 2.25 0 0 0-.659-1.591ZM12.469 21.75H2.53a.281.281 0 0 1-.281-.281V7.03a.281.281 0 0 1 .281-.281H6v10.5a2.25 2.25 0 0 0 2.25 2.25h4.5v1.969a.282.282 0 0 1-.281.281Zm6-4.5H8.53a.281.281 0 0 1-.281-.281V2.53a.281.281 0 0 1 .281-.281H13.5v4.125c0 .621.504 1.125 1.125 1.125h4.125v9.469a.282.282 0 0 1-.281.281Zm.281-12h-3v-3h.451c.075 0 .147.03.2.082L18.667 4.6a.283.283 0 0 1 .082.199v.451Z"
          />
        </svg>
      </button>
    </section>
  `;
}
