interface EmojiProps {
    color: string;
    width: string;
    height: string;
  }
  
  const Crown: React.FC<EmojiProps> = ({ color, width, height }) => {
    const svgString = `
    <svg width="85" height="85" viewBox="0 0 85 85" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_505_719)">
    <path d="M59.8973 43.5002L60.3123 39.4279C60.5337 37.2551 60.6799 35.8204 60.5652 34.9164L60.6053 34.9167C62.4801 34.9167 64 33.3124 64 31.3333C64 29.3543 62.4801 27.75 60.6053 27.75C58.7304 27.75 57.2105 29.3543 57.2105 31.3333C57.2105 32.2284 57.5214 33.0467 58.0354 33.6747C57.2975 34.1555 56.3328 35.1698 54.8807 36.6966L54.8806 36.6967C53.7619 37.873 53.2025 38.4612 52.5785 38.5522C52.2328 38.6027 51.8805 38.5508 51.5612 38.4024C50.985 38.1346 50.6008 37.4075 49.8325 35.9533L45.7826 28.2885C45.3086 27.3914 44.9119 26.6405 44.5542 26.0363C46.0215 25.2461 47.0263 23.6358 47.0263 21.7778C47.0263 19.1391 44.9998 17 42.5 17C40.0002 17 37.9737 19.1391 37.9737 21.7778C37.9737 23.6358 38.9785 25.2461 40.4458 26.0363C40.0881 26.6406 39.6914 27.3913 39.2174 28.2885L35.1675 35.9534C34.3992 37.4075 34.015 38.1346 33.4388 38.4024C33.1195 38.5508 32.7672 38.6027 32.4215 38.5522C31.7975 38.4612 31.2381 37.873 30.1194 36.6967C28.6673 35.1699 27.7025 34.1555 26.9646 33.6747C27.4786 33.0467 27.7895 32.2284 27.7895 31.3333C27.7895 29.3543 26.2696 27.75 24.3947 27.75C22.5199 27.75 21 29.3543 21 31.3333C21 33.3124 22.5199 34.9167 24.3947 34.9167L24.4348 34.9164C24.3201 35.8204 24.4663 37.2551 24.6877 39.4279L25.1027 43.5001C25.333 45.7606 25.5245 47.9114 25.7591 49.8472H59.2409C59.4755 47.9114 59.667 45.7606 59.8973 43.5002Z" fill="#E89B05"/>
    <path d="M40.0378 60H44.9622C51.3803 60 54.5894 60 56.7306 57.977C57.6651 57.094 58.2569 55.5022 58.6839 53.4306H26.3161C26.7431 55.5022 27.3349 57.094 28.2694 57.977C30.4106 60 33.6197 60 40.0378 60Z" fill="#E89B05"/>
    </g>
    <defs>
    <filter id="filter0_d_505_719" x="0" y="0" width="85" height="85" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="10.5"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.908622 0 0 0 0 0.606678 0 0 0 0 0.0205522 0 0 0 0.72 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_505_719"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_505_719" result="shape"/>
    </filter>
    </defs>
    </svg>
    
        `;
  
    return (
      <div
        className="h-full w-full flex justify-center items-center relative -ml-[0.4rem]  "
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
  
  export default Crown;
  