import { buffer } from "micro"
import * as admin from "firebase-admin";

//Secure connection to Firebase from the backend
const serviceAccout = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
}
const app = !admin.apps.length
  ? admin.initializeApp({
    credential: admin.credential.cert(serviceAccout),
  })
  : admin.app();

// Establish connection to Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;

// console.log("serviceAccout=>", serviceAccout)
// console.log("app=>", app)
// console.log("stripe=>", stripe)
// console.log("endpointSecret=>", endpointSecret)

const fulfillOrder = async (session) => {
  console.log('Fullfilling order', session)
  return app
    .firestore()
    .collection('users')
    .doc(session.metadata.email)
    .collection('orders')
    .doc(session.id)
    .set({
      amount: session.amount_total / 100,
      amount_shipping: session.total_details.amount_shipping /100,
      images:JSON.parse(session.metadata.images),
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    })
    .then(()=> {
      console.log(`SUCCESS: Order ${session.id} has been added to the DB`);
    })
}

export default async (req, res) => {
  if (req.method === 'GET') {
    console.log('This is /api/webhook')
    res.status(200)
  }
  if (req.method === 'POST') {
    const requestBuffer = await buffer(req);
    const payload = requestBuffer.toString();
    const sig = req.headers["stripe-signature"];

    let event;

    // Verify that the EVENT posted came from stripe
    try {
      event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err) {
      console.error('ERROR', err.message)
      return res.status(400).send(`Webhook error: ${err.message}`)
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // Fulfill the order
      return fulfillOrder(session)
        .then(() => res.status(200))
        .catch((err) => res.status(400).send(`Webhook Error: ${err.message}`))

    }
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true
  }
}