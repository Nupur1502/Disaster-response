// geminiClient.js (Free Dummy Version)

// Dummy location extractor
async function extractLocation(description) {
  console.log("🧪 Dummy location extraction running...");

  if (description.toLowerCase().includes("delhi")) return "Delhi";
  if (description.toLowerCase().includes("mumbai")) return "Mumbai";
  if (description.toLowerCase().includes("chennai")) return "Chennai";
  if (description.toLowerCase().includes("bangalore")) return "Bangalore";

  return "Unknown Location";
}

// Dummy image verification
async function verifyImageWithGemini(imageUrl) {
  console.log("🧪 Dummy image verification running...");

  if (imageUrl.includes("fake") || imageUrl.includes("ai")) return "manipulated";
  if (imageUrl.includes("real") || imageUrl.includes("verified")) return "verified";

  return "unclear";
}

// ✅ Export both functions
module.exports = {
  extractLocation,
  verifyImageWithGemini,
};


