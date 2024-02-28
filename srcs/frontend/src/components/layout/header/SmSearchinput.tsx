import { CiSearch } from 'react-icons/ci';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SmSearchInput = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [input, setInput] = useState('');

  const onSearch = () => {
    setInput(''); // clear input
    const encodedQuery = encodeURIComponent(searchQuery);
    router.push(`/search?query=${encodedQuery}`);
  };

  return (
    <form
      action=""
      className="relative rounded-lg hover:bg-white/10 left-[8.5rem]  w-9 h-9"
    >
      <input
        type="search"
        className="relative  bg-transparent h-full w-full "
      />
      <div className="absolute top-[0.22rem] right-[0.2rem] ">
        <CiSearch
          style={{
            color: 'white',
            opacity: 0.6,
            width: '1.8rem',
            height: '1.8rem',
          }}
        />
      </div>
    </form>
  );
};

export default SmSearchInput;
