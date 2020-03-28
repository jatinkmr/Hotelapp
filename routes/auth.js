const router = require('express').Router();
const { notFound } = require("@hapi/boom");
const { registration, login } = require('../actions/auth');
const { addHotel, deleteHotel, editHotel, hotelList } = require('../actions/hotel');
const { addRoom, deleteRoom, editRoom, findRoom} = require('../actions/room');
const verify = require('./verifyToken');

router.post("/register", async (req, res, next) => {
    try{
        const response = await registration(req, res);
        return res.send(JSON.stringify(response));
    } catch(err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const response = await login(req, res);
        return res.send(JSON.stringify(response));
    } catch(err) {
        next(err);
    }
});

router.post('/addhotel', verify, async (req, res, next) => {
    try {
        const response = await addHotel(req, res);
        return  response;
    } catch(err) {
        next(err);
    }
});

router.delete('/deletehotel/:hotelID', verify, async (req, res, next) => {
    try {
        const response = await deleteHotel(req, res);
        return response;
    } catch(err) {
        next(err);
    }
});

router.put('/edithotel/:hotelID', verify, async (req, res, next) => {
    try {
        const response = await editHotel(req, res);
        return response;
    } catch(err) {
        next(err);
    }
});

router.get('/hotels', async (req, res, next) => {
    try {
        const response = await hotelList(req, res);
        return response;
    } catch(err) {
        next(err);
    }
});

router.post('/room', verify, async (req, res, next) => {
    try {
        const response = await addRoom(req, res);
        return response;
    } catch(err) {
        next(err);
    }
});

router.delete('/deleteRoom/:roomId', verify, async (req, res, next) => {
    try {
        const response = await deleteRoom(req, res);
        return response;
    } catch(err) {
        next(err);
    }
});

router.put('/editRoom/:roomId', verify, async (req, res, next) => {
    try {
        const response = await editRoom(req, res);
        return response;
    } catch(err) {
        next(err);
    }
});

router.get('/:hotelId/rooms', verify, async (req, res, next) => {
    try {
        const response = await findRoom(req, res);
        return response;
    } catch(err) {
        next(err);
    }
})

router.all("*", (req, res, next) => {
    next(notFound());
});

module.exports = router;
