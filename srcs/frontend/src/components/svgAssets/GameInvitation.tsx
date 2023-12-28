interface GameInvitationProps {
    color: string;
    width: string;
    height: string;
  }
  
  const GameInvitation: React.FC<GameInvitationProps> = ({ color, width, height }) => {
    const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
    <path d="M26.5836 9.86266L26.5836 9.9503C26.5836 10.9904 26.5835 11.5104 26.3332 11.9359C26.0828 12.3613 25.6282 12.6139 24.7191 13.119L23.7605 13.6516C24.421 11.4184 24.6414 9.01901 24.7229 6.96706C24.7264 6.87907 24.7303 6.79001 24.7343 6.7L24.7371 6.63696C25.524 6.91025 25.9659 7.11399 26.2415 7.49643C26.5836 7.97112 26.5836 8.60164 26.5836 9.86266Z" fill="#59598E"/>
    <path d="M2.41699 9.86266L2.417 9.9503C2.41702 10.9904 2.41704 11.5104 2.66739 11.9359C2.91774 12.3613 3.37234 12.6139 4.28151 13.119L5.24063 13.6519C4.58 11.4186 4.3596 9.0191 4.27813 6.96706C4.27464 6.87907 4.2707 6.79001 4.26672 6.7L4.26394 6.63681C3.47671 6.91017 3.03476 7.11392 2.75907 7.49643C2.41694 7.97112 2.41696 8.60164 2.41699 9.86266Z" fill="#59598E"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.5005 2.4165C16.6556 2.4165 18.4311 2.60632 19.7894 2.83548C21.1653 3.06764 21.8533 3.18372 22.4281 3.89168C23.003 4.59963 22.9726 5.36481 22.9118 6.89515C22.7032 12.149 21.5695 18.7112 15.4066 19.2917V23.5623H17.1347C17.7107 23.5623 18.2066 23.9689 18.3196 24.5337L18.5482 25.6769H21.7503C22.2508 25.6769 22.6566 26.0827 22.6566 26.5832C22.6566 27.0837 22.2508 27.4894 21.7503 27.4894H7.25033C6.74982 27.4894 6.34408 27.0837 6.34408 26.5832C6.34408 26.0827 6.74982 25.6769 7.25033 25.6769H10.4524L10.6811 24.5337C10.794 23.9689 11.2899 23.5623 11.8659 23.5623H13.5941V19.2917C7.43153 18.7109 6.29778 12.1489 6.0892 6.89515C6.02845 5.36481 5.99807 4.59963 6.57289 3.89168C7.14772 3.18372 7.8357 3.06764 9.21167 2.83548C10.5699 2.60632 12.3454 2.4165 14.5005 2.4165ZM15.6511 7.49014L15.5323 7.27704C15.0731 6.45335 14.8436 6.0415 14.5003 6.0415C14.1571 6.0415 13.9275 6.45335 13.4683 7.27704L13.3496 7.49014C13.2191 7.7242 13.1538 7.84124 13.0521 7.91846C12.9504 7.99568 12.8237 8.02434 12.5703 8.08167L12.3397 8.13386C11.448 8.3356 11.0022 8.43648 10.8961 8.77756C10.7901 9.11864 11.094 9.47404 11.7019 10.1849L11.8591 10.3687C12.0319 10.5707 12.1182 10.6717 12.1571 10.7967C12.1959 10.9216 12.1829 11.0564 12.1568 11.3259L12.133 11.5712C12.0411 12.5196 11.9951 12.9938 12.2728 13.2046C12.5505 13.4154 12.9679 13.2232 13.8028 12.8388L14.0187 12.7394C14.256 12.6301 14.3746 12.5755 14.5003 12.5755C14.6261 12.5755 14.7447 12.6301 14.9819 12.7394L15.1979 12.8388C16.0327 13.2232 16.4501 13.4154 16.7278 13.2046C17.0055 12.9938 16.9596 12.5196 16.8677 11.5712L16.8439 11.3259C16.8178 11.0564 16.8047 10.9216 16.8436 10.7967C16.8824 10.6717 16.9688 10.5707 17.1415 10.3687L17.2988 10.1849C17.9066 9.47404 18.2106 9.11864 18.1045 8.77756C17.9984 8.43648 17.5526 8.3356 16.661 8.13386L16.4303 8.08167C16.1769 8.02434 16.0503 7.99568 15.9485 7.91846C15.8468 7.84124 15.7816 7.72421 15.6511 7.49014Z" fill="#59598E"/>
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
  
  export default GameInvitation;