export const USFlag = () => {
  return (
    <svg
      className="w-4 h-4 mr-2"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect y="0" width="512" height="512" fill="#fff" />
      <rect y="0" width="512" height="39.385" fill="#D80027" />
      <rect y="78.769" width="512" height="39.385" fill="#D80027" />
      <rect y="157.538" width="512" height="39.385" fill="#D80027" />
      <rect y="236.308" width="512" height="39.385" fill="#D80027" />
      <rect y="315.077" width="512" height="39.385" fill="#D80027" />
      <rect y="393.846" width="512" height="39.385" fill="#D80027" />
      <rect y="472.615" width="512" height="39.385" fill="#D80027" />
      <rect y="0" width="256" height="275.692" fill="#2E52B2" />
      <g fill="#fff">
        {[...Array(50)].map((_, i) => {
          const x = 22.3 + (i % 6) * 42.3;
          const y = 19 + Math.floor(i / 6) * 42;
          return <circle key={i} cx={x} cy={y} r="8" />;
        })}
      </g>
    </svg>
  );
};
