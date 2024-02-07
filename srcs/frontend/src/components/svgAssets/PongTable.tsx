interface PongTableProps {
  color: string;
  width: string;
  height: string;
}

const PongTable: React.FC<PongTableProps> = ({ color, width, height }) => {
  const svgString = `
  <svg width="800" height="402" viewBox="0 0 800 402" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 0.797852H800V200.798V400.798H0V0.797852Z" fill=${color}/>
<rect x="771" y="101.439" width="20" height="100" rx="10" fill="#D9D9D9"/>
<rect x="10" y="260.562" width="20" height="100" rx="10" fill="#D9D9D9"/>
<line y1="-2.5" x2="400" y2="-2.5" transform="matrix(0.00530105 0.999986 -0.999911 0.013365 401.319 1.20215)" stroke="white" stroke-width="5"/>
<circle cx="733.905" cy="183.422" r="10" fill="#D2CCCC"/>
</svg>
      `;

  return (
    <div
      className="h-screen w-screen flex justify-center items-center relative -ml-[0.4rem] "
      style={{
        width,
        height,
        background: `url("data:image/svg+xml;base64,${btoa(
          svgString,
        )}") center center/cover no-repeat`,
      }}
    ></div>
  );
};

export default PongTable;
