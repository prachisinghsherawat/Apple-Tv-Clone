
import { Box } from "@chakra-ui/react";
import { DetailsCard } from "../Home/MiniCard/DetailsCard";
import { comingSoon } from "../Home/Data/Data";

export const DetailsMain = () => {

    return(
        <>

        <div className="DetailsBox">

        <Box top="30px" mt={90} id="boxIs" >
            <DetailsCard 
                data={comingSoon}
                title={"SEASON 1"}
                minititle={"Add to your Up Next watchlist today."}
            />
        </Box>

        </div>

        
        </>
    )
}