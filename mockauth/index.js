const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const app = express();
app.use(express.json());

const key = fs.readFileSync('/run/secrets/jwt_private.pem', 'utf8');

app.post('/auth/login', (req, res) => {
    const { email } = req.body;
    const role = email.startsWith('admin') ? 'Admin' : 'Client';
    const token = jwt.sign({ sub: Date.now(), email, role }, key, {
        algorithm: 'RS256',
        expiresIn: '1h',
    });
    res.json({ token });
});

app.listen(3001, () => console.log('Mock auth on 3001'));
