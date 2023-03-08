const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForUser } = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  return next();
});

userSchema.static(
  "matchPasswordAndGenrateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("User Not Found!");

    const salt = user.salt;
    const hashedPassword = user.password;
    const userProvidedHashed = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (hashedPassword !== userProvidedHashed)
      throw new Error("Incorrect Password!");

    const token = createTokenForUser(user);
    return token;
  }
);

const User = model("user", userSchema);

module.exports = User;