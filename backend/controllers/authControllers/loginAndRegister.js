import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
// Register new user
export const registerUser = async(req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password || !role) {
          return res.status(400).json({ message: "All fields are required" });
        }
    
        if (!validator.isEmail(email)) {
          return res.status(400).json({ message: "Invalid email format" });
        }
        const existingUser = await User.findOne({ email: email.toString() });
        if (existingUser) {
          return res.status(400).json({ message: "Email already registered" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user document
        const newUser = new User({
          username,
          email,
          password: hashedPassword,
          role,
          profile: {
            avatarUrl: "/uploads/thousandSunny.jpg",
            bio: "This is a bio",
          },
        });
        
    await newUser.save();
    // Generate JWT token
    const token = jwt.sign(
        { id: newUser._id, role: newUser.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d'}
    );

    res.status(201).json({
        message: "User registered successfully",
        token,
        user: { id: newUser._id, username: newUser.username, role: newUser.role },
      });
    } 
    
    catch (error) {
      console.error("Error in registerUser:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
};
// Login existing user
export const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "Invalid credentials" });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      // Send response with token
      res.json({
        message: "Login successful",
        token,
        user: { id: user._id, username: user.username, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };