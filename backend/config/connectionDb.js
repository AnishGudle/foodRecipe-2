const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING, {
      tls: true, // Ensures secure connection (especially for Atlas)
      tlsAllowInvalidCertificates: false, // Avoids handshake issues
    });
    console.log("✅ MongoDB connected...");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;
