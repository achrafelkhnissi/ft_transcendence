import UserNameStar from "../svgAssets/UserNameStar";

interface UserNameProps {
    name: string;
}

const UserName: React.FC<UserNameProps> = ({name}) => {

    if (name)
    return (<div className=" inline-block relative px-4 pt-2">
        <p className="text-white font-semibold">{name}</p>
        <div className="absolute top-0 right-0">
            < UserNameStar width="1.1rem" height="1.1rem" color=""/>
        </div>
    </div>)
}

export default UserName;