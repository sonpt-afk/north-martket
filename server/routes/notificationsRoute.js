const router = require("express").Router();

const authMiddleware = require("../middlewares/authMiddleware");
const Notification = require("../models/notificationsModel");

// add a new notification
router.post('/notify', authMiddleware, async (req, res) => {
    try {
        // Validate required fields
        const { title, message, user, onClick } = req.body;
        if (!title || !message || !user || !onClick) {
            throw new Error('Required fields missing');
        }

        const newNotification = new Notification(req.body);
        await newNotification.save();
        res.send({
            success: true,
            message: 'Notification added successfully'
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});


//get all notifications by user id
router.get('/get-all-notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await Notification
            .find({ user: req.body.userId })
            .sort({ createdAt: -1 });
        res.send({
            success: true,
            data: notifications
        });
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        });
    }
});

//delete a notification
router.delete('/delete-notification/:id', authMiddleware, async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id)
        res.send({
            success: true,
            message: 'Notification deleted successfully'
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
})

//read all notifications by user
router.put('/read-all-notifications', authMiddleware, async (req, res) => {
    try {
        await Notification.updateMany({ user: req.body.userId, read:false }, {$set:{read: true }})
        res.send({
            success: true,
            message: 'All Notifications marked as read'
        })
    } catch
        (error) {
        res.send({
            success: false,
            message: error.message
        })
    }
}
)


module.exports = router;