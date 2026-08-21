import {
  BEER_FEATURED_URL,
  WINE_FEATURED_URL,
  YAMAZAKI_URL,
} from "./images.js";

export const navMenus = [
  {
    label: "Offers & Services",
    columns: [
      { heading: "Shop All" },
      { heading: "Best Sellers" },
      { heading: "In-Store promotions" },
      { heading: "General promotions" },
      { heading: "Gift Cards" },
      { heading: "Members" },
      { heading: "Clearance" },
    ],
  },
  {
    label: "Beer & Cider",
    columns: [
      { heading: "Lager", items: ["Pilsner", "Dark Lager", "Helles"] },
      { heading: "Ale", items: ["Pale Ale", "IPA", "Stout & Porter"] },
      { heading: "Cider", items: ["Apple", "Pear", "Fruit Cider"] },
    ],
    featured: {
      type: "image",
      image: BEER_FEATURED_URL,
      tag: "Featured Craft",
      title: "Balter XPA Collection",
    },
  },
  {
    label: "Premix",
    columns: [
      { heading: "Vodka Mixers", items: ["Hard Seltzer", "Lemonade"] },
      { heading: "Dark Spirits", items: ["Whiskey & Cola", "Rum & Ginger"] },
      { heading: "Cocktails", items: ["Margarita", "Espresso Martini"] },
    ],
    featured: {
      type: "icon",
      icon: "auto_awesome",
      tag: "Summer Hits",
      title: "Ready-to-drink Classics",
    },
  },
  {
    label: "Spirits",
    columns: [
      {
        heading: "Spirits",
        items: [
          "Gin",
          "Rum",
          "Vodka",
          "Bourbon",
          "Tequila",
          "Liqueurs",
          "Brandy & cognac",
          "Other Spirits",
        ],
      },
    ],
    featured: {
      type: "image-only",
      image: WINE_FEATURED_URL,
    },
  },
  {
    label: "Whisky",
    columns: [
      {
        heading: "Whisky",
        items: [
          "Other Whisky",
          "Scotch Whisky",
          "Japanese Whisky",
          "Irish Whisky",
          "American Whisky",
          "Australian Whisky",
        ],
      },
    ],
    featured: {
      type: "image",
      image: YAMAZAKI_URL,
      tag: "Featured",
      title: "Japanese Whisky Collection",
    },
  },
  {
    label: "Wine",
    columns: [
      {
        heading: "RED WINE",
        items: [
          "Shiraz",
          "Cabernet Sauvignon",
          "Pinot Noir",
          "Rosé",
          "Red Blends",
          "Merlot",
          "Cabernet Merlot",
          "Shiraz Cabernet",
          "Grenache",
          "Other Red Wine",
        ],
      },
      {
        heading: "WHITE WINE",
        items: [
          "Chardonnay",
          "Sauvignon Blanc",
          "Pinot Grigio",
          "Riesling",
          "Semillon Sauv Blanc",
          "Moscato",
          "Other White Wine",
        ],
      },
      {
        heading: "SPARKLING WINE",
        items: [
          "Champagne",
          "Prosecco",
          "Sparkling White Wine",
          "Sparkling Rosé Wine",
          "Other Sparkling Wine",
        ],
      },
      {
        heading: "Other Wine",
        items: ["Fortified Wine", "Zero% Alcohol Wine"],
      },
    ],
    featured: {
      type: "icon",
      icon: "auto_awesome",
      tag: "Summer Hits",
      title: "Ready-to-drink Classics",
    },
  },
  {
    label: "Zero %",
    columns: [
      {
        heading: "ZERO % ALCOHOL (0-0.5% ABV)",
        items: [
          "Zero % Alcohol Wine",
          "Zero % Alcohol Beer",
          "Zero % Alcohol Spirits",
          "Zero % Alcohol Premix",
          "Zero % Alcohol Cider",
        ],
      },
    ],
  },
  {
    label: "Brands",
    columns: [
      {
        heading: "Wine Brands (A–M)",
        items: [
          "19 Crimes",
          "Belena",
          "Brown Brothers",
          "De Bortoli",
          "Grant Burge",
          "Hardys",
          "Jacob's Creek",
          "Lindeman's",
          "McGuigan",
        ],
      },
      {
        heading: "Wine Brands (N–Z)",
        items: [
          "Penfolds",
          "Pepperjack",
          "Squealing Pig",
          "Taylors",
          "Tread Softly",
          "Wolf Blass",
          "Yalumba",
          "Yellowtail",
        ],
      },
      {
        heading: "Whisky Brands",
        items: [
          "Canadian Club",
          "Jack Daniel's",
          "Jameson",
          "Jim Beam",
          "Johnnie Walker",
          "Suntory",
          "Wild Turkey",
        ],
      },
      {
        heading: "Spirits, Beer & Premix Brands",
        items: [
          "Absolut",
          "Bundaberg Rum",
          "Coopers",
          "Farmhand",
          "Great Northern Brewing Co.",
          "Hard Rated",
          "Smirnoff",
          "Vodka Cruiser",
          "Woodstock",
        ],
      },
    ],
  },
];
