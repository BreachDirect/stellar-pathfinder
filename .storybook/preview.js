import '../src/styles.css'

export default {
  parameters: {
    // Match the app's dark theme (src/styles.css) so components render in
    // context; the light preset is available for contrast spot-checks.
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: '#0b1220' },
        { name: 'light', value: '#ffffff' }
      ]
    }
  }
}
