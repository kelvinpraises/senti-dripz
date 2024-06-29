"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/atoms/button";
import Card from "@/components/atoms/card";
import { Collector, Recipient } from "@/types";
import Emoji from "@/components/atoms/emoji";

interface CollectorHeadProps {
  collector: Collector;
}

const CollectorHead: React.FC<CollectorHeadProps> = ({ collector }) => {
  const { name, creator, acceptedToken, emojiCodePoint } = collector;

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center gap-4">
        <Emoji
          emoji={emojiCodePoint}
          className="inline-block text-4xl !no-underline"
        />
        <div className="flex flex-col items-start">
          <h3 className="text-lg w-fit font-semibold text-gray-800">{name}</h3>
          <div className="flex gap-4">
            <span className="text-sm text-gray-600">
              Shop token: {acceptedToken.symbol}
            </span>
            <p className="hidden sm:block text-sm text-gray-600">
              Creator: {creator.slice(0, 6)}...{creator.slice(-4)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CollectorBodyProps {
  collector: Collector;
  selectedRecipient: Recipient | null;
}

const CollectorBody: React.FC<CollectorBodyProps> = ({
  collector,
  selectedRecipient,
}) => {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = (itemId: string) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const getTotalItems = () => {
    return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  };

  const getTotalPrice = () => {
    return collector.shopItems.reduce(
      (sum, item) => sum + (cart[item.id] || 0) * item.price,
      0,
    );
  };

  const handleCheckout = async () => {
    setIsSubmitting(true);
    setError(null);

    if (!selectedRecipient) {
      setError(
        "No recipient selected. Please connect a recipient before checking out.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Faux API call to check if the recipient's flows can handle the transaction
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const canFlow = Math.random() < 0.8; // 80% chance of success for demo purposes

      if (!canFlow) {
        throw new Error(
          "Recipient's funding flows cannot complete this transaction.",
        );
      }

      // Faux API call to process the order
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Order placed successfully!");
      setCart({});
    } catch (error) {
      console.error("Error processing order:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
      toast.error("Failed to process order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = getTotalItems().toString() + " " + "items";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end items-center">
        <div className="flex items-center gap-0">
          <ShoppingBag />
          <span className="w-[7.5ch] text-right">{totalItems}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collector.shopItems.map((shopItem) => (
          <Card
            key={shopItem.id}
            className="p-4 flex flex-row justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <Emoji emoji={shopItem.emojiCodePoint} className="text-3xl" />
              <div>
                <p className="font-semibold">{shopItem.name}</p>
                <p className="text-sm text-gray-600">
                  ${shopItem.price.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => removeFromCart(shopItem.id)}
                disabled={!cart[shopItem.id]}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{cart[shopItem.id] || 0}</span>
              <Button
                size="icon"
                variant="outline"
                onClick={() => addToCart(shopItem.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <p className="font-semibold">Total: ${getTotalPrice().toFixed(2)}</p>
        <Button
          onClick={handleCheckout}
          disabled={isSubmitting || getTotalItems() === 0}
          className="bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600"
        >
          Checkout
        </Button>
      </div>
    </div>
  );
};

export { CollectorBody, CollectorHead };
