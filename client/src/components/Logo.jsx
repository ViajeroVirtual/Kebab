const sizeMap = {
  sm: { heading: 'text-xl', subtitle: 'text-[10px]', tracking: 'tracking-tight' },
  md: { heading: 'text-3xl', subtitle: 'text-xs', tracking: 'tracking-tight' },
  lg: { heading: 'text-5xl', subtitle: 'text-sm', tracking: 'tracking-tight' },
};

export default function Logo({ size = 'md', showText = true }) {
  const s = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex flex-col items-start select-none">
      <h1 className={`${s.heading} ${s.tracking} font-semibold leading-none`}>
        <span style={{ color: '#1d1d1f' }}>Alge</span>
        <span style={{ color: '#dc2626' }}>Kebab</span>
      </h1>
      {showText && (
        <span
          className={`${s.subtitle} font-medium uppercase tracking-widest mt-0.5`}
          style={{ color: '#86868b' }}
        >
          Algeciras
        </span>
      )}
    </div>
  );
}
