import{ authenticateToken }from '../middleware/middleware.js';
router.post('/logout',authenticateToken, async (req, res) => {
    try {
      // Assuming you send the token in the request header
      const authToken = req.header('Authorization').replace('Bearer ', '');
      
      // Remove the token from the authTokens array
      user.authTokens = user.authTokens.filter((token) => token !== authToken);
      await user.save();
  
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error during logout:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  });


