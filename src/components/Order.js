import moment from "moment/moment"
import { useSession } from "next-auth/react"
import Currency from "react-currency-formatter"

function Order({ 
  id,
  amount,
  amountShipping,
  items,
  timestamp,
  images,
 }) {

  const { data:session}  = useSession();
  return (
    <div className="relative border rounded-md">
      <div className="flex items-center space-x-10 p-5 bg-gray-100 text-sm text-gray-600">

        <div>
          <p className="font-bold text-xs">ORDER PLACED</p>
          <p>{moment.unix(timestamp).format("MMMM DD, YYYY")}</p>
        </div>

        <div>
          <p className="font-bold text-xs">TOTAL</p>
          <p>
            <Currency quantity={amount} currency="USD" /> - Next Day Delivery{" "}
            <Currency quantity={amountShipping} currency="USD"/>
          </p>
        </div>

        {/* TODO: implements SHIP TO feature.
        <div>
          <p className="font-bold text-xs">SHIP TO</p>
          <p>
            {session.user.name}
          </p>
        </div> 
        */}

        <p
          className="text-sm whitespace-nowrap sm:text-xl self-end text-right text-blue-500"
        >
          {items.length} items
        </p>

        <p className="absolute top-2 right-2 w-40 lg:w-72 truncate text-xs whitespace-nowrap">
          ORDER #{id}
        </p>
      </div>

      <div className="p-5 sm:p-10">
        <div className="flex space-x-6 overflow-x-auto">
          {images.map( (image, index) => (
            <img key={index} src={image} alt="" className="h-20 sm:h-32 object-contain" />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Order
