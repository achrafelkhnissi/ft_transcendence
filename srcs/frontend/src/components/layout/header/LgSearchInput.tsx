'use client';

import { LuSearch } from 'react-icons/lu';
import { CiSearch } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import getAllUsers from '@/services/getAllUsers';

const SearchInput = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');
  const [searchResultsUsers, setSearchResultsUsers] = useState([]);
  const [searchResultsRooms, setSearchResultsRooms] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((data) => {
      if (data) {
        setAllUsers(data);
      }
    });
  }, []);

  const onSearch = () => {
    setInput(''); // clear input
    const encodedQuery = encodeURIComponent(searchQuery);
    router.push(`/search?query=${encodedQuery}`);
    console.log('searching for', searchQuery);
  };

  return (
    <div className="bg-[#424283] border-[0.09rem] border-white/50 rounded-xl relative lg:w-[400px] w-[250px] py-[0.1rem z-10 px-2">
      <input
        type="text"
        value={input}
        className="w-full py-[0.4rem] px-2 bg-transparent outline-none  text-sm text-white/80  font-light placeholder:font-extralight placeholder:italic placeholder:opacity-80 "
        placeholder="search something..."
        onChange={(event) => {
          setSearchQuery(event.target.value);
          setInput(event.target.value);
        }}
        onClick={() => {
          setShowSearchResults((prev) => !prev);
        }}
      />
      <button className="absolute top-0 bottom-0 right-2" onClick={onSearch}>
        <CiSearch
          style={{
            color: 'white',
            opacity: 0.6,
            width: '1.8rem',
            height: '1.8rem',
          }}
        />
      </button>
      {showSearchResults && (
        <div
          className="w-full max-h-80 min-h-12 absolute  transform 
      left-1/2 -translate-x-1/2 mt-2 shadow-lg bg-white/20 rounded-xl border border-white/20 "
        ></div>
      )}
    </div>
  );
};

export default SearchInput;
