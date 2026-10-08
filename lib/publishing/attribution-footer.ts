const OSW_SPACE_URL = 'https://github.com/ilyaskhan/zyr0-studio';

const CREDIT_HTML =
  `<div data-osw-credit style="text-align:center;font:12px/1.6 system-ui,sans-serif;` +
  `padding:12px;opacity:.6">` +
  `Built with <a href="${OSW_SPACE_URL}" target="_blank" rel="noopener" ` +
  `style="color:inherit">ZYR0 Studio</a></div>`;

/** Inject the opt-out "Built with ZYR0 Studio" credit before </body>. Idempotent. */
export function injectAttributionFooter(html: string): string {
  if (html.includes('data-osw-credit')) return html;
  if (html.includes('</body>')) {
    return html.replace('</body>', `${CREDIT_HTML}</body>`);
  }
  return html + CREDIT_HTML;
}
