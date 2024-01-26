interface SendMessageProps {
  color: string;
  width: string;
  height: string;
}

const SendMessage: React.FC<SendMessageProps> = ({ color, width, height }) => {
  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 31 31" fill="none">
    <path d="M25.1774 20.8521L27.6805 13.3427C29.8672 6.78253 30.9606 3.50245 29.2291 1.77102C27.4977 0.0395865 24.2176 1.13294 17.6575 3.31966L10.148 5.82281C4.85338 7.5877 2.20604 8.47014 1.45374 9.76419C0.738075 10.9952 0.738075 12.5156 1.45374 13.7467C2.20604 15.0407 4.85338 15.9232 10.148 17.6881C10.8042 17.9068 11.5424 17.7506 12.0338 17.2638L20.0628 9.30914C20.5145 8.86163 21.2435 8.86502 21.691 9.31672C22.1385 9.76843 22.1351 10.4974 21.6834 10.9449L13.784 18.7711C13.2425 19.3077 13.071 20.1289 13.3121 20.8521C15.077 26.1468 15.9594 28.7941 17.2535 29.5464C18.4845 30.2621 20.0049 30.2621 21.236 29.5464C22.53 28.7941 23.4125 26.1468 25.1774 20.8521Z" fill="#20204A"/>
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

export default SendMessage;
