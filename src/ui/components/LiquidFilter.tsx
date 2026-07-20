import { memo } from 'react'

import styles from './LiquidFilter.module.css'

const LiquidFilter = memo(() => (
  <svg className={styles.svg} aria-hidden="true">
    <filter id="liquidSpecular" x="-20%" y="-20%" width="140%" height="140%">
      <feSpecularLighting
        in="SourceAlpha"
        specularExponent={40}
        lightingColor="#fff"
        result="spec"
      >
        <fePointLight x={100} y={50} z={120} />
      </feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specMasked" />
      <feBlend in="SourceGraphic" in2="specMasked" mode="screen" />
    </filter>
  </svg>
))

export default LiquidFilter
