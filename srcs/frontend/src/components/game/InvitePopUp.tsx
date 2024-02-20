

const InvitePopup = ({ accept, refuse, children }: { accept: () => void; refuse:()=> void; children: React.ReactNode }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-md">
        {children}
        <button className="absolute top-2 right-2" onClick={accept}>
          accept
        </button>
        <button className="absolute top-2 right-2" onClick={refuse}>
          refuse
        </button>
      </div>
    </div>
  );
};

export default InvitePopup;