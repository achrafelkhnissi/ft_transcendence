import PreviewSwitch from "./PreviewSwitch"

const Preview = () => {
    return (<div 
            className="w-2/5  bg-[#25244E] rounded-[3rem] 
            shadow-[0_20px_40px_15px_rgba(0,0,0,0.2)] p-2" >
                <div className="w-full flex flex-col justify-center pt-2">
                    <PreviewSwitch/>
                </div>
        </div>)
}

export default Preview