import express from 'express';
import cors from 'cors';

const PORT = 8000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })) 
app.use(express.json()) 

app.post('/signup', async(req, resp) => {
   const {username, email, password} = req.body; 


   
   console.log("Username: " + username + "\n", "Email: " + email + "\n", "Password: " + password);

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
