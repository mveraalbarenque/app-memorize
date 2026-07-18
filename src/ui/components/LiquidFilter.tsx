const LiquidFilter = () => (
  <svg style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0, zIndex: -1 }} aria-hidden="true">
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
)

export default LiquidFilter
