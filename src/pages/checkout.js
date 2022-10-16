import Image from "next/image";
import { useSelector } from "react-redux";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header";
import { selectItems } from "../slices/basketSlice";

function Checkout() {
  const items = useSelector(selectItems);

  return (
    <div className="bg-gray-100">
      <Header/>

      <main className="lg:flex max-w-screen-2xl mx-auto">
        {/* Left Section */}
        <div className="flex-grow m-5 shadow-sm">
          <Image
            src="https://links.papareact.com/ikj"
            width={1020}
            height={250}
            objectFit="contain"
          />
          {/* Show your backet */}
          <div className="flex flex-col p-5 space-y-10 bg-white">
            <h1 className="text-3xl border-b pb-4 ">
              {items.length === 0
                ? 'Your Amazon Basket is empty'
                : "Shopping Basket"
              }
            </h1>

            {items.map((item, i) => (
              <CheckoutProduct
                key={item.id}
                id={item.id}
                title={item.title}
                rating={item.rating}
                price={item.price}
                description={item.description}
                category={item.category}
                image={item.image}
                hasPrime={item.hasPrime}
              />
            ))}
          </div>
        </div>

        {/* Right Section */}
        {/* Summary and Checkout */}
        <div>

        </div>
      </main>
    </div>
  )
}

export default Checkout
