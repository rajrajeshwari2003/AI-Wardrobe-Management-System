import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Sparkles,
  TrendingUp,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner@2.0.3";
import type { WardrobeItem, Event } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface OutfitGeneratorProps {
  wardrobeItems: WardrobeItem[];
  events: Event[];
}

interface GeneratedOutfit {
  items: WardrobeItem[];
  score: number;
  occasion: string;
  weather: string;
  dressColor: string;
  missingCategories: string[];
}

export function OutfitGenerator({ wardrobeItems }: OutfitGeneratorProps) {
  const [occasionInput, setOccasionInput] = useState("");
  const [weatherInput, setWeatherInput] = useState("");
  const [dressColorInput, setDressColorInput] = useState("");

  const [reaction, setReaction] = useState<"like" | "dislike" | null>(null);

  const [currentOutfit, setCurrentOutfit] =
    useState<GeneratedOutfit | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateOutfit = () => {
    if (wardrobeItems.length === 0) {
      toast.error("Add items to your wardrobe first!");
      return;
    }

    if (
      !occasionInput.trim() &&
      !weatherInput.trim() &&
      !dressColorInput.trim()
    ) {
      toast.error("Please describe at least Occasion, Weather, or Color");
      return;
    }

    setReaction(null);
    setIsGenerating(true);

    setTimeout(() => {
      const outfit = generateAIOutfit(
        occasionInput,
        weatherInput,
        dressColorInput
      );
      setCurrentOutfit(outfit);
      setIsGenerating(false);

      if (outfit.missingCategories.length > 0) {
        toast.info(
          `Missing: ${outfit.missingCategories.join(", ")}`
        );
      } else {
        toast.success("Perfect outfit generated!");
      }
    }, 1500);
  };

  const generateAIOutfit = (
    occasion: string,
    weather: string,
    dressColor: string
  ): GeneratedOutfit => {
    const scored = wardrobeItems.map((item) => {
      let score = 0;

      const occasionLower = occasion.toLowerCase();
      const weatherLower = weather.toLowerCase();

      /** Occasion scoring */
      if (
        occasionLower.includes("formal") ||
        occasionLower.includes("office") ||
        occasionLower.includes("work")
      ) {
        if (item.style === "formal") score += 30;
      } else if (
        occasionLower.includes("casual") ||
        occasionLower.includes("weekend")
      ) {
        if (item.style === "casual") score += 30;
      } else if (
        occasionLower.includes("party") ||
        occasionLower.includes("dinner")
      ) {
        if (item.style === "party") score += 30;
      } else if (
        occasionLower.includes("traditional") ||
        occasionLower.includes("festival")
      ) {
        if (item.style === "traditional") score += 30;
      }

      /** Color preference scoring */
      if (dressColor.trim() !== "") {
        const userColor = dressColor.toLowerCase();
        const itemColor = item.color?.toLowerCase() || "";

        if (itemColor.includes(userColor)) score += 25;

        if (userColor.includes("neutral")) {
          if (
            itemColor.includes("white") ||
            itemColor.includes("grey") ||
            itemColor.includes("cream")
          )
            score += 20;
        }

        if (userColor.includes("pastel")) {
          if (
            itemColor.includes("pink") ||
            itemColor.includes("sky") ||
            itemColor.includes("mint") ||
            itemColor.includes("lavender")
          )
            score += 20;
        }
      }

      /** Weather scoring */
      if (weatherLower.includes("rain") && item.category === "footwear") {
        score += 15;
      }

      if (
        weatherLower.includes("sunny") ||
        weatherLower.includes("warm")
      ) {
        if (
          item.color?.toLowerCase().includes("light") ||
          item.color?.toLowerCase().includes("white")
        )
          score += 10;
      }

      if (
        weatherLower.includes("cold") ||
        weatherLower.includes("winter")
      ) {
        if (item.category === "top") score += 15;
      }

      /** Random factor */
      score += Math.random() * 20;

      return { item, score };
    });

    /** Category selection */
    const categories = ["top", "bottom", "shoes", "accessories", "bags"];
    const selectedItems: WardrobeItem[] = [];
    const missingCategories: string[] = [];

    categories.forEach((cat) => {
      const items = scored.filter((s) => s.item.category === cat);
      if (items.length > 0) {
        selectedItems.push(
          items.sort((a, b) => b.score - a.score)[0].item
        );
      } else {
        missingCategories.push(cat);
      }
    });

    /** Traditional wear */
    if (
      occasion.toLowerCase().includes("traditional") ||
      occasion.toLowerCase().includes("festival")
    ) {
      const traditionalItem = scored.find(
        (s) => s.item.category === "traditional"
      );
      if (traditionalItem) selectedItems.push(traditionalItem.item);
      else missingCategories.push("traditional wear");
    }

    return {
      items: selectedItems,
      score:
        selectedItems.length > 0
          ? Math.round((selectedItems.length / categories.length) * 100)
          : 0,
      occasion,
      weather,
      dressColor,
      missingCategories,
    };
  };

  /** Generate shopping links */
  const getShoppingLinks = (name: string, color?: string) => {
    const q = encodeURIComponent(`${name} ${color || ""}`.trim());
    return {
      amazon: `https://www.amazon.in/s?k=${q}`,
      flipkart: `https://www.flipkart.com/search?q=${q}`,
      myntra: `https://www.myntra.com/${q}`,
      ajio: `https://www.ajio.com/search/?text=${q}`,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1>AI Outfit Generator</h1>
        <Sparkles className="w-8 h-8 text-gray-300" />
      </div>

      {/* Input Section */}
      <div className="bg-white rounded-lg p-6 space-y-6">
        <div className="space-y-2">
          <label>Occasion</label>
          <Textarea
            placeholder="E.g., Office meeting, Dinner date..."
            value={occasionInput}
            onChange={(e) => setOccasionInput(e.target.value)}
            disabled={isGenerating}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label>Weather / Season</label>
          <Textarea
            placeholder="E.g., Sunny and warm, Rainy..."
            value={weatherInput}
            onChange={(e) => setWeatherInput(e.target.value)}
            disabled={isGenerating}
            className="min-h-[100px]"
          />
        </div>

        <div className="space-y-2">
          <label>Preferred Dress Color</label>
          <input
            type="text"
            placeholder="Black, Red, Pastel, Neutral..."
            value={dressColorInput}
            onChange={(e) => setDressColorInput(e.target.value)}
            disabled={isGenerating}
            className="w-full border px-4 py-3 rounded-md bg-gray-100"
          />
        </div>

        <Button
          onClick={generateOutfit}
          disabled={isGenerating || wardrobeItems.length === 0}
          className="w-full bg-black text-white py-6 rounded-lg hover:bg-gray-800"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Outfit Suggestions
            </>
          )}
        </Button>
      </div>

      {/* Output Section */}
      {currentOutfit && (
        <div className="bg-white rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2>Recommended Outfit</h2>
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="w-4 h-4" />
              {currentOutfit.score}% Match
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            <p>
              <span className="text-gray-600 text-sm">Occasion: </span>
              {currentOutfit.occasion}
            </p>

            {currentOutfit.weather && (
              <p>
                <span className="text-gray-600 text-sm">Weather: </span>
                {currentOutfit.weather}
              </p>
            )}

            {currentOutfit.dressColor && (
              <p>
                <span className="text-gray-600 text-sm">
                  Preferred Color:{" "}
                </span>
                <span className="capitalize">
                  {currentOutfit.dressColor}
                </span>
              </p>
            )}
          </div>

          {/* Outfit Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {currentOutfit.items.map((item) => {
              const links = getShoppingLinks(item.name, item.color);

              return (
                <div key={item.id} className="space-y-3">
                  <div className="bg-gray-50 rounded-xl overflow-hidden aspect-square">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {item.category}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={links.amazon}
                      className="glass-card"
                      target="_blank"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Amazon
                    </a>

                    <a
                      href={links.flipkart}
                      className="glass-card"
                      target="_blank"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Flipkart
                    </a>

                    <a
                      href={links.myntra}
                      className="glass-card"
                      target="_blank"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Myntra
                    </a>

                    <a
                      href={links.ajio}
                      className="glass-card"
                      target="_blank"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Ajio
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MISSING CATEGORIES + ONLINE LINKS */}
          {currentOutfit.missingCategories.length > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-6">
              <h3 className="text-orange-800 font-medium text-lg">
                Missing Items in Your Wardrobe
              </h3>

              {/* Show missing categories */}
              <div className="flex flex-wrap gap-2">
                {currentOutfit.missingCategories.map((cat) => (
                  <Badge
                    key={cat}
                    className="capitalize bg-orange-200 text-orange-800"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Show shopping links for missing categories */}
              <div className="space-y-6">
                {currentOutfit.missingCategories.map((cat) => {
                  const q = encodeURIComponent(cat);

                  const links = {
                    amazon: `https://www.amazon.in/s?k=${q}`,
                    flipkart: `https://www.flipkart.com/search?q=${q}`,
                    myntra: `https://www.myntra.com/${q}`,
                    ajio: `https://www.ajio.com/search/?text=${q}`,
                  };

                  return (
                    <div key={cat} className="space-y-3">
                      <h4 className="text-sm font-semibold text-orange-900">
                        🛍 Buy {cat} Online
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <a
                          href={links.amazon}
                          className="glass-card"
                          target="_blank"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Amazon
                        </a>

                        <a
                          href={links.flipkart}
                          className="glass-card"
                          target="_blank"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Flipkart
                        </a>

                        <a
                          href={links.myntra}
                          className="glass-card"
                          target="_blank"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Myntra
                        </a>

                        <a
                          href={links.ajio}
                          className="glass-card"
                          target="_blank"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Ajio
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Likes */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() => setReaction("like")}
              className={`px-6 py-2 rounded-full border text-sm transition ${
                reaction === "like"
                  ? "bg-green-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              ❤️ Like
            </button>

            <button
              onClick={() => setReaction("dislike")}
              className={`px-6 py-2 rounded-full border text-sm transition ${
                reaction === "dislike"
                  ? "bg-red-600 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              👎 Dislike
            </button>
          </div>

          {reaction === "like" && (
            <p className="text-center text-green-700 font-medium">
              🎉 Glad you liked this outfit!
            </p>
          )}

          {reaction === "dislike" && (
            <p className="text-center text-red-700 font-medium">
              😕 Thanks — we'll improve your next suggestion!
            </p>
          )}

          <Button
            onClick={generateOutfit}
            variant="outline"
            className="w-full mt-4 rounded-full"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Another Outfit
          </Button>
        </div>
      )}
    </div>
  );
}
