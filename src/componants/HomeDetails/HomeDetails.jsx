
import React from "react";
import Avengers from "../Videos/mov_bbb.mp4"

export const HomeDetails = () =>{

  return (
    <div  className="playback">
      <video
        width="100%"
        height="100%" 
        muted
        loop
        autoplay >

        <source
            src={Avengers}
            type="video/mp4"
        />
        Your browser does not support the video tag.
        
      </video>
    </div>
  );
}









// export const HomeDetails = () => {

//     return(

//         <>
//             <div class="playback">
//             <video width="400" controls>
//                   <source src={Avengers} type="video/mp4" />
 
//                    Your browser does not support HTML video.
//             </video>
//             </div>

//         </>
//     )
// }