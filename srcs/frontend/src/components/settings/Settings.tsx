"use client";
import { useState } from "react";

// const Settings = () => {

//   return (
//     <div className=" w-full h-full rounded-[2rem] z-10 text-white  ">
//         <form>
//             <input
//             type="file"
//             className="rounded-full ">
//             </input>
//         </form>
//     </div>
//   );
// };

const Settings = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <div className="mt-4">
      <div className="mt-1 flex items-center">
        <label
          htmlFor="fileInput"
          className="cursor-pointer border rounded-full w-4 h-4 text-white flex justify-center"
        >
          <p className=" self-center">+</p>
        </label>
        <input
          type="file"
          id="fileInput"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
export default Settings;
