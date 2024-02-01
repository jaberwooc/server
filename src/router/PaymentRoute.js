const express = require("express");
const router = express.Router();
const stripe = require("stripe")(
  "sk_test_51LVUjIJBFYzkF3lyFVMzkIQPVBVOlA4cWHYYW8eoPNPXFtMUEpuKvBHIWevKDYJkAvitJEXcLlpOak2IQkVNH3va00LJ4OnpR1"
);

router.post("/intents", async (req, res) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: "2023-10-16" }
    );
    const paymentintent = await stripe.paymentIntents.create({
      customer: customer.id,
      amount: req.body.amount,
      currency: "mxn",
      automatic_payment_methods: {
        enabled: true,
      },

      transfer_data: {
        destination: req.body.destination,
      },
    });

    res.json({
      paymentIntent: paymentintent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: "pk_test_wk6O7Cc5k3McBIG2Hut2irGs",
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
