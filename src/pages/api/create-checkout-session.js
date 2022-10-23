const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { items, email } = req.body;

  const transformedItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image],
        description: item.description,
      },
    },
    quantity: 1,
  }));
  // console.log("transformedItems=>", transformedItems)

  const session = await stripe.checkout.sessions.create({
    payment_method_types:["card"],
    line_items: transformedItems,
    mode: 'payment',
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map(item => item.image))
    },
    shipping_address_collection: {
      allowed_countries: ['US']
    },
    shipping_options: [
      {
        shipping_rate: 'shr_1Lvg9jFm4TnVN5GcqxAeRdcL',
      }
    ],
  });

  res.status(200).json({ id: session.id })
}