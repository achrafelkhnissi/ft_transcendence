interface HourglassProps {
  color: string;
  width: string;
  height: string;
}

const Hourglass: React.FC<HourglassProps> = ({ color, width, height }) => {
  const svgString = `
  <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.59986 5.79644C9.48094 3.90312 12.4946 3.90765 18.5219 3.91672C24.5492 3.92578 27.5629 3.93031 28.4383 5.82627C28.5135 5.98924 28.577 6.1585 28.628 6.33247C29.2215 8.35637 27.087 10.6979 22.818 15.3809L19.9583 18.5022L22.8086 21.6321L22.8086 21.6321C27.0635 26.328 29.191 28.6759 28.5913 30.698C28.5398 30.8718 28.4758 31.0409 28.4001 31.2036C27.519 33.0969 24.5054 33.0924 18.4781 33.0834C12.4507 33.0743 9.43708 33.0698 8.5617 31.1738C8.48646 31.0108 8.42303 30.8416 8.37201 30.6676C7.77847 28.6437 9.91297 26.3022 14.182 21.6191L17.0417 18.4978L14.1914 15.368C9.93648 10.6721 7.80902 8.32417 8.40865 6.30207C8.46019 6.12825 8.52413 5.95918 8.59986 5.79644Z" fill="#93C4FD"/>
  <rect x="13.8479" y="8.77051" width="8.68194" height="2.46" rx="1.23" transform="rotate(0.611794 13.8479 8.77051)" fill="#17194A"/>
  <path d="M13.8073 27.2778C13.8146 26.5985 14.3711 26.0537 15.0504 26.061L21.272 26.1274C21.9512 26.1347 22.496 26.6912 22.4888 27.3705V27.3705C22.4815 28.0498 21.925 28.5945 21.2457 28.5873L15.0241 28.5208C14.3448 28.5136 13.8 27.9571 13.8073 27.2778V27.2778Z" fill="#17194A"/>
  <circle cx="18.5217" cy="18.5213" r="1.48" transform="rotate(0.086159 18.5217 18.5213)" fill="#93C4FD"/>
  </svg>  
    `;

  return (
    <div
      className="h-screen w-screen flex justify-center items-center relative -ml-[0.4rem] "
      style={{
        width,
        height,
        background: `url("data:image/svg+xml;base64,${btoa(
          svgString
        )}") center center/cover no-repeat`,
      }}
    ></div>
  );
};

export default Hourglass;
