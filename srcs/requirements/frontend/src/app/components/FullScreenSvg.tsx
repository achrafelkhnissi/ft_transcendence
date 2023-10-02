const FullScreenSvg = () => {
  const svgString = `
    <svg id="visual" viewBox="0 0 900 600" width="900" height="600" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1">
      <rect x="0" y="0" width="900" height="600" fill="#757EFF"></rect>
      <path d="M467 0L453.8 25C440.7 50 414.3 100 425.7 150C437 200 486 250 508.5 300C531 350 527 400 503 450C479 500 435 550 413 575L391 600L0 600L0 575C0 550 0 500 0 450C0 400 0 350 0 300C0 250 0 200 0 150C0 100 0 50 0 25L0 0Z" fill="#17194A" stroke-linecap="round" stroke-linejoin="miter"></path>
    </svg>
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

export default FullScreenSvg;
