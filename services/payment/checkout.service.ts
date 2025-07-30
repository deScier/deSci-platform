import { getSession } from "next-auth/react";

export const createCheckoutService = async (documentId: string) => {
  const session = await getSession();
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/checkout`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${session?.user?.token}`,
    },
    body: JSON.stringify({
      documentId,
    }),
  });

  const responseData = await response.json();

  if (response.status === 200) {
    return {
      success: true,
      message: "Checkout created successfully",
      checkoutUrl: responseData.checkout_url,
    };
  }

  const message = responseData.message ?? "Error in create checkout.";

  return {
    success: false,
    message: message,
  };
};
