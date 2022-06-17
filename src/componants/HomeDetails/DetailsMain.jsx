
import { Box } from "@chakra-ui/react";
import { DetailsCard } from "../Home/MiniCard/DetailsCard";
import { RelatedData, SeasonData } from "../Home/Data/DetailsData";
import { RelatedCard } from "../Home/MiniCard/RelatedCard";

export const DetailsMain = () => {

    return(
        <>

        <div className="DetailsBox">

        <Box top="30px" mt={90} id="boxIs" >
            <DetailsCard 

                data={SeasonData}
                title={"SEASON 1"}
                minititle={"Add to your Up Next watchlist today."}
            />
        </Box>
        </div>

        <div className="trailerBox">
            <h1 className="Head">Trailers</h1>
            <div>
                <img src="https://is4-ssl.mzstatic.com/image/thumb/MyAuxYfuNZeytIiPf5PhiQ/1000x563.webp" alt="" height="100%" width="100%" />
            </div>
        </div>

        <hr />

        <Box top="30px" mt={90} >

            <h1 className="HeadRel">Related</h1>
            <RelatedCard

                data={RelatedData}
            />
        </Box>



        
        </>
    )
}