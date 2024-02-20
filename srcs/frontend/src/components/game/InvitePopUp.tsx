const InvitePopup = ({
  accept,
  refuse,
  children,
}: {
  accept: () => void;
  refuse: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 text-white text-center font-serif gap-3">
      <div
        className="md:w-[35rem] md:h-[18rem] border-2 border-purple-900 self-center bg-[#17194A] rounded-[3.5rem]
    flex flex-col gap-8 justify-center  shadow-lg bg-origin-padding"
      >
        {children}
        <div className="flex flex-row self-center">
        <button
          type="button"
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"         
          onClick={accept}
        >
          accept
        </button>
        <button
          type="button"
          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          onClick={refuse}>
          refuse
        </button>
        </div>
      </div>
    </div>
  );
};

export default InvitePopup;
