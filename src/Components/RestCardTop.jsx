import {Link} from "react-router-dom";


export default function  RestCardTop({restInfoTop}) {
    return(

        <Link to={"/city/chennai/"+restInfoTop?.id}>


             <img
      className="w-24 h-24 md:w-36 md:h-36 object-cover rounded-full mt-4 md:mt-6"
      src={`https://media-assets.swiggy.com/swiggy/image/upload/${restInfoTop.imageId}`}
      alt={restInfoTop?.info?.name}/>

     
      


        </Link>
       
    )
}