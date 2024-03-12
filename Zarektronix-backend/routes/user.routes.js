const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {authenticateUser} = require('../middlewares/authMiddleware');
const {User} = require('../model/user.model');

const userRouter = express.Router();



userRouter.post('/api/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Internal Server Error' });
  }
});


userRouter.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

  
    const token = jwt.sign({ userId: user._id, role: user.role }, 'vaishu', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ message: 'Internal Server Error' });
  }
});


userRouter.get('/api/protected-route', authenticateUser, (req, res) => {
 
  if (req.user.role !== 'Manager') {
    return res.status(400).json({ message: 'Access forbidden' });
  }

  res.status(200).json({ message: 'This is a protected route for Managers' });
});

module.exports={userRouter}