const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
app.use(express.json());

const key = fs.readFileSync('/run/secrets/jwt_private.pem', 'utf8');

const users = [
    { id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', email: 'admin@example.com', fullname: 'Bob Johnson', role: 'Admin', passwordHash: '$2b$10$u1sfl9kTzBj7bVj5k9SnlOlXfIaxYe99KSRrsZlBJ8AyoXfFVKX.6' },
    { id: 'd290f1ee-e69b-4dd3-a456-426614174000', email: 'client@example.com', fullname: 'Diana Taylor', role: 'Client', passwordHash: '$2b$10$2ZPgZynq2vAVBjiVKyObM.5FVAt9ks6Wz3m3pCqzAV8CUWk0UOfZy' },
    { id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', email: 'alice@example.com', fullname: 'Alice Smith', role: 'Client', passwordHash: '$2b$10$A9mHG7ZXyl1YebFK9aTZ5OCvItxfDGSAPTOZsmDRhE1Vzvn3AkU3S' },
];

app.post('/auth/login', (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = users.find(u => u.email === email);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // uuid sub
    const token = jwt.sign({ sub: user.id, email, fullname: user.fullname, role: user.role }, key, {
        algorithm: 'RS256',
        expiresIn: '1h',
    });
    res.json({ token });
});

app.listen(3001, () => console.log('Mock auth on 3001'));
