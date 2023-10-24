const Back = () => {
  const svgString = `
  <svg id="visual" viewBox="0 0 900 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="900" height="600" fill="#16194A"></rect><defs><linearGradient id="grad1_0" x1="33.3%" y1="0%" x2="100%" y2="100%"><stop offset="20%" stop-color="#16194a" stop-opacity="1"></stop><stop offset="80%" stop-color="#16194a" stop-opacity="1"></stop></linearGradient></defs><defs><linearGradient id="grad2_0" x1="0%" y1="0%" x2="66.7%" y2="100%"><stop offset="20%" stop-color="#16194a" stop-opacity="1"></stop><stop offset="80%" stop-color="#16194a" stop-opacity="1"></stop></linearGradient></defs><g transform="translate(900, 0)"><path d="M0 162.2C-29 158.4 -57.9 154.5 -81.1 140.5C-104.3 126.6 -121.7 102.6 -134.2 77.5C-146.8 52.4 -154.5 26.2 -162.2 0L0 0Z" fill="#93C4FD"></path></g><g transform="translate(0, 600)"><path d="M0 -162.2C27 -155.9 54 -149.6 79 -136.8C104 -124.1 127 -105 140.5 -81.1C154.1 -57.3 158.2 -28.6 162.2 0L0 0Z" fill="#93C4FD"></path></g></svg>
    `;

  return (
    <div
      className="h-screen w-screen flex justify-center items-center relative"
      style={{
        background: `url("data:image/svg+xml;base64,${btoa(
          svgString
        )}") center center/cover no-repeat`,
      }}
    ></div>
  );
};

export default Back;
