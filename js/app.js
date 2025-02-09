import { html } from "htm/preact";
import { render } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { Checkbox } from "./Checkbox.js";
import { PasswordDisplay } from "./PasswordDisplay.js";
import { Slider } from "./Slider.js";
import { StrengthMeter } from "./StrengthMeter.js";

/**
 * @param {string} str
 * @returns {string}
 */
function pickRandomChar(str) {
  return str[Math.floor(Math.random() * str.length)];
}

export function App() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(10);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });

  const isDisabled = useMemo(
    () =>
      length === 0 ||
      !(
        options.uppercase ||
        options.lowercase ||
        options.numbers ||
        options.symbols
      ),
  );

  const generatePassword = useCallback(() => {
    // Collect enabled character sets
    const charSets = [];
    if (options.uppercase) charSets.push("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    if (options.lowercase) charSets.push("abcdefghijklmnopqrstuvwxyz");
    if (options.numbers) charSets.push("0123456789");
    if (options.symbols) charSets.push("!@#$%^&*()_+-=[]{}|;:,.<>?");

    if (charSets.length === 0) return;

    // Ensure at least one character from each selected set
    const newPassword = [];
    charSets.forEach((set) => {
      newPassword.push(pickRandomChar(set));
    });

    // Fill remaining characters
    const chars = charSets.join("");
    for (let i = newPassword.length; i < length; i++) {
      newPassword.push(pickRandomChar(chars));
    }

    // Shuffle
    setPassword(newPassword.sort(() => Math.random() - 0.5).join(""));
  }, [length, options]);

  return html`
    <main>
      <h1 class="subheading title">Password Generator</h1>

      <${PasswordDisplay} password=${password} />

      <form
        onSubmit=${(e) => {
          e.preventDefault();
          generatePassword();
        }}
      >
        <label class="password-length">
          <span>Character Length</span>
          <output class="heading" for="length-slider">${length}</output>
          <${Slider}
            id="length-slider"
            min="0"
            max="20"
            value=${length}
            onInput=${(e) => {
              setLength(parseInt(e.target.value));
            }}
          />
        </label>

        <fieldset class="password-includes">
          <legend class="sr-only">Include characters:</legend>
          <${Checkbox}
            label="Include Uppercase Letters"
            checked=${options.uppercase}
            onChange=${() => {
              setOptions((p) => ({ ...p, uppercase: !p.uppercase }));
            }}
          />
          <${Checkbox}
            label="Include Lowercase Letters"
            checked=${options.lowercase}
            onChange=${() => {
              setOptions((p) => ({ ...p, lowercase: !p.lowercase }));
            }}
          />
          <${Checkbox}
            label="Include Numbers"
            checked=${options.numbers}
            onChange=${() => {
              setOptions((p) => ({ ...p, numbers: !p.numbers }));
            }}
          />
          <${Checkbox}
            label="Include Symbols"
            checked=${options.symbols}
            onChange=${() => {
              setOptions((p) => ({ ...p, symbols: !p.symbols }));
            }}
          />
        </fieldset>

        <${StrengthMeter} password=${password} />

        <button
          class="button password-generate"
          type="submit"
          disabled=${isDisabled}
          aria-label="Generate new password"
        >
          Generate
          <svg viewBox="0 0 12 12" fill="currentColor">
            <path
              d="m5.106 12 6-6-6-6-1.265 1.265 3.841 3.84H.001v1.79h7.681l-3.841 3.84z"
            />
          </svg>
        </button>

        <div aria-live="assertive">
          ${isDisabled &&
          html`<p class="error">Please select at least one include option</p>`}
        </div>
      </form>
    </main>
  `;
}

render(html`<${App} />`, document.getElementById("app"));
