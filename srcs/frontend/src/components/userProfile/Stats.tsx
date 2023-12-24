
const Stats = () => {

interface StatsProps {
        label : string;
        value: string
    }
    
    const StatsItems: StatsProps[] = [
        {
            label: "Total Games",
            value: "120"
        },
        {
            label: "Wins",
            value: "85%",
        },
        {
            label: "Loss",
            value: "15%",
        }
    ]

    return (
    <div className=" flex justify-between  pl-2 divide-x-[0.17rem] divide-[#6C61A4]/60">
        {StatsItems.map( (item, index) => {
            return ( <div key={index} className="text-white flex flex-col gap-1 px-4 text-sm">
                <p className="self-center text-[#6C61A4] font-semibold ">{item.label}</p>
                <p className="self-center font-semibold">{item.value}</p>
            </div>)
        })}
    </div>)
}

export default Stats