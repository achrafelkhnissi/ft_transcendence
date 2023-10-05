"use client";

import { LuSearch } from "react-icons/lu";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchInput = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [input, setInput] = useState("");

  const onSearch = () => {
    setInput(""); // clear input
    const encodedQuery = encodeURIComponent(searchQuery);
    router.push(`/search?query=${encodedQuery}`);
    console.log("searching for", searchQuery);
  };

  return (
    <div className="bg-[#424283] border-[0.09rem] border-white/50 rounded-xl relative w-[400px]  py-1 px-2">
      <input
        type="text"
        value={input}
        className="w-full py-[0.3rem] px-2 bg-transparent outline-none  text-sm text-white/80  font-light placeholder:font-extralight placeholder:italic placeholder:opacity-80 "
        placeholder="search something..."
        onChange={(event) => {
          setSearchQuery(event.target.value);
          setInput(event.target.value);
        }}
      />
      <button className="absolute top-0 bottom-0 right-3" onClick={onSearch}>
        <CiSearch
          style={{
            color: "white",
            opacity: 0.6,
            width: "1.6rem",
            height: "1.6rem",
          }}
        />
      </button>
    </div>
  );
};

export default SearchInput;
