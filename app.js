const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
let items = [
    { id: 1, name: 'shirt' },
    { id: 2, name: 'pants' },
];

app.get('/api/items', (req, res) => {
    res.json(items);
});

app.get('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = items.find((item) => item.id === id);

    if (item) {
        res.json(item);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
});

app.post('/api/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        name: req.body.name,
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
        items[itemIndex].name = req.body.name;
        res.json(items[itemIndex]);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
});

app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const itemIndex = items.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
        const deletedItem = items.splice(itemIndex, 1);
        res.json(deletedItem);
    } else {
        res.status(404).send({ message: 'Item not found' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
