/* eslint-disable @next/next/no-img-element */

interface gameImage {  
    position: string;
    opponentId: number;
    currentUserId: number | null;
    
}

const GameImages = (props: gameImage) => {
  return (
      <div className="flex justify-center px-8 py-8 border-2 border-white">
            {/* {props.position == 'leftPaddle' && (
              <div className="flex justify-center h-20 rounded-t-[2rem] gap-x-60 border-2">
                <img
                  src={
                    process.env.BACKEND + `/api/users/${props.currentUserId}/avatar`
                  }
                  alt="player"
                  width={10}
                  height={10}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full self-center"
                />
                <img
                  src={
                    process.env.BACKEND +
                    `/api/users/${props.opponentId}/avatar`
                  }
                  alt="opponent"
                  width={10}
                  height={10}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full self-center"
                />
              </div>
            )}
            {props.position == 'rightPaddle' && (
              <div className="flex justify-center h-20 rounded-t-[2rem] gap-x-60 border-2">
                <img
                  src={
                    process.env.BACKEND +
                    `/api/users/${props.opponentId}/avatar`
                  }
                  alt="opponent"
                  width={10}
                  height={10}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full self-center"
                />
                <img
                  src={
                    process.env.BACKEND + `/api/users/${props.currentUserId}/avatar`
                  }
                  alt="player"
                  width={10}
                  height={10}
                  className="w-14 h-14 md:w-20 md:h-20 rounded-full self-center"
                />
              </div>
            )} */}
          </div>
  );
}

export default GameImages;