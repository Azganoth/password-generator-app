import { html } from "htm/preact";
import { useEffect, useRef } from "preact/hooks";

/**
 * @param {string} rawValue
 * @param {number} defaultValue
 * @param {number|undefined} radix
 */
function parseIntWithDefault(rawValue, defaultValue, radix) {
  const value = parseInt(rawValue, radix);
  return Number.isNaN(value) ? defaultValue : value;
}

/**
 * @typedef {import('preact').JSX.IntrinsicElements['input']} Props
 */

/**
 * @param {Props} props
 */

export const Slider = (props) => {
  /**
   * @type {import('preact/hooks').MutableRef<HTMLInputElement | undefined>}
   */
  const inputRef = useRef();

  // Add filled bar
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    /**
     * @param {HTMLInputElement} input
     */
    function setStyleVariable(input) {
      const min = parseIntWithDefault(input.min, 0);
      const max = parseIntWithDefault(input.max, 100);
      const value = parseIntWithDefault(input.value, 50);
      input.style.setProperty(
        "--progress",
        `${((value - min) / (max - min)) * 100}%`,
      );
    }

    setStyleVariable(input);

    /**
     * @param {import('preact').JSX.TargetedInputEvent<HTMLInputElement>} event
     */
    function update(event) {
      setStyleVariable(event.currentTarget);
    }

    input.addEventListener("input", update);
    return () => {
      input.removeEventListener("input", update);
    };
  }, [inputRef]);

  return html`
    <input ref=${inputRef} class="slider" type="range" ...${props} />
  `;
};
