import { LuSearch } from "react-icons/lu";

const SearchInput = () => {
  return (
    <div className="bg-[#424283] border rounded-full relative w-[400px] h-full py-1 px-2">
      <input
        type="text"
        className="w-full h-10 pl-2 bg-transparent outline-none"
        placeholder="Search something..."
      />
      <button className="absolute top-0 bottom-0 right-4 ">
        <LuSearch
          style={{
            color: "white",
            opacity: 0.7,
            fontSize: "200px",
          }}
          size={50}
        />
      </button>
    </div>
  );
};

export default SearchInput;
