import express from 'express';
import cors from 'cors';

const PORT = 8000;
const app = express();

app.use(cors({ origin: 'http://localhost:5173' })) 
app.use(express.json()) 



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
