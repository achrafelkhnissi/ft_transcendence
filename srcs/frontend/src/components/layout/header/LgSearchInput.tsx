/* eslint-disable @next/next/no-img-element */
'use client';

import { LuSearch } from 'react-icons/lu';
import { CiSearch } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { User } from '@/components/messages/data';
import getUsersAll from '@/services/getUsersAll';

const SearchInput = () => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [searchResultsUsers, setSearchResultsUsers] = useState<User[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const searchBarRef = useRef(null);

  useEffect(() => {
    getUsersAll().then((data: User[]) => {
      if (data) {
        setAllUsers(data);
      }
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !(searchBarRef.current as any).contains(event.target as Node)
      ) {
        console.log('clicked outside');
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const searchUsers = (query: string) => {
    setSearchResultsUsers(
      allUsers.filter((user) =>
        user?.username?.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  };

  return (
    <div
      ref={searchBarRef}
      className="bg-[#424283] border-[0.09rem] border-white/50 rounded-xl relative lg:w-[400px] w-[250px] py-[0.1rem z-10 px-2"
    >
      <input
        type="text"
        value={input}
        className="w-full py-[0.4rem] px-2 bg-transparent outline-none  text-sm text-white/80  font-light placeholder:font-extralight placeholder:italic placeholder:opacity-80 "
        placeholder="search something..."
        onChange={(event) => {
          setInput(event.target.value);
          searchUsers(event.target.value);
          if (event.target.value != '') {
            setShowSearchResults(true);
          } else {
            setShowSearchResults(false);
          }
        }}
        onFocus={() => {
          if (input != '') {
            setShowSearchResults(true);
          }
        }}
      />
      <div className="absolute top-0 bottom-0 right-2">
        <CiSearch
          style={{
            color: 'white',
            opacity: 0.6,
            width: '1.8rem',
            height: '1.8rem',
          }}
        />
      </div>
      {showSearchResults && (
        <div
          className="w-full max-h-80 min-h-12 absolute  transform 
      left-1/2 -translate-x-1/2 mt-2 shadow-lg bg-white/20 rounded-xl border border-white/20 
      flex flex-col gap-1 overflow-y-auto p-2 z-10 "
        >
          {searchResultsUsers.map((user) => (
            <div
              key={user.id}
              className="px-2 py-1 w-full text-white/80 bg-[#28285a]/80 rounded-lg
               hover:bg-[#28285a]/70 hover:text-white cursor-pointer"
              onClick={() => {
                setInput('');
                setShowSearchResults(false);
                router.push(`/profile/${user.username}`);
              }}
            >
              <div className="flex ">
                <img
                  src={process.env.BACKEND + `/api/users/${user?.id}/avatar`}
                  alt=""
                  className="w-8 h-8 rounded-full inline-block mr-2 object-fill"
                />
                <p className="self-center text-sm">{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
